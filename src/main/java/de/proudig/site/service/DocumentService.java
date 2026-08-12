package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.DocumentShare;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.FolderRepository;
import de.proudig.site.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final FolderRepository folderRepository;
    private final FileStorageService fileStorageService;
    private final ActivityLogService activityLogService;
    private final DocumentShareRepository shareRepository;
    private final UserRepository userRepository;
    private final PortalAccessService access;

    public DocumentDto uploadDocument(MultipartFile file, String folderId, String description, User user) throws IOException {
        String storagePath = fileStorageService.store(file, "documents");
        Document document = Document.builder().fileName(file.getOriginalFilename()).contentType(file.getContentType()).storagePath(storagePath).fileSize(file.getSize()).uploadedBy(user).description(description).build();
        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found"));
            if (!access.canWrite(user, folder)) {
                throw new IllegalAccessError("Access denied");
            }
            document.setFolder(folder);
        }
        document = documentRepository.save(document);
        activityLogService.log(user, "UPLOAD", "DOCUMENT", document.getId(), document.getFileName());
        return mapToDto(document);
    }

    public List<DocumentDto> getDocumentsByUser(User user) {
        // Nur ADMIN sieht alle Dokumente; CONSULTANT nur eigene.
        List<Document> documents = isAdmin(user) ? documentRepository.findAll() : documentRepository.findByUploadedBy(user);
        return documents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<DocumentDto> getSharedWithMe(User user) {
        return shareRepository.findBySharedWith(user).stream()
            .map(share -> mapToDto(share.getDocument()))
            .collect(Collectors.toList());
    }

    public List<DocumentDto> getDocumentsInFolder(String folderId, User user) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found"));
        if (!access.canRead(user, folder)) {
            throw new IllegalAccessError("Access denied");
        }
        return documentRepository.findByFolder(folder).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public DocumentDto getDocument(String documentId, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (!canAccess(user, document)) {
            // Für Nicht-Berechtigte verhält sich das Dokument als nicht vorhanden.
            throw new NoSuchElementException("Document not found");
        }
        return mapToDto(document);
    }

    /**
     * Für den Download: liefert das Dokument nur, wenn der Benutzer Zugriff hat
     * (Eigentümer, geteilt oder ADMIN); sonst {@link IllegalAccessError} (HTTP 403).
     */
    public DocumentDto getDocumentForDownload(String documentId, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found: " + documentId));
        if (!canAccess(user, document)) {
            throw new IllegalAccessError("Access denied");
        }
        return mapToDto(document);
    }

    public DocumentDto updateDocument(String documentId, String description, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        // Schreiben verlangt Eigentum oder ADMIN — eine Freigabe berechtigt NICHT.
        if (!document.getUploadedBy().getId().equals(user.getId()) && !isAdmin(user)) {
            throw new NoSuchElementException("Document not found");
        }
        document.setDescription(description);
        document.setUpdatedAt(Instant.now());
        document = documentRepository.save(document);
        return mapToDto(document);
    }

    public void deleteDocument(String documentId, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (!access.canModifyDocument(user, document)) {
            throw new NoSuchElementException("Document not found");
        }
        fileStorageService.delete(document.getStoragePath(), "documents");
        activityLogService.log(user, "DELETE", "DOCUMENT", document.getId(), document.getFileName());
        documentRepository.delete(document);
    }

    /**
     * Ersetzt den Inhalt einer vorhandenen Datei (keine Versionierung). Erlaubt für
     * ADMIN/Eigentümer oder WRITE-Empfänger auf dem Ordner (auch fremde Dateien).
     */
    public DocumentDto updateDocumentContent(String documentId, MultipartFile file, User user) throws IOException {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (!access.canUpdateDocumentContent(user, document)) {
            throw new IllegalAccessError("Access denied");
        }
        fileStorageService.delete(document.getStoragePath(), "documents");
        String storagePath = fileStorageService.store(file, "documents");
        document.setStoragePath(storagePath);
        document.setFileSize(file.getSize());
        document.setContentType(file.getContentType());
        document.setUpdatedAt(Instant.now());
        document = documentRepository.save(document);
        activityLogService.log(user, "UPDATE", "DOCUMENT", document.getId(), document.getFileName());
        return mapToDto(document);
    }

    /** ADMIN teilt ein Dokument lesend mit einem Benutzer. Idempotent. */
    public DocumentDto shareDocument(String documentId, String userId, User admin) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        User grantee = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        if (!shareRepository.existsByDocumentAndSharedWith(document, grantee)) {
            shareRepository.save(DocumentShare.builder().document(document).sharedWith(grantee).sharedBy(admin).build());
            activityLogService.log(admin, "SHARE", "DOCUMENT", document.getId(), document.getFileName());
        }
        return mapToDto(document);
    }

    /** ADMIN widerruft die Freigabe eines Dokuments für einen Benutzer. */
    @Transactional
    public void unshareDocument(String documentId, String userId, User admin) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        User grantee = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        shareRepository.deleteByDocumentAndSharedWith(document, grantee);
        activityLogService.log(admin, "UNSHARE", "DOCUMENT", document.getId(), document.getFileName());
    }

    /** Grantees eines Dokuments (für die Admin-Freigabeverwaltung). */
    public List<java.util.Map<String, String>> getSharedUsers(String documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        return shareRepository.findByDocument(document).stream()
            .map(share -> java.util.Map.of(
                "userId", share.getSharedWith().getId(),
                "name", share.getSharedWith().getFirstName() + " " + share.getSharedWith().getLastName()))
            .collect(Collectors.toList());
    }

    /** Zentrale Zugriffsregel (delegiert an {@link PortalAccessService}): ADMIN,
     *  Eigentümer, Einzel-Datei-Freigabe oder Ordner-READ/WRITE (folder-vererbt). */
    public boolean canAccess(User user, Document document) {
        return access.canReadDocument(user, document);
    }

    public String getDocumentFilePath(String documentId, User user) {
        Document document = documentRepository.findByIdAndUploadedBy(documentId, user).orElseThrow(() -> new NoSuchElementException("Document not found"));
        return document.getStoragePath();
    }

    private boolean isAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    private DocumentDto mapToDto(Document document) {
        return DocumentDto.builder().id(document.getId()).fileName(document.getFileName()).storagePath(document.getStoragePath()).contentType(document.getContentType()).fileSize(document.getFileSize()).folderId(document.getFolder() != null ? document.getFolder().getId() : null).uploadedById(document.getUploadedBy().getId()).uploadedByName(document.getUploadedBy().getFirstName() + " " + document.getUploadedBy().getLastName()).description(document.getDescription()).createdAt(document.getCreatedAt()).updatedAt(document.getUpdatedAt()).build();
    }

    public DocumentService(final DocumentRepository documentRepository, final FolderRepository folderRepository, final FileStorageService fileStorageService, final ActivityLogService activityLogService, final DocumentShareRepository shareRepository, final UserRepository userRepository, final PortalAccessService access) {
        this.documentRepository = documentRepository;
        this.folderRepository = folderRepository;
        this.fileStorageService = fileStorageService;
        this.activityLogService = activityLogService;
        this.shareRepository = shareRepository;
        this.userRepository = userRepository;
        this.access = access;
    }
}

package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.FolderRepository;
import org.springframework.stereotype.Service;
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

    public DocumentDto uploadDocument(MultipartFile file, String folderId, String description, User user) throws IOException {
        String storagePath = fileStorageService.store(file, "documents");
        Document document = Document.builder().fileName(file.getOriginalFilename()).contentType(file.getContentType()).storagePath(storagePath).fileSize(file.getSize()).uploadedBy(user).description(description).build();
        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found"));
            if (!folder.getOwner().getId().equals(user.getId()) && !isAdmin(user)) {
                throw new IllegalAccessError("Access denied");
            }
            document.setFolder(folder);
        }
        document = documentRepository.save(document);
        activityLogService.log(user, "UPLOAD", "DOCUMENT", document.getId(), document.getFileName());
        return mapToDto(document);
    }

    public List<DocumentDto> getDocumentsByUser(User user) {
        List<Document> documents = isStaff(user) ? documentRepository.findAll() : documentRepository.findByUploadedBy(user);
        return documents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<DocumentDto> getDocumentsInFolder(String folderId, User user) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found"));
        if (!folder.getOwner().getId().equals(user.getId()) && !isStaff(user)) {
            throw new IllegalAccessError("Access denied");
        }
        return documentRepository.findByFolder(folder).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public DocumentDto getDocument(String documentId, User user) {
        Document document = isStaff(user)
            ? documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"))
            : documentRepository.findByIdAndUploadedBy(documentId, user).orElseThrow(() -> new NoSuchElementException("Document not found"));
        return mapToDto(document);
    }

    public DocumentDto getDocumentById(String documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found: " + documentId));
        return mapToDto(document);
    }

    public DocumentDto updateDocument(String documentId, String description, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
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
        if (!document.getUploadedBy().getId().equals(user.getId()) && !isAdmin(user)) {
            throw new NoSuchElementException("Document not found");
        }
        fileStorageService.delete(document.getStoragePath(), "documents");
        activityLogService.log(user, "DELETE", "DOCUMENT", document.getId(), document.getFileName());
        documentRepository.delete(document);
    }

    public String getDocumentFilePath(String documentId, User user) {
        Document document = documentRepository.findByIdAndUploadedBy(documentId, user).orElseThrow(() -> new NoSuchElementException("Document not found"));
        return document.getStoragePath();
    }

    private boolean isStaff(User user) {
        return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()) || "CONSULTANT".equals(role.getName()));
    }

    private boolean isAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    private DocumentDto mapToDto(Document document) {
        return DocumentDto.builder().id(document.getId()).fileName(document.getFileName()).storagePath(document.getStoragePath()).contentType(document.getContentType()).fileSize(document.getFileSize()).folderId(document.getFolder() != null ? document.getFolder().getId() : null).uploadedById(document.getUploadedBy().getId()).uploadedByName(document.getUploadedBy().getFirstName() + " " + document.getUploadedBy().getLastName()).description(document.getDescription()).createdAt(document.getCreatedAt()).updatedAt(document.getUpdatedAt()).build();
    }

    public DocumentService(final DocumentRepository documentRepository, final FolderRepository folderRepository, final FileStorageService fileStorageService, final ActivityLogService activityLogService) {
        this.documentRepository = documentRepository;
        this.folderRepository = folderRepository;
        this.fileStorageService = fileStorageService;
        this.activityLogService = activityLogService;
    }
}

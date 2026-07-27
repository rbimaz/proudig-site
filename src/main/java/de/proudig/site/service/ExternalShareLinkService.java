package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.ExternalShareLink;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import de.proudig.site.dto.ExternalShareLinkDto;
import de.proudig.site.dto.PublicShareFileDto;
import de.proudig.site.dto.PublicShareMetaDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.ExternalShareLinkRepository;
import de.proudig.site.repository.FolderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ExternalShareLinkService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final int MAX_PASSWORD_ATTEMPTS = 5;

    private final ExternalShareLinkRepository shareRepository;
    private final DocumentRepository documentRepository;
    private final FolderRepository folderRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    // Einfacher In-Memory-Brute-Force-Schutz: fehlgeschlagene Passwortversuche je Token.
    private final ConcurrentHashMap<String, Integer> failedAttempts = new ConcurrentHashMap<>();

    // ---------- Admin ----------

    public ExternalShareLinkDto create(String documentId, String folderId, String rawPassword,
                                       Instant expiresAt, String recipientEmail, User admin) {
        boolean hasDoc = documentId != null && !documentId.isBlank();
        boolean hasFolder = folderId != null && !folderId.isBlank();
        if (hasDoc == hasFolder) {
            throw new IllegalArgumentException("Genau ein Ziel (documentId oder folderId) erforderlich");
        }

        ExternalShareLink link = new ExternalShareLink();
        link.setToken(generateToken());
        link.setCreatedBy(admin);
        link.setExpiresAt(expiresAt);
        link.setRecipientEmail(recipientEmail);
        if (rawPassword != null && !rawPassword.isBlank()) {
            link.setPasswordHash(passwordEncoder.encode(rawPassword));
        }

        String entityType;
        String targetId;
        if (hasDoc) {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new NoSuchElementException("Document not found"));
            link.setDocument(document);
            entityType = "DOCUMENT";
            targetId = document.getId();
        } else {
            Folder folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new NoSuchElementException("Folder not found"));
            link.setFolder(folder);
            entityType = "FOLDER";
            targetId = folder.getId();
        }

        link = shareRepository.save(link);
        activityLogService.log(admin, "SHARE_LINK_CREATED", entityType, targetId,
                "Externer Freigabe-Link erstellt" + (link.getExpiresAt() != null ? " (Ablauf " + link.getExpiresAt() + ")" : ""));
        return ExternalShareLinkDto.of(link);
    }

    public List<ExternalShareLinkDto> list(String documentId, String folderId) {
        List<ExternalShareLink> links;
        if (documentId != null && !documentId.isBlank()) {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new NoSuchElementException("Document not found"));
            links = shareRepository.findByDocument(document);
        } else if (folderId != null && !folderId.isBlank()) {
            Folder folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new NoSuchElementException("Folder not found"));
            links = shareRepository.findByFolder(folder);
        } else {
            links = shareRepository.findByRevokedFalseOrderByCreatedAtDesc();
        }
        return links.stream().map(ExternalShareLinkDto::of).collect(Collectors.toList());
    }

    public void revoke(String id, User admin) {
        ExternalShareLink link = shareRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Share link not found"));
        link.setRevoked(true);
        shareRepository.save(link);
        boolean folder = link.isFolderLink();
        activityLogService.log(admin, "SHARE_LINK_REVOKED", folder ? "FOLDER" : "DOCUMENT",
                folder ? link.getFolder().getId() : link.getDocument().getId(), "Externer Freigabe-Link widerrufen");
    }

    // ---------- Öffentlich ----------

    public PublicShareMetaDto meta(String token) {
        ExternalShareLink link = shareRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        boolean folder = link.isFolderLink();
        return new PublicShareMetaDto(
                folder ? "FOLDER" : "DOCUMENT",
                folder ? link.getFolder().getName() : link.getDocument().getFileName(),
                link.getPasswordHash() != null,
                link.isValid());
    }

    public List<PublicShareFileDto> listFolderFiles(String token, String password) {
        ExternalShareLink link = requireValid(token);
        if (!link.isFolderLink()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kein Ordner-Link");
        }
        checkPassword(link, password);
        List<PublicShareFileDto> files = new ArrayList<>();
        collectFiles(link.getFolder(), "", files);
        return files;
    }

    /** Validiert den Zugriff und gibt das herunterladbare Dokument zurück; zählt den Zugriff. */
    public Document resolveDownload(String token, String documentId, String password) {
        ExternalShareLink link = requireValid(token);
        checkPassword(link, password);

        Document document;
        if (link.isFolderLink()) {
            if (documentId == null || documentId.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "documentId erforderlich");
            }
            document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            if (!isInSubtree(document, link.getFolder())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Datei außerhalb des Ordners");
            }
        } else {
            document = link.getDocument();
        }

        link.setAccessCount(link.getAccessCount() + 1);
        link.setLastAccessedAt(Instant.now());
        shareRepository.save(link);
        activityLogService.log(link.getCreatedBy(), "SHARE_LINK_ACCESSED", "DOCUMENT", document.getId(),
                "Download über Freigabe-Link" + (link.getRecipientEmail() != null ? " (" + link.getRecipientEmail() + ")" : ""));
        return document;
    }

    // ---------- Helpers ----------

    private ExternalShareLink requireValid(String token) {
        ExternalShareLink link = shareRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!link.isValid()) {
            throw new ResponseStatusException(HttpStatus.GONE, "Link abgelaufen oder widerrufen");
        }
        return link;
    }

    private void checkPassword(ExternalShareLink link, String password) {
        if (link.getPasswordHash() == null) {
            return;
        }
        if (failedAttempts.getOrDefault(link.getToken(), 0) >= MAX_PASSWORD_ATTEMPTS) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Zu viele Passwortversuche");
        }
        if (password == null || !passwordEncoder.matches(password, link.getPasswordHash())) {
            failedAttempts.merge(link.getToken(), 1, Integer::sum);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Passwort erforderlich oder falsch");
        }
        failedAttempts.remove(link.getToken());
    }

    private boolean isInSubtree(Document document, Folder root) {
        Folder folder = document.getFolder();
        while (folder != null) {
            if (folder.getId().equals(root.getId())) {
                return true;
            }
            folder = folder.getParentFolder();
        }
        return false;
    }

    private void collectFiles(Folder folder, String prefix, List<PublicShareFileDto> out) {
        for (Document doc : documentRepository.findByFolder(folder)) {
            out.add(new PublicShareFileDto(doc.getId(), doc.getFileName(), prefix + doc.getFileName(), doc.getFileSize()));
        }
        for (Folder child : folderRepository.findByParentFolder(folder)) {
            collectFiles(child, prefix + child.getName() + "/", out);
        }
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return URL_ENCODER.encodeToString(bytes);
    }

    public ExternalShareLinkService(final ExternalShareLinkRepository shareRepository,
                                    final DocumentRepository documentRepository,
                                    final FolderRepository folderRepository,
                                    final PasswordEncoder passwordEncoder,
                                    final ActivityLogService activityLogService) {
        this.shareRepository = shareRepository;
        this.documentRepository = documentRepository;
        this.folderRepository = folderRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
    }
}

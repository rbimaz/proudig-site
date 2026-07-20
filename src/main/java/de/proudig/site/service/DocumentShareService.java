package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.DocumentPermission;
import de.proudig.site.domain.DocumentShare;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentShareDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DocumentShareService {
    private final DocumentShareRepository documentShareRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public DocumentShareDto shareDocument(String documentId, String sharedWithEmail, DocumentPermission permission, Instant expiresAt, User sharedBy) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (!document.getUploadedBy().getId().equals(sharedBy.getId())) {
            throw new IllegalAccessError("Only document owner can share");
        }
        User sharedWithUser = userRepository.findByEmail(sharedWithEmail).orElseThrow(() -> new NoSuchElementException("User not found: " + sharedWithEmail));
        DocumentShare share = DocumentShare.builder().document(document).sharedWith(sharedWithUser).sharedBy(sharedBy).permission(permission).expiresAt(expiresAt).build();
        share = documentShareRepository.save(share);
        activityLogService.log(sharedBy, "SHARE", "DOCUMENT", document.getId(), "Shared with " + sharedWithUser.getEmail());
        return mapToDto(share);
    }

    public List<DocumentShareDto> getSharedWithMe(User user) {
        return documentShareRepository.findBySharedWith(user).stream().filter(share -> share.getExpiresAt() == null || share.getExpiresAt().isAfter(Instant.now())).map(this::mapToDto).collect(Collectors.toList());
    }

    public List<DocumentShareDto> getDocumentShares(String documentId, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (!document.getUploadedBy().getId().equals(user.getId())) {
            throw new IllegalAccessError("Only document owner can view shares");
        }
        return documentShareRepository.findByDocument(document).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public void removeShare(String shareId, User user) {
        DocumentShare share = documentShareRepository.findById(shareId).orElseThrow(() -> new NoSuchElementException("Share not found"));
        if (!share.getDocument().getUploadedBy().getId().equals(user.getId()) && !share.getSharedWith().getId().equals(user.getId())) {
            throw new IllegalAccessError("Access denied");
        }
        activityLogService.log(user, "UNSHARE", "DOCUMENT", share.getDocument().getId(), "Unshared with " + share.getSharedWith().getEmail());
        documentShareRepository.delete(share);
    }

    public boolean canAccessDocument(String documentId, User user) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (document.getUploadedBy().getId().equals(user.getId())) {
            return true;
        }
        return documentShareRepository.findByDocumentAndSharedWith(document, user).filter(share -> share.getExpiresAt() == null || share.getExpiresAt().isAfter(Instant.now())).isPresent();
    }

    private DocumentShareDto mapToDto(DocumentShare share) {
        return DocumentShareDto.builder().id(share.getId()).documentId(share.getDocument().getId()).sharedWithId(share.getSharedWith().getId()).sharedWithName(share.getSharedWith().getFirstName() + " " + share.getSharedWith().getLastName()).permission(share.getPermission()).expiresAt(share.getExpiresAt()).createdAt(share.getCreatedAt()).build();
    }

    public DocumentShareService(final DocumentShareRepository documentShareRepository, final DocumentRepository documentRepository, final UserRepository userRepository, final ActivityLogService activityLogService) {
        this.documentShareRepository = documentShareRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }
}

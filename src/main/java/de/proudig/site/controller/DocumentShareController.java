package de.proudig.site.controller;

import de.proudig.site.domain.DocumentPermission;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.dto.DocumentShareDto;
import de.proudig.site.service.DocumentService;
import de.proudig.site.service.DocumentShareService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shares")
@PreAuthorize("isAuthenticated()")
public class DocumentShareController {
    private final DocumentShareService documentShareService;
    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<DocumentShareDto> shareDocument(@RequestBody Map<String, Object> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String documentId = (String) request.get("documentId");
        String sharedWithEmail = (String) request.get("sharedWithEmail");
        String permissionStr = (String) request.getOrDefault("permission", "VIEW");
        DocumentPermission permission = DocumentPermission.valueOf(permissionStr);
        Object expiresAtObj = request.get("expiresAt");
        Instant expiresAt = null;
        if (expiresAtObj instanceof String) {
            expiresAt = Instant.parse((String) expiresAtObj);
        }
        DocumentShareDto share = documentShareService.shareDocument(documentId, sharedWithEmail, permission, expiresAt, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(share);
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<List<DocumentShareDto>> getSharedWithMe() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<DocumentShareDto> shares = documentShareService.getSharedWithMe(user);
        return ResponseEntity.ok(shares);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<DocumentShareDto>> getDocumentShares(@PathVariable String documentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<DocumentShareDto> shares = documentShareService.getDocumentShares(documentId, user);
        return ResponseEntity.ok(shares);
    }

    @DeleteMapping("/{shareId}")
    public ResponseEntity<Void> removeShare(@PathVariable String shareId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        documentShareService.removeShare(shareId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shared-with-me/{documentId}")
    public ResponseEntity<DocumentDto> getSharedDocument(@PathVariable String documentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!documentShareService.canAccessDocument(documentId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // This returns basic document info without full access to upload user's account
        try {
            DocumentDto document = documentService.getDocument(documentId, user);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public DocumentShareController(final DocumentShareService documentShareService, final DocumentService documentService) {
        this.documentShareService = documentShareService;
        this.documentService = documentService;
    }
}

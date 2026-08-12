package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.service.DocumentService;
import de.proudig.site.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
public class DocumentController {
    private final DocumentService documentService;
    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<DocumentDto> uploadDocument(@RequestParam("file") MultipartFile file, @RequestParam(required = false) String folderId, @RequestParam(required = false) String description) throws IOException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        DocumentDto document = documentService.uploadDocument(file, folderId, description, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(document);
    }

    @GetMapping
    public ResponseEntity<List<DocumentDto>> getDocuments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<DocumentDto> documents = documentService.getDocumentsByUser(user);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<DocumentDto>> getDocumentsInFolder(@PathVariable String folderId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<DocumentDto> documents = documentService.getDocumentsInFolder(folderId, user);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentDto> getDocument(@PathVariable String documentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        DocumentDto document = documentService.getDocument(documentId, user);
        return ResponseEntity.ok(document);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<DocumentDto> updateDocument(@PathVariable String documentId, @RequestBody Map<String, String> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String description = request.get("description");
        DocumentDto document = documentService.updateDocument(documentId, description, user);
        return ResponseEntity.ok(document);
    }

    @PutMapping("/{documentId}/content")
    public ResponseEntity<DocumentDto> updateContent(@PathVariable String documentId, @RequestParam("file") MultipartFile file) throws IOException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        DocumentDto document = documentService.updateDocumentContent(documentId, file, user);
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String documentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        documentService.deleteDocument(documentId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String documentId, @RequestParam(defaultValue = "false") boolean inline) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            // Zugriffsprüfung erzwingen: Eigentümer, geteilt oder ADMIN.
            DocumentDto document = documentService.getDocumentForDownload(documentId, user);
            Resource resource = fileStorageService.load(document.getStoragePath(), "documents");
            String contentDisposition = inline ? "inline; filename=\"" + document.getFileName() + "\"" : "attachment; filename=\"" + document.getFileName() + "\"";
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(document.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);
        } catch (IllegalAccessError e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<List<DocumentDto>> getSharedWithMe() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(documentService.getSharedWithMe(user));
    }

    @GetMapping("/{documentId}/shares")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, String>>> getShares(@PathVariable String documentId) {
        return ResponseEntity.ok(documentService.getSharedUsers(documentId));
    }

    @PostMapping("/{documentId}/share")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DocumentDto> shareDocument(@PathVariable String documentId, @RequestBody Map<String, String> request) {
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        DocumentDto document = documentService.shareDocument(documentId, request.get("userId"), admin);
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("/{documentId}/share/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unshareDocument(@PathVariable String documentId, @PathVariable String userId) {
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        documentService.unshareDocument(documentId, userId, admin);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalAccessError.class)
    public ResponseEntity<String> handleForbidden(IllegalAccessError ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<String> handleNotFound(java.util.NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    public DocumentController(final DocumentService documentService, final FileStorageService fileStorageService) {
        this.documentService = documentService;
        this.fileStorageService = fileStorageService;
    }
}

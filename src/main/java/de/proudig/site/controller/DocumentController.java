package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.service.DocumentService;
import de.proudig.site.service.DocumentShareService;
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
@PreAuthorize("isAuthenticated()")
public class DocumentController {
    private final DocumentService documentService;
    private final DocumentShareService documentShareService;
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

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String documentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        documentService.deleteDocument(documentId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String documentId, @RequestParam(defaultValue = "false") boolean inline) {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!documentShareService.canAccessDocument(documentId, user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            DocumentDto document = documentService.getDocumentById(documentId);
            Resource resource = fileStorageService.load(document.getStoragePath(), "documents");
            String contentDisposition = inline ? "inline; filename=\"" + document.getFileName() + "\"" : "attachment; filename=\"" + document.getFileName() + "\"";
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(document.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    public DocumentController(final DocumentService documentService, final DocumentShareService documentShareService, final FileStorageService fileStorageService) {
        this.documentService = documentService;
        this.documentShareService = documentShareService;
        this.fileStorageService = fileStorageService;
    }
}

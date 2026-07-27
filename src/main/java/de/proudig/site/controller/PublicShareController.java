package de.proudig.site.controller;

import de.proudig.site.domain.Document;
import de.proudig.site.dto.PublicShareFileDto;
import de.proudig.site.dto.PublicShareMetaDto;
import de.proudig.site.service.ExternalShareLinkService;
import de.proudig.site.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/shares")
public class PublicShareController {
    private final ExternalShareLinkService shareService;
    private final FileStorageService fileStorageService;

    @GetMapping("/{token}")
    public ResponseEntity<PublicShareMetaDto> meta(@PathVariable String token) {
        return ResponseEntity.ok(shareService.meta(token));
    }

    @GetMapping("/{token}/files")
    public ResponseEntity<List<PublicShareFileDto>> files(@PathVariable String token,
                                                          @RequestParam(required = false) String password) {
        return ResponseEntity.ok(shareService.listFolderFiles(token, password));
    }

    @GetMapping("/{token}/download")
    public ResponseEntity<Resource> download(@PathVariable String token,
                                             @RequestParam(required = false) String documentId,
                                             @RequestParam(required = false) String password) {
        Document document = shareService.resolveDownload(token, documentId, password);
        Resource resource = fileStorageService.load(document.getStoragePath(), "documents");
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                .body(resource);
    }

    public PublicShareController(final ExternalShareLinkService shareService, final FileStorageService fileStorageService) {
        this.shareService = shareService;
        this.fileStorageService = fileStorageService;
    }
}

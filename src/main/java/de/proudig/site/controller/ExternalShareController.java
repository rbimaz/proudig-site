package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.ExternalShareLinkDto;
import de.proudig.site.service.ExternalShareLinkService;
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
@PreAuthorize("hasRole('ADMIN')")
public class ExternalShareController {
    private final ExternalShareLinkService shareService;

    @PostMapping
    public ResponseEntity<ExternalShareLinkDto> create(@RequestBody Map<String, String> request) {
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String expiresRaw = request.get("expiresAt");
        Instant expiresAt = (expiresRaw != null && !expiresRaw.isBlank()) ? Instant.parse(expiresRaw) : null;
        ExternalShareLinkDto dto = shareService.create(
                request.get("documentId"),
                request.get("folderId"),
                request.get("password"),
                expiresAt,
                request.get("recipientEmail"),
                admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping
    public ResponseEntity<List<ExternalShareLinkDto>> list(@RequestParam(required = false) String documentId,
                                                           @RequestParam(required = false) String folderId) {
        return ResponseEntity.ok(shareService.list(documentId, folderId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revoke(@PathVariable String id) {
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        shareService.revoke(id, admin);
        return ResponseEntity.noContent().build();
    }

    public ExternalShareController(final ExternalShareLinkService shareService) {
        this.shareService = shareService;
    }
}

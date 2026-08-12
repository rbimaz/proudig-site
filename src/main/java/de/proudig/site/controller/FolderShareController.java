package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.FolderShareDto;
import de.proudig.site.service.FolderShareService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders/{folderId}/shares")
@PreAuthorize("hasRole('ADMIN')")
public class FolderShareController {
    private final FolderShareService folderShareService;

    public FolderShareController(FolderShareService folderShareService) {
        this.folderShareService = folderShareService;
    }

    @GetMapping
    public ResponseEntity<List<FolderShareDto>> getShares(@PathVariable String folderId) {
        return ResponseEntity.ok(folderShareService.getShares(folderId));
    }

    @PostMapping
    public ResponseEntity<FolderShareDto> shareFolder(@PathVariable String folderId, @RequestBody Map<String, String> request) {
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        FolderShareDto dto = folderShareService.shareFolder(
                folderId, request.get("userId"), request.get("groupId"), request.get("permission"), admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{shareId}")
    public ResponseEntity<Void> revokeShare(@PathVariable String folderId, @PathVariable String shareId) {
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        folderShareService.revokeShare(folderId, shareId, admin);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}

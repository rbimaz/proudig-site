package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.FolderDto;
import de.proudig.site.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FolderController {
    private final FolderService folderService;

    @GetMapping
    public ResponseEntity<List<FolderDto>> getRootFolders() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<FolderDto> folders = folderService.getRootFolders(user);
        return ResponseEntity.ok(folders);
    }

    @GetMapping("/{folderId}/children")
    public ResponseEntity<List<FolderDto>> getSubFolders(@PathVariable String folderId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<FolderDto> folders = folderService.getSubFolders(folderId, user);
        return ResponseEntity.ok(folders);
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<FolderDto> getFolder(@PathVariable String folderId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        FolderDto folder = folderService.getFolderById(folderId, user);
        return ResponseEntity.ok(folder);
    }

    @PostMapping
    public ResponseEntity<FolderDto> createFolder(@RequestBody Map<String, String> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String name = request.get("name");
        String parentFolderId = request.get("parentFolderId");
        FolderDto folder = folderService.createFolder(name, parentFolderId, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(folder);
    }

    @PutMapping("/{folderId}")
    public ResponseEntity<FolderDto> updateFolder(
            @PathVariable String folderId,
            @RequestBody Map<String, String> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String name = request.get("name");
        FolderDto folder = folderService.updateFolder(folderId, name, user);
        return ResponseEntity.ok(folder);
    }

    @PutMapping("/{folderId}/move")
    public ResponseEntity<FolderDto> moveFolder(
            @PathVariable String folderId,
            @RequestBody Map<String, String> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String parentFolderId = request.get("parentFolderId");
        FolderDto folder = folderService.moveFolder(folderId, parentFolderId, user);
        return ResponseEntity.ok(folder);
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<Void> deleteFolder(@PathVariable String folderId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        folderService.deleteFolder(folderId, user);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}

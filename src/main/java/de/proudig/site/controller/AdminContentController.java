package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.ContentBlockDto;
import de.proudig.site.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
public class AdminContentController {
    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<List<ContentBlockDto>> getAllContent() {
        List<ContentBlockDto> content = contentService.getAllForAdmin();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/{key}")
    public ResponseEntity<ContentBlockDto> getContent(@PathVariable String key) {
        ContentBlockDto content = contentService.getDraft(key);
        return ResponseEntity.ok(content);
    }

    @PutMapping("/{key}")
    public ResponseEntity<ContentBlockDto> saveDraft(
            @PathVariable String key,
            @RequestBody String contentJson) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ContentBlockDto content = contentService.saveDraft(key, contentJson, user);
        return ResponseEntity.ok(content);
    }

    @PostMapping("/{key}/publish")
    public ResponseEntity<ContentBlockDto> publishContent(@PathVariable String key) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ContentBlockDto content = contentService.publish(key, user);
        return ResponseEntity.ok(content);
    }
}

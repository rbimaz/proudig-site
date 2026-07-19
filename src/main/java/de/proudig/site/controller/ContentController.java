package de.proudig.site.controller;

import de.proudig.site.dto.ContentBlockDto;
import de.proudig.site.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {
    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<List<ContentBlockDto>> getAllPublished() {
        List<ContentBlockDto> content = contentService.getAllPublished();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/{sectionKey}")
    public ResponseEntity<ContentBlockDto> getContent(@PathVariable String sectionKey) {
        ContentBlockDto content = contentService.getPublishedContent(sectionKey);
        return ResponseEntity.ok(content);
    }
}

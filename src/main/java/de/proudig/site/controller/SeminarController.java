package de.proudig.site.controller;

import de.proudig.site.domain.PageCategory;
import de.proudig.site.dto.PageDto;
import de.proudig.site.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seminare")
@RequiredArgsConstructor
public class SeminarController {
    private final PageService pageService;

    @GetMapping
    public ResponseEntity<Page<PageDto>> getUpcomingSeminars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "publishedAt"));
        Page<PageDto> seminars = pageService.getPublishedSeminars(pageable);
        return ResponseEntity.ok(seminars);
    }

    @GetMapping("/archiv")
    public ResponseEntity<Page<PageDto>> getArchivedSeminars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<PageDto> archivedSeminars = pageService.getArchivedSeminars(pageable);
        return ResponseEntity.ok(archivedSeminars);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PageDto> getSeminar(@PathVariable String slug) {
        PageDto seminar = pageService.getBySlug(slug);
        return ResponseEntity.ok(seminar);
    }
}

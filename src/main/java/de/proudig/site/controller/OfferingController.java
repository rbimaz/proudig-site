package de.proudig.site.controller;

import de.proudig.site.dto.PageDto;
import de.proudig.site.service.PageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offerings")
public class OfferingController {
    private final PageService pageService;

    @GetMapping
    public ResponseEntity<Page<PageDto>> getOfferings(@RequestParam(required = false) String tag, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "publishedAt") String sortBy, @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PageDto> offerings = (tag != null && !tag.isBlank())
            ? pageService.getPublishedOfferingsByTag(tag, pageable)
            : pageService.getPublishedOfferings(pageable);
        return ResponseEntity.ok(offerings);
    }

    @GetMapping("/tags")
    public ResponseEntity<List<String>> getOfferingTags() {
        List<String> tags = pageService.getAllTags(de.proudig.site.domain.PageCategory.OFFERING);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PageDto> getOffering(@PathVariable String slug) {
        PageDto offering = pageService.getBySlug(slug);
        return ResponseEntity.ok(offering);
    }

    public OfferingController(final PageService pageService) {
        this.pageService = pageService;
    }
}

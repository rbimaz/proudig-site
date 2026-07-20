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
@RequestMapping("/api/news")
public class NewsController {
    private final PageService pageService;

    @GetMapping
    public ResponseEntity<Page<PageDto>> getNews(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "publishedAt") String sortBy, @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PageDto> posts = pageService.getPublishedNews(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/tags")
    public ResponseEntity<List<String>> getNewsTags() {
        List<String> tags = pageService.getAllTags(de.proudig.site.domain.PageCategory.NEWS);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PageDto> getNewsPost(@PathVariable String slug) {
        PageDto post = pageService.getBySlug(slug);
        return ResponseEntity.ok(post);
    }

    public NewsController(final PageService pageService) {
        this.pageService = pageService;
    }
}

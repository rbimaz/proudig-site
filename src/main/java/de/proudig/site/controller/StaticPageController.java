package de.proudig.site.controller;

import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.dto.PageDto;
import de.proudig.site.repository.PageRepository;
import de.proudig.site.service.PageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pages")
public class StaticPageController {
    private final PageService pageService;

    @GetMapping("/{slug}")
    public ResponseEntity<PageDto> getStaticPage(@PathVariable String slug) {
        PageDto page = pageService.getBySlug(slug);
        return ResponseEntity.ok(page);
    }

    public StaticPageController(final PageService pageService) {
        this.pageService = pageService;
    }
}

package de.proudig.site.controller;

import de.proudig.site.domain.Page;
import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.dto.SeoMetaDto;
import de.proudig.site.repository.PageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/seo")
public class SeoController {
    private final PageRepository pageRepository;

    @GetMapping("/blog/{slug}")
    public ResponseEntity<SeoMetaDto> getBlogSeoMeta(@PathVariable String slug) {
        try {
            Page page = pageRepository.findBySlug(slug).orElseThrow(() -> new NoSuchElementException("Page not found: " + slug));
            if (page.getCategory() != PageCategory.BLOG || page.getStatus() != PageStatus.PUBLISHED) {
                return ResponseEntity.notFound().build();
            }
            SeoMetaDto seoMeta = buildSeoMeta(page, "https://proudig.de/blog/" + slug);
            return ResponseEntity.ok(seoMeta);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/seminare/{slug}")
    public ResponseEntity<SeoMetaDto> getSeminarSeoMeta(@PathVariable String slug) {
        try {
            Page page = pageRepository.findBySlug(slug).orElseThrow(() -> new NoSuchElementException("Page not found: " + slug));
            if (page.getCategory() != PageCategory.SEMINAR || page.getStatus() != PageStatus.PUBLISHED) {
                return ResponseEntity.notFound().build();
            }
            SeoMetaDto seoMeta = buildSeoMeta(page, "https://proudig.de/seminare/" + slug);
            return ResponseEntity.ok(seoMeta);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private SeoMetaDto buildSeoMeta(Page page, String canonicalUrl) {
        String coverImageUrl = null;
        if (page.getCoverImage() != null) {
            coverImageUrl = "https://proudig.de/api/media/" + page.getCoverImage().getId();
        }
        String tagsKeywords = String.join(", ", page.getTagsList());
        return SeoMetaDto.builder().title(page.getTitle()).description(page.getExcerpt() != null ? page.getExcerpt() : page.getTitle()).ogTitle(page.getTitle()).ogDescription(page.getExcerpt() != null ? page.getExcerpt() : page.getTitle()).ogImage(coverImageUrl).ogType(page.getCategory() == PageCategory.BLOG ? "article" : "website").canonicalUrl(canonicalUrl).keywords(tagsKeywords).build();
    }

    public SeoController(final PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }
}

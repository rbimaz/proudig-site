package de.proudig.site.controller;

import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.User;
import de.proudig.site.dto.PageCreateRequest;
import de.proudig.site.dto.PageDto;
import de.proudig.site.dto.PageUpdateRequest;
import de.proudig.site.repository.PageRepository;
import de.proudig.site.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/pages")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
public class AdminPageController {
    private final PageService pageService;
    private final PageRepository pageRepository;

    @GetMapping
    public ResponseEntity<List<PageDto>> getPages(
            @RequestParam(required = false) PageCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<de.proudig.site.domain.Page> result;

        if (category != null) {
            result = pageRepository.findByCategory(category, pageable);
        } else {
            result = pageRepository.findAll(pageable);
        }

        List<PageDto> dtos = result.getContent().stream()
                .map(p -> PageDto.builder()
                        .id(p.getId())
                        .slug(p.getSlug())
                        .title(p.getTitle())
                        .category(p.getCategory())
                        .content(p.getContent())
                        .excerpt(p.getExcerpt())
                        .coverImageId(p.getCoverImage() != null ? p.getCoverImage().getId() : null)
                        .tags(p.getTagsList())
                        .metaData(p.getMetaData())
                        .status(p.getStatus())
                        .authorId(p.getAuthor().getId())
                        .authorName(p.getAuthor().getFirstName() + " " + p.getAuthor().getLastName())
                        .publishedAt(p.getPublishedAt())
                        .createdAt(p.getCreatedAt())
                        .updatedAt(p.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PageDto> getPage(@PathVariable String id) {
        de.proudig.site.domain.Page page = pageRepository.findById(id).orElse(null);
        if (page == null) {
            return ResponseEntity.notFound().build();
        }
        PageDto dto = PageDto.builder()
                .id(page.getId())
                .slug(page.getSlug())
                .title(page.getTitle())
                .category(page.getCategory())
                .content(page.getContent())
                .excerpt(page.getExcerpt())
                .coverImageId(page.getCoverImage() != null ? page.getCoverImage().getId() : null)
                .tags(page.getTagsList())
                .metaData(page.getMetaData())
                .status(page.getStatus())
                .authorId(page.getAuthor().getId())
                .authorName(page.getAuthor().getFirstName() + " " + page.getAuthor().getLastName())
                .publishedAt(page.getPublishedAt())
                .createdAt(page.getCreatedAt())
                .updatedAt(page.getUpdatedAt())
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<PageDto> createPage(@RequestBody PageCreateRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        PageDto page = pageService.createPage(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(page);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PageDto> updatePage(
            @PathVariable String id,
            @RequestBody PageUpdateRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        PageDto page = pageService.updatePage(id, request, user);
        return ResponseEntity.ok(page);
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<PageDto> publishPage(@PathVariable String id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        PageDto page = pageService.publishPage(id, user);
        return ResponseEntity.ok(page);
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<PageDto> archivePage(@PathVariable String id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        PageDto page = pageService.archivePage(id, user);
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable String id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        pageService.deletePage(id, user);
        return ResponseEntity.noContent().build();
    }
}

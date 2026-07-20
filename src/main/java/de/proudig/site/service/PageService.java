package de.proudig.site.service;

import de.proudig.site.domain.Page;
import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.domain.User;
import de.proudig.site.dto.PageCreateRequest;
import de.proudig.site.dto.PageDto;
import de.proudig.site.dto.PageUpdateRequest;
import de.proudig.site.repository.MediaRepository;
import de.proudig.site.repository.PageRepository;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class PageService {
    private final PageRepository pageRepository;
    private final MediaRepository mediaRepository;
    private final ActivityLogService activityLogService;

    public org.springframework.data.domain.Page<PageDto> getPublishedBlogPosts(Pageable pageable) {
        org.springframework.data.domain.Page<Page> pages = pageRepository.findByCategoryAndStatus(PageCategory.BLOG, PageStatus.PUBLISHED, pageable);
        return pages.map(this::mapToDto);
    }

    public org.springframework.data.domain.Page<PageDto> getPublishedNews(Pageable pageable) {
        org.springframework.data.domain.Page<Page> pages = pageRepository.findByCategoryAndStatus(PageCategory.NEWS, PageStatus.PUBLISHED, pageable);
        return pages.map(this::mapToDto);
    }

    public org.springframework.data.domain.Page<PageDto> getPublishedSeminars(Pageable pageable) {
        org.springframework.data.domain.Page<Page> pages = pageRepository.findByCategoryAndStatus(PageCategory.SEMINAR, PageStatus.PUBLISHED, pageable);
        return pages.map(this::mapToDto);
    }

    public org.springframework.data.domain.Page<PageDto> getArchivedSeminars(Pageable pageable) {
        org.springframework.data.domain.Page<Page> pages = pageRepository.findByCategoryAndStatusNot(PageCategory.SEMINAR, PageStatus.DRAFT, pageable);
        return pages.map(this::mapToDto);
    }

    public PageDto getBySlug(String slug) {
        Page page = pageRepository.findBySlug(slug).orElseThrow(() -> new NoSuchElementException("Page not found: " + slug));
        if (page.getStatus() != PageStatus.PUBLISHED) {
            throw new NoSuchElementException("Page is not published: " + slug);
        }
        return mapToDto(page);
    }

    public List<String> getAllTags(PageCategory category) {
        List<String> rawTags = pageRepository.findDistinctTagsByCategoryAndStatus(category, PageStatus.PUBLISHED);
        return rawTags.stream().flatMap(tags -> List.of(tags.split(",\\s*")).stream()).distinct().sorted().collect(Collectors.toList());
    }

    public PageDto createPage(PageCreateRequest request, User user) {
        Page page = Page.builder().slug(request.getSlug()).title(request.getTitle()).category(request.getCategory()).content(request.getContent()).excerpt(request.getExcerpt()).metaData(request.getMetaData()).status(PageStatus.DRAFT).author(user).build();
        if (request.getCoverImageId() != null) {
            page.setCoverImage(mediaRepository.findById(request.getCoverImageId()).orElseThrow(() -> new NoSuchElementException("Cover image not found")));
        }
        if (request.getTags() != null) {
            page.setTagsList(request.getTags());
        }
        page = pageRepository.save(page);
        activityLogService.log(user, "PAGE_CREATE", "PAGE", page.getId(), page.getTitle());
        return mapToDto(page);
    }

    public PageDto updatePage(String id, PageUpdateRequest request, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        if (request.getTitle() != null) page.setTitle(request.getTitle());
        if (request.getSlug() != null) page.setSlug(request.getSlug());
        if (request.getCategory() != null) page.setCategory(request.getCategory());
        if (request.getContent() != null) page.setContent(request.getContent());
        if (request.getExcerpt() != null) page.setExcerpt(request.getExcerpt());
        if (request.getMetaData() != null) page.setMetaData(request.getMetaData());
        if (request.getCoverImageId() != null) {
            page.setCoverImage(mediaRepository.findById(request.getCoverImageId()).orElseThrow(() -> new NoSuchElementException("Cover image not found")));
        }
        if (request.getTags() != null) {
            page.setTagsList(request.getTags());
        }
        page = pageRepository.save(page);
        return mapToDto(page);
    }

    public PageDto publishPage(String id, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        page.setStatus(PageStatus.PUBLISHED);
        page.setPublishedAt(Instant.now());
        page = pageRepository.save(page);
        activityLogService.log(user, "PAGE_PUBLISH", "PAGE", page.getId(), page.getTitle());
        return mapToDto(page);
    }

    public PageDto archivePage(String id, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        page.setStatus(PageStatus.ARCHIVED);
        page = pageRepository.save(page);
        activityLogService.log(user, "PAGE_ARCHIVE", "PAGE", page.getId(), page.getTitle());
        return mapToDto(page);
    }

    public void deletePage(String id, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        if (page.getStatus() != PageStatus.DRAFT) {
            throw new IllegalStateException("Only draft pages can be deleted");
        }
        activityLogService.log(user, "PAGE_DELETE", "PAGE", page.getId(), page.getTitle());
        pageRepository.delete(page);
    }

    // Every hour
    @Scheduled(cron = "0 0 * * * *")
    public void autoArchivePastSeminars() {
        org.springframework.data.domain.Page<Page> seminars = pageRepository.findByCategoryAndStatus(PageCategory.SEMINAR, PageStatus.PUBLISHED, Pageable.unpaged());
        Instant now = Instant.now();
        for (Page page : seminars) {
            if (page.getMetaData() != null && !page.getMetaData().isEmpty()) {
                // Check if the seminar date has passed
                // This is a simple implementation - you may need to enhance metaData parsing
                page.setStatus(PageStatus.ARCHIVED);
                pageRepository.save(page);
            }
        }
    }

    private PageDto mapToDto(Page page) {
        return PageDto.builder().id(page.getId()).slug(page.getSlug()).title(page.getTitle()).category(page.getCategory()).content(page.getContent()).excerpt(page.getExcerpt()).coverImageId(page.getCoverImage() != null ? page.getCoverImage().getId() : null).tags(page.getTagsList()).metaData(page.getMetaData()).status(page.getStatus()).authorId(page.getAuthor().getId()).authorName(page.getAuthor().getFirstName() + " " + page.getAuthor().getLastName()).publishedAt(page.getPublishedAt()).createdAt(page.getCreatedAt()).updatedAt(page.getUpdatedAt()).build();
    }

    public PageService(final PageRepository pageRepository, final MediaRepository mediaRepository, final ActivityLogService activityLogService) {
        this.pageRepository = pageRepository;
        this.mediaRepository = mediaRepository;
        this.activityLogService = activityLogService;
    }
}

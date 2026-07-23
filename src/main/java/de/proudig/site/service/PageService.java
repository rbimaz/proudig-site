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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.boot.convert.DurationStyle;
import org.springframework.stereotype.Service;
import java.time.Clock;
import java.time.Duration;
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
    private final SettingService settingService;
    private final Clock clock;

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

    /**
     * Öffentlicher Einzelabruf einer News per Slug. Anders als {@link #getBySlug(String)}
     * bleiben archivierte News (Status ARCHIVED) per Direktlink erreichbar; erst HIDDEN
     * (bzw. DRAFT) führt zu "nicht gefunden". Nur für News-Direktlinks verwenden.
     */
    public PageDto getNewsBySlug(String slug) {
        Page page = pageRepository.findBySlug(slug).orElseThrow(() -> new NoSuchElementException("Page not found: " + slug));
        if (page.getStatus() != PageStatus.PUBLISHED && page.getStatus() != PageStatus.ARCHIVED) {
            throw new NoSuchElementException("News is not available: " + slug);
        }
        return mapToDto(page);
    }

    public List<String> getAllTags(PageCategory category) {
        List<String> rawTags = pageRepository.findDistinctTagsByCategoryAndStatus(category, PageStatus.PUBLISHED);
        return rawTags.stream().flatMap(tags -> List.of(tags.split(",\\s*")).stream()).distinct().sorted().collect(Collectors.toList());
    }

    public PageDto createPage(PageCreateRequest request, User user) {
        Page page = Page.builder().slug(request.getSlug()).title(request.getTitle()).category(request.getCategory()).content(request.getContent()).excerpt(request.getExcerpt()).metaData(request.getMetaData()).status(PageStatus.DRAFT).author(user).build();
        if (request.getCoverImageId() != null && !request.getCoverImageId().isBlank()) {
            page.setCoverImage(mediaRepository.findById(request.getCoverImageId()).orElseThrow(() -> new NoSuchElementException("Cover image not found")));
        }
        if (request.getTags() != null) {
            page.setTagsList(request.getTags());
        }
        page.setShowInHero(request.getShowInHero());
        page.setAutoArchiveAfter(normalizeAutoArchiveAfter(request.getAutoArchiveAfter()));
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
        if (request.getCoverImageId() != null && !request.getCoverImageId().isBlank()) {
            page.setCoverImage(mediaRepository.findById(request.getCoverImageId()).orElseThrow(() -> new NoSuchElementException("Cover image not found")));
        }
        if (request.getTags() != null) {
            page.setTagsList(request.getTags());
        }
        page.setShowInHero(request.getShowInHero());
        page.setAutoArchiveAfter(normalizeAutoArchiveAfter(request.getAutoArchiveAfter()));
        page = pageRepository.save(page);
        return mapToDto(page);
    }

    /** Prüft/normalisiert die Frist-A-Angabe; leer → null, sonst muss es ein gültiges Duration-Format sein. */
    private String normalizeAutoArchiveAfter(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        DurationStyle.detectAndParse(value); // wirft IllegalArgumentException bei ungültigem Format
        return value.trim();
    }

    public List<PageDto> getHeroNews() {
        org.springframework.data.domain.Page<Page> pages = pageRepository.findByCategoryAndStatusAndShowInHero(
                PageCategory.NEWS, PageStatus.PUBLISHED, true,
                PageRequest.of(0, 4, Sort.by(Sort.Direction.DESC, "publishedAt")));
        return pages.map(this::mapToDto).getContent();
    }

    public PageDto publishPage(String id, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        page.setStatus(PageStatus.PUBLISHED);
        page.setPublishedAt(Instant.now(clock));
        page = pageRepository.save(page);
        activityLogService.log(user, "PAGE_PUBLISH", "PAGE", page.getId(), page.getTitle());
        return mapToDto(page);
    }

    public PageDto archivePage(String id, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        page.setStatus(PageStatus.ARCHIVED);
        page.setArchivedAt(Instant.now(clock));
        page = pageRepository.save(page);
        activityLogService.log(user, "PAGE_ARCHIVE", "PAGE", page.getId(), page.getTitle());
        return mapToDto(page);
    }

    public void deletePage(String id, User user) {
        Page page = pageRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Page not found: " + id));
        // Löschen unabhängig vom Status erlaubt; die Bestätigung erfolgt im UI-Dialog.
        activityLogService.log(user, "PAGE_DELETE", "PAGE", page.getId(), page.getTitle());
        pageRepository.delete(page);
    }

    // Hinweis: NICHT mehr @Scheduled. Diese rudimentäre Seminar-Archivierung würde jedes
    // Seminar mit nicht-leerem metaData archivieren (ohne echte Datumsprüfung). Da Scheduling
    // nun global aktiviert ist (für den News-Lebenszyklus), ist der automatische Trigger hier
    // bewusst entfernt, um eine fehlerhafte Massen-Archivierung von Seminaren zu verhindern.
    public void autoArchivePastSeminars() {
        org.springframework.data.domain.Page<Page> seminars = pageRepository.findByCategoryAndStatus(PageCategory.SEMINAR, PageStatus.PUBLISHED, Pageable.unpaged());
        Instant now = Instant.now(clock);
        for (Page page : seminars) {
            if (page.getMetaData() != null && !page.getMetaData().isEmpty()) {
                // Check if the seminar date has passed
                // This is a simple implementation - you may need to enhance metaData parsing
                page.setStatus(PageStatus.ARCHIVED);
                pageRepository.save(page);
            }
        }
    }

    /**
     * Führt beide News-Lebenszyklus-Übergänge aus und liefert die Anzahl der Übergänge.
     * (1) PUBLISHED → ARCHIVED, wenn publishedAt + autoArchiveAfter (Frist A) abgelaufen ist.
     * (2) ARCHIVED  → HIDDEN,   wenn archivedAt + globale Aufbewahrungsdauer (Frist B) abgelaufen ist.
     * Wird sowohl vom Scheduler als auch vom manuellen Trigger-Endpoint aufgerufen.
     */
    public int runNewsLifecycle() {
        Instant now = Instant.now(clock);
        int transitions = 0;

        // (1) Frist A: veröffentlichte News automatisch archivieren
        org.springframework.data.domain.Page<Page> published = pageRepository.findByCategoryAndStatus(PageCategory.NEWS, PageStatus.PUBLISHED, Pageable.unpaged());
        for (Page page : published) {
            String after = page.getAutoArchiveAfter();
            if (after == null || after.isBlank() || page.getPublishedAt() == null) {
                continue;
            }
            Duration duration;
            try {
                duration = DurationStyle.detectAndParse(after);
            } catch (IllegalArgumentException ex) {
                // Ungültiges Format defensiv überspringen (sollte durch Validierung verhindert sein)
                continue;
            }
            if (!page.getPublishedAt().plus(duration).isAfter(now)) {
                page.setStatus(PageStatus.ARCHIVED);
                page.setArchivedAt(now);
                pageRepository.save(page);
                activityLogService.log(null, "PAGE_AUTO_ARCHIVE", "PAGE", page.getId(), page.getTitle());
                transitions++;
            }
        }

        // (2) Frist B: archivierte News nach Aufbewahrungsdauer endgültig ausblenden
        Duration retention = settingService.getNewsArchiveRetention();
        org.springframework.data.domain.Page<Page> archived = pageRepository.findByCategoryAndStatus(PageCategory.NEWS, PageStatus.ARCHIVED, Pageable.unpaged());
        for (Page page : archived) {
            if (page.getArchivedAt() == null) {
                continue;
            }
            if (!page.getArchivedAt().plus(retention).isAfter(now)) {
                page.setStatus(PageStatus.HIDDEN);
                pageRepository.save(page);
                activityLogService.log(null, "PAGE_AUTO_HIDE", "PAGE", page.getId(), page.getTitle());
                transitions++;
            }
        }

        return transitions;
    }

    private PageDto mapToDto(Page page) {
        PageDto dto = PageDto.builder().id(page.getId()).slug(page.getSlug()).title(page.getTitle()).category(page.getCategory()).content(page.getContent()).excerpt(page.getExcerpt()).coverImageId(page.getCoverImage() != null ? page.getCoverImage().getId() : null).tags(page.getTagsList()).metaData(page.getMetaData()).status(page.getStatus()).authorId(page.getAuthor().getId()).authorName(page.getAuthor().getFirstName() + " " + page.getAuthor().getLastName()).publishedAt(page.getPublishedAt()).createdAt(page.getCreatedAt()).updatedAt(page.getUpdatedAt()).build();
        dto.setShowInHero(page.isShowInHero());
        dto.setAutoArchiveAfter(page.getAutoArchiveAfter());
        return dto;
    }

    public PageService(final PageRepository pageRepository, final MediaRepository mediaRepository, final ActivityLogService activityLogService, final SettingService settingService, final Clock clock) {
        this.pageRepository = pageRepository;
        this.mediaRepository = mediaRepository;
        this.activityLogService = activityLogService;
        this.settingService = settingService;
        this.clock = clock;
    }
}

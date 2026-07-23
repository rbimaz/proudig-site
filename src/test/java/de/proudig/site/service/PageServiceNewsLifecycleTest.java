package de.proudig.site.service;

import de.proudig.site.domain.Page;
import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.domain.User;
import de.proudig.site.repository.MediaRepository;
import de.proudig.site.repository.PageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PageServiceNewsLifecycleTest {

    private static final Instant NOW = Instant.parse("2026-06-01T00:00:00Z");

    @Mock private PageRepository pageRepository;
    @Mock private MediaRepository mediaRepository;
    @Mock private ActivityLogService activityLogService;
    @Mock private SettingService settingService;

    private PageService pageService;

    @BeforeEach
    void setUp() {
        Clock fixed = Clock.fixed(NOW, ZoneOffset.UTC);
        pageService = new PageService(pageRepository, mediaRepository, activityLogService, settingService, fixed);
    }

    private User author() {
        User u = new User();
        u.setId("a1");
        u.setFirstName("Anna");
        u.setLastName("Autor");
        return u;
    }

    private Page news(String id, PageStatus status) {
        return Page.builder().id(id).slug(id).title(id)
                .category(PageCategory.NEWS).status(status).author(author()).build();
    }

    @Test
    @DisplayName("Frist A abgelaufen: veröffentlichte News wird archiviert + archivedAt gesetzt")
    void archivesExpiredPublishedNews() {
        Page n = news("n1", PageStatus.PUBLISHED);
        n.setPublishedAt(NOW.minus(Duration.ofDays(31)));
        n.setAutoArchiveAfter("30d");

        when(pageRepository.findByCategoryAndStatus(eq(PageCategory.NEWS), eq(PageStatus.PUBLISHED), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(n)));
        when(pageRepository.findByCategoryAndStatus(eq(PageCategory.NEWS), eq(PageStatus.ARCHIVED), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        lenient().when(settingService.getNewsArchiveRetention()).thenReturn(Duration.ofDays(90));

        int transitions = pageService.runNewsLifecycle();

        assertThat(n.getStatus()).isEqualTo(PageStatus.ARCHIVED);
        assertThat(n.getArchivedAt()).isEqualTo(NOW);
        assertThat(transitions).isEqualTo(1);
    }

    @Test
    @DisplayName("Frist A nicht abgelaufen: News bleibt veröffentlicht")
    void keepsNotYetExpiredNews() {
        Page n = news("n1", PageStatus.PUBLISHED);
        n.setPublishedAt(NOW.minus(Duration.ofDays(5)));
        n.setAutoArchiveAfter("30d");

        when(pageRepository.findByCategoryAndStatus(eq(PageCategory.NEWS), eq(PageStatus.PUBLISHED), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(n)));
        when(pageRepository.findByCategoryAndStatus(eq(PageCategory.NEWS), eq(PageStatus.ARCHIVED), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        lenient().when(settingService.getNewsArchiveRetention()).thenReturn(Duration.ofDays(90));

        int transitions = pageService.runNewsLifecycle();

        assertThat(n.getStatus()).isEqualTo(PageStatus.PUBLISHED);
        assertThat(transitions).isZero();
    }

    @Test
    @DisplayName("Frist B abgelaufen: archivierte News wird ausgeblendet (HIDDEN)")
    void hidesExpiredArchivedNews() {
        Page n = news("n1", PageStatus.ARCHIVED);
        n.setArchivedAt(NOW.minus(Duration.ofSeconds(60)));

        when(pageRepository.findByCategoryAndStatus(eq(PageCategory.NEWS), eq(PageStatus.PUBLISHED), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        when(pageRepository.findByCategoryAndStatus(eq(PageCategory.NEWS), eq(PageStatus.ARCHIVED), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(n)));
        when(settingService.getNewsArchiveRetention()).thenReturn(Duration.ofSeconds(30));

        int transitions = pageService.runNewsLifecycle();

        assertThat(n.getStatus()).isEqualTo(PageStatus.HIDDEN);
        assertThat(transitions).isEqualTo(1);
    }

    @Test
    @DisplayName("getNewsBySlug: PUBLISHED und ARCHIVED erreichbar, HIDDEN/DRAFT nicht")
    void newsBySlugVisibility() {
        Page published = news("p", PageStatus.PUBLISHED);
        Page archived = news("a", PageStatus.ARCHIVED);
        Page hidden = news("h", PageStatus.HIDDEN);
        Page draft = news("d", PageStatus.DRAFT);
        when(pageRepository.findBySlug("p")).thenReturn(java.util.Optional.of(published));
        when(pageRepository.findBySlug("a")).thenReturn(java.util.Optional.of(archived));
        when(pageRepository.findBySlug("h")).thenReturn(java.util.Optional.of(hidden));
        when(pageRepository.findBySlug("d")).thenReturn(java.util.Optional.of(draft));

        assertThat(pageService.getNewsBySlug("p").getSlug()).isEqualTo("p");
        assertThat(pageService.getNewsBySlug("a").getSlug()).isEqualTo("a");
        assertThatThrownBy(() -> pageService.getNewsBySlug("h")).isInstanceOf(NoSuchElementException.class);
        assertThatThrownBy(() -> pageService.getNewsBySlug("d")).isInstanceOf(NoSuchElementException.class);
    }
}

package de.proudig.site.service;

import de.proudig.site.domain.Page;
import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.domain.User;
import de.proudig.site.dto.PageDto;
import de.proudig.site.repository.MediaRepository;
import de.proudig.site.repository.PageRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PageServiceTest {

    @Mock
    private PageRepository pageRepository;
    @Mock
    private MediaRepository mediaRepository;
    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private PageService pageService;

    @Test
    @DisplayName("getPublishedNews liefert nur veröffentlichte News der Kategorie NEWS")
    void getPublishedNewsReturnsMappedNews() {
        User author = new User();
        author.setId("a1");
        author.setFirstName("Anna");
        author.setLastName("Autor");
        Page news = Page.builder()
                .id("n1").slug("news-1").title("News 1")
                .category(PageCategory.NEWS).status(PageStatus.PUBLISHED)
                .author(author).build();

        Pageable pageable = PageRequest.of(0, 10);
        when(pageRepository.findByCategoryAndStatus(PageCategory.NEWS, PageStatus.PUBLISHED, pageable))
                .thenReturn(new PageImpl<>(List.of(news)));

        org.springframework.data.domain.Page<PageDto> result = pageService.getPublishedNews(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSlug()).isEqualTo("news-1");
        assertThat(result.getContent().get(0).getCategory()).isEqualTo(PageCategory.NEWS);
    }
}

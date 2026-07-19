package de.proudig.site.dto;

import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageDto {
    private String id;
    private String slug;
    private String title;
    private PageCategory category;
    private String content;
    private String excerpt;
    private String coverImageId;
    private List<String> tags;
    private String metaData;
    private PageStatus status;
    private String authorId;
    private String authorName;
    private Instant publishedAt;
    private Instant createdAt;
    private Instant updatedAt;
}

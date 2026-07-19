package de.proudig.site.dto;

import de.proudig.site.domain.PageCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageUpdateRequest {
    private String title;
    private String slug;
    private PageCategory category;
    private String content;
    private String excerpt;
    private String coverImageId;
    private List<String> tags;
    private String metaData;
}

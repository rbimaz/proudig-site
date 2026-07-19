package de.proudig.site.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeoMetaDto {
    private String title;
    private String description;
    private String ogTitle;
    private String ogDescription;
    private String ogImage;
    private String ogType;
    private String canonicalUrl;
    private String keywords;
}

package de.proudig.site.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentBlockDto {
    private String id;
    private String sectionKey;
    private String content;
    private String draftContent;
    private Instant updatedAt;
    private Instant publishedAt;
}

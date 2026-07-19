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
public class MediaDto {
    private String id;
    private String name;
    private String title;
    private String contentType;
    private Long fileSize;
    private Instant createdAt;
}

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
public class ActivityLogDto {
    private String id;
    private String userId;
    private String userEmail;
    private String userName;
    private String action;
    private String entityType;
    private String entityId;
    private String details;
    private Instant createdAt;
}

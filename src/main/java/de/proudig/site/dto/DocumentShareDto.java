package de.proudig.site.dto;

import de.proudig.site.domain.DocumentPermission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentShareDto {
    private String id;
    private String documentId;
    private String sharedWithId;
    private String sharedWithName;
    private DocumentPermission permission;
    private Instant expiresAt;
    private Instant createdAt;
}

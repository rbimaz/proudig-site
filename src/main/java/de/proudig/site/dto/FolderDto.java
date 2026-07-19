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
public class FolderDto {
    private String id;
    private String name;
    private String parentFolderId;
    private String ownerId;
    private Instant createdAt;
    private Instant updatedAt;
    private long documentCount;
    private long childFolderCount;
    private boolean hasChildren;
}

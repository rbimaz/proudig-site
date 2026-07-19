package de.proudig.site.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private String id;
    private String fileName;
    @JsonIgnore
    private String storagePath;
    private String contentType;
    private Long fileSize;
    private String folderId;
    private String uploadedById;
    private String uploadedByName;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}

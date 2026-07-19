package de.proudig.site.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "content_blocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentBlock {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "section_key", unique = true, nullable = false, length = 100)
    private String sectionKey;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "draft_content", columnDefinition = "TEXT")
    private String draftContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

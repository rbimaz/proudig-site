package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Interne, lesende Freigabe eines Dokuments an einen Benutzer (Admin teilt mit
 * z. B. einem Consultant). Getrennt von den externen {@link ExternalShareLink}.
 * v1: nur lesend, kein Ablauf.
 */
@Entity
@Table(name = "document_shares")
public class DocumentShare {
    @Id
    @Column(length = 36)
    private String id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with", nullable = false)
    private User sharedWith;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_by", nullable = false)
    private User sharedBy;
    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public static class DocumentShareBuilder {
        private String id;
        private Document document;
        private User sharedWith;
        private User sharedBy;
        private Instant createdAt;

        DocumentShareBuilder() {
        }

        public DocumentShare.DocumentShareBuilder id(final String id) {
            this.id = id;
            return this;
        }

        public DocumentShare.DocumentShareBuilder document(final Document document) {
            this.document = document;
            return this;
        }

        public DocumentShare.DocumentShareBuilder sharedWith(final User sharedWith) {
            this.sharedWith = sharedWith;
            return this;
        }

        public DocumentShare.DocumentShareBuilder sharedBy(final User sharedBy) {
            this.sharedBy = sharedBy;
            return this;
        }

        public DocumentShare.DocumentShareBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DocumentShare build() {
            return new DocumentShare(this.id, this.document, this.sharedWith, this.sharedBy, this.createdAt);
        }
    }

    public static DocumentShare.DocumentShareBuilder builder() {
        return new DocumentShare.DocumentShareBuilder();
    }

    public String getId() {
        return this.id;
    }

    public Document getDocument() {
        return this.document;
    }

    public User getSharedWith() {
        return this.sharedWith;
    }

    public User getSharedBy() {
        return this.sharedBy;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setDocument(final Document document) {
        this.document = document;
    }

    public void setSharedWith(final User sharedWith) {
        this.sharedWith = sharedWith;
    }

    public void setSharedBy(final User sharedBy) {
        this.sharedBy = sharedBy;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    public DocumentShare() {
    }

    public DocumentShare(final String id, final Document document, final User sharedWith, final User sharedBy, final Instant createdAt) {
        this.id = id;
        this.document = document;
        this.sharedWith = sharedWith;
        this.sharedBy = sharedBy;
        this.createdAt = createdAt;
    }
}

package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DocumentPermission permission = DocumentPermission.VIEW;
    @Column(name = "expires_at")
    private Instant expiresAt;
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
        private DocumentPermission permission;
        private Instant expiresAt;
        private Instant createdAt;

        DocumentShareBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder document(final Document document) {
            this.document = document;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder sharedWith(final User sharedWith) {
            this.sharedWith = sharedWith;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder sharedBy(final User sharedBy) {
            this.sharedBy = sharedBy;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder permission(final DocumentPermission permission) {
            this.permission = permission;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder expiresAt(final Instant expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShare.DocumentShareBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DocumentShare build() {
            return new DocumentShare(this.id, this.document, this.sharedWith, this.sharedBy, this.permission, this.expiresAt, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "DocumentShare.DocumentShareBuilder(id=" + this.id + ", document=" + this.document + ", sharedWith=" + this.sharedWith + ", sharedBy=" + this.sharedBy + ", permission=" + this.permission + ", expiresAt=" + this.expiresAt + ", createdAt=" + this.createdAt + ")";
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

    public DocumentPermission getPermission() {
        return this.permission;
    }

    public Instant getExpiresAt() {
        return this.expiresAt;
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

    public void setPermission(final DocumentPermission permission) {
        this.permission = permission;
    }

    public void setExpiresAt(final Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof DocumentShare)) return false;
        final DocumentShare other = (DocumentShare) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$document = this.getDocument();
        final java.lang.Object other$document = other.getDocument();
        if (this$document == null ? other$document != null : !this$document.equals(other$document)) return false;
        final java.lang.Object this$sharedWith = this.getSharedWith();
        final java.lang.Object other$sharedWith = other.getSharedWith();
        if (this$sharedWith == null ? other$sharedWith != null : !this$sharedWith.equals(other$sharedWith)) return false;
        final java.lang.Object this$sharedBy = this.getSharedBy();
        final java.lang.Object other$sharedBy = other.getSharedBy();
        if (this$sharedBy == null ? other$sharedBy != null : !this$sharedBy.equals(other$sharedBy)) return false;
        final java.lang.Object this$permission = this.getPermission();
        final java.lang.Object other$permission = other.getPermission();
        if (this$permission == null ? other$permission != null : !this$permission.equals(other$permission)) return false;
        final java.lang.Object this$expiresAt = this.getExpiresAt();
        final java.lang.Object other$expiresAt = other.getExpiresAt();
        if (this$expiresAt == null ? other$expiresAt != null : !this$expiresAt.equals(other$expiresAt)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof DocumentShare;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $document = this.getDocument();
        result = result * PRIME + ($document == null ? 43 : $document.hashCode());
        final java.lang.Object $sharedWith = this.getSharedWith();
        result = result * PRIME + ($sharedWith == null ? 43 : $sharedWith.hashCode());
        final java.lang.Object $sharedBy = this.getSharedBy();
        result = result * PRIME + ($sharedBy == null ? 43 : $sharedBy.hashCode());
        final java.lang.Object $permission = this.getPermission();
        result = result * PRIME + ($permission == null ? 43 : $permission.hashCode());
        final java.lang.Object $expiresAt = this.getExpiresAt();
        result = result * PRIME + ($expiresAt == null ? 43 : $expiresAt.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "DocumentShare(id=" + this.getId() + ", document=" + this.getDocument() + ", sharedWith=" + this.getSharedWith() + ", sharedBy=" + this.getSharedBy() + ", permission=" + this.getPermission() + ", expiresAt=" + this.getExpiresAt() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public DocumentShare() {
    }

    public DocumentShare(final String id, final Document document, final User sharedWith, final User sharedBy, final DocumentPermission permission, final Instant expiresAt, final Instant createdAt) {
        this.id = id;
        this.document = document;
        this.sharedWith = sharedWith;
        this.sharedBy = sharedBy;
        this.permission = permission;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }
}

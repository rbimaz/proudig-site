package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "content_blocks")
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


    public static class ContentBlockBuilder {
        private String id;
        private String sectionKey;
        private String content;
        private String draftContent;
        private User updatedBy;
        private Instant updatedAt;
        private Instant publishedAt;

        ContentBlockBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder sectionKey(final String sectionKey) {
            this.sectionKey = sectionKey;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder content(final String content) {
            this.content = content;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder draftContent(final String draftContent) {
            this.draftContent = draftContent;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder updatedBy(final User updatedBy) {
            this.updatedBy = updatedBy;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlock.ContentBlockBuilder publishedAt(final Instant publishedAt) {
            this.publishedAt = publishedAt;
            return this;
        }

        public ContentBlock build() {
            return new ContentBlock(this.id, this.sectionKey, this.content, this.draftContent, this.updatedBy, this.updatedAt, this.publishedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "ContentBlock.ContentBlockBuilder(id=" + this.id + ", sectionKey=" + this.sectionKey + ", content=" + this.content + ", draftContent=" + this.draftContent + ", updatedBy=" + this.updatedBy + ", updatedAt=" + this.updatedAt + ", publishedAt=" + this.publishedAt + ")";
        }
    }

    public static ContentBlock.ContentBlockBuilder builder() {
        return new ContentBlock.ContentBlockBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getSectionKey() {
        return this.sectionKey;
    }

    public String getContent() {
        return this.content;
    }

    public String getDraftContent() {
        return this.draftContent;
    }

    public User getUpdatedBy() {
        return this.updatedBy;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Instant getPublishedAt() {
        return this.publishedAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setSectionKey(final String sectionKey) {
        this.sectionKey = sectionKey;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public void setDraftContent(final String draftContent) {
        this.draftContent = draftContent;
    }

    public void setUpdatedBy(final User updatedBy) {
        this.updatedBy = updatedBy;
    }

    public void setUpdatedAt(final Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setPublishedAt(final Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof ContentBlock)) return false;
        final ContentBlock other = (ContentBlock) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$sectionKey = this.getSectionKey();
        final java.lang.Object other$sectionKey = other.getSectionKey();
        if (this$sectionKey == null ? other$sectionKey != null : !this$sectionKey.equals(other$sectionKey)) return false;
        final java.lang.Object this$content = this.getContent();
        final java.lang.Object other$content = other.getContent();
        if (this$content == null ? other$content != null : !this$content.equals(other$content)) return false;
        final java.lang.Object this$draftContent = this.getDraftContent();
        final java.lang.Object other$draftContent = other.getDraftContent();
        if (this$draftContent == null ? other$draftContent != null : !this$draftContent.equals(other$draftContent)) return false;
        final java.lang.Object this$updatedBy = this.getUpdatedBy();
        final java.lang.Object other$updatedBy = other.getUpdatedBy();
        if (this$updatedBy == null ? other$updatedBy != null : !this$updatedBy.equals(other$updatedBy)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        final java.lang.Object this$publishedAt = this.getPublishedAt();
        final java.lang.Object other$publishedAt = other.getPublishedAt();
        if (this$publishedAt == null ? other$publishedAt != null : !this$publishedAt.equals(other$publishedAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof ContentBlock;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $sectionKey = this.getSectionKey();
        result = result * PRIME + ($sectionKey == null ? 43 : $sectionKey.hashCode());
        final java.lang.Object $content = this.getContent();
        result = result * PRIME + ($content == null ? 43 : $content.hashCode());
        final java.lang.Object $draftContent = this.getDraftContent();
        result = result * PRIME + ($draftContent == null ? 43 : $draftContent.hashCode());
        final java.lang.Object $updatedBy = this.getUpdatedBy();
        result = result * PRIME + ($updatedBy == null ? 43 : $updatedBy.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        final java.lang.Object $publishedAt = this.getPublishedAt();
        result = result * PRIME + ($publishedAt == null ? 43 : $publishedAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "ContentBlock(id=" + this.getId() + ", sectionKey=" + this.getSectionKey() + ", content=" + this.getContent() + ", draftContent=" + this.getDraftContent() + ", updatedBy=" + this.getUpdatedBy() + ", updatedAt=" + this.getUpdatedAt() + ", publishedAt=" + this.getPublishedAt() + ")";
    }

    public ContentBlock() {
    }

    public ContentBlock(final String id, final String sectionKey, final String content, final String draftContent, final User updatedBy, final Instant updatedAt, final Instant publishedAt) {
        this.id = id;
        this.sectionKey = sectionKey;
        this.content = content;
        this.draftContent = draftContent;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
        this.publishedAt = publishedAt;
    }
}

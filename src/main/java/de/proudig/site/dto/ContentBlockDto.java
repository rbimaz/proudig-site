package de.proudig.site.dto;

import java.time.Instant;

public class ContentBlockDto {
    private String id;
    private String sectionKey;
    private String content;
    private String draftContent;
    private Instant updatedAt;
    private Instant publishedAt;


    public static class ContentBlockDtoBuilder {
        private String id;
        private String sectionKey;
        private String content;
        private String draftContent;
        private Instant updatedAt;
        private Instant publishedAt;

        ContentBlockDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public ContentBlockDto.ContentBlockDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlockDto.ContentBlockDtoBuilder sectionKey(final String sectionKey) {
            this.sectionKey = sectionKey;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlockDto.ContentBlockDtoBuilder content(final String content) {
            this.content = content;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlockDto.ContentBlockDtoBuilder draftContent(final String draftContent) {
            this.draftContent = draftContent;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlockDto.ContentBlockDtoBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContentBlockDto.ContentBlockDtoBuilder publishedAt(final Instant publishedAt) {
            this.publishedAt = publishedAt;
            return this;
        }

        public ContentBlockDto build() {
            return new ContentBlockDto(this.id, this.sectionKey, this.content, this.draftContent, this.updatedAt, this.publishedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "ContentBlockDto.ContentBlockDtoBuilder(id=" + this.id + ", sectionKey=" + this.sectionKey + ", content=" + this.content + ", draftContent=" + this.draftContent + ", updatedAt=" + this.updatedAt + ", publishedAt=" + this.publishedAt + ")";
        }
    }

    public static ContentBlockDto.ContentBlockDtoBuilder builder() {
        return new ContentBlockDto.ContentBlockDtoBuilder();
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

    public void setUpdatedAt(final Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setPublishedAt(final Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof ContentBlockDto)) return false;
        final ContentBlockDto other = (ContentBlockDto) o;
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
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        final java.lang.Object this$publishedAt = this.getPublishedAt();
        final java.lang.Object other$publishedAt = other.getPublishedAt();
        if (this$publishedAt == null ? other$publishedAt != null : !this$publishedAt.equals(other$publishedAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof ContentBlockDto;
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
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        final java.lang.Object $publishedAt = this.getPublishedAt();
        result = result * PRIME + ($publishedAt == null ? 43 : $publishedAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "ContentBlockDto(id=" + this.getId() + ", sectionKey=" + this.getSectionKey() + ", content=" + this.getContent() + ", draftContent=" + this.getDraftContent() + ", updatedAt=" + this.getUpdatedAt() + ", publishedAt=" + this.getPublishedAt() + ")";
    }

    public ContentBlockDto() {
    }

    public ContentBlockDto(final String id, final String sectionKey, final String content, final String draftContent, final Instant updatedAt, final Instant publishedAt) {
        this.id = id;
        this.sectionKey = sectionKey;
        this.content = content;
        this.draftContent = draftContent;
        this.updatedAt = updatedAt;
        this.publishedAt = publishedAt;
    }
}

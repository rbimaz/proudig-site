package de.proudig.site.dto;

import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import java.time.Instant;
import java.util.List;

public class PageDto {
    private String id;
    private String slug;
    private String title;
    private PageCategory category;
    private String content;
    private String excerpt;
    private String coverImageId;
    private List<String> tags;
    private String metaData;
    private PageStatus status;
    private String authorId;
    private String authorName;
    private Instant publishedAt;
    private Instant createdAt;
    private Instant updatedAt;


    public static class PageDtoBuilder {
        private String id;
        private String slug;
        private String title;
        private PageCategory category;
        private String content;
        private String excerpt;
        private String coverImageId;
        private List<String> tags;
        private String metaData;
        private PageStatus status;
        private String authorId;
        private String authorName;
        private Instant publishedAt;
        private Instant createdAt;
        private Instant updatedAt;

        PageDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder slug(final String slug) {
            this.slug = slug;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder title(final String title) {
            this.title = title;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder category(final PageCategory category) {
            this.category = category;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder content(final String content) {
            this.content = content;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder excerpt(final String excerpt) {
            this.excerpt = excerpt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder coverImageId(final String coverImageId) {
            this.coverImageId = coverImageId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder tags(final List<String> tags) {
            this.tags = tags;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder metaData(final String metaData) {
            this.metaData = metaData;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder status(final PageStatus status) {
            this.status = status;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder authorId(final String authorId) {
            this.authorId = authorId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder authorName(final String authorName) {
            this.authorName = authorName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder publishedAt(final Instant publishedAt) {
            this.publishedAt = publishedAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageDto.PageDtoBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public PageDto build() {
            return new PageDto(this.id, this.slug, this.title, this.category, this.content, this.excerpt, this.coverImageId, this.tags, this.metaData, this.status, this.authorId, this.authorName, this.publishedAt, this.createdAt, this.updatedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "PageDto.PageDtoBuilder(id=" + this.id + ", slug=" + this.slug + ", title=" + this.title + ", category=" + this.category + ", content=" + this.content + ", excerpt=" + this.excerpt + ", coverImageId=" + this.coverImageId + ", tags=" + this.tags + ", metaData=" + this.metaData + ", status=" + this.status + ", authorId=" + this.authorId + ", authorName=" + this.authorName + ", publishedAt=" + this.publishedAt + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
        }
    }

    public static PageDto.PageDtoBuilder builder() {
        return new PageDto.PageDtoBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getSlug() {
        return this.slug;
    }

    public String getTitle() {
        return this.title;
    }

    public PageCategory getCategory() {
        return this.category;
    }

    public String getContent() {
        return this.content;
    }

    public String getExcerpt() {
        return this.excerpt;
    }

    public String getCoverImageId() {
        return this.coverImageId;
    }

    public List<String> getTags() {
        return this.tags;
    }

    public String getMetaData() {
        return this.metaData;
    }

    public PageStatus getStatus() {
        return this.status;
    }

    public String getAuthorId() {
        return this.authorId;
    }

    public String getAuthorName() {
        return this.authorName;
    }

    public Instant getPublishedAt() {
        return this.publishedAt;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setSlug(final String slug) {
        this.slug = slug;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public void setCategory(final PageCategory category) {
        this.category = category;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public void setExcerpt(final String excerpt) {
        this.excerpt = excerpt;
    }

    public void setCoverImageId(final String coverImageId) {
        this.coverImageId = coverImageId;
    }

    public void setTags(final List<String> tags) {
        this.tags = tags;
    }

    public void setMetaData(final String metaData) {
        this.metaData = metaData;
    }

    public void setStatus(final PageStatus status) {
        this.status = status;
    }

    public void setAuthorId(final String authorId) {
        this.authorId = authorId;
    }

    public void setAuthorName(final String authorName) {
        this.authorName = authorName;
    }

    public void setPublishedAt(final Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(final Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof PageDto)) return false;
        final PageDto other = (PageDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$slug = this.getSlug();
        final java.lang.Object other$slug = other.getSlug();
        if (this$slug == null ? other$slug != null : !this$slug.equals(other$slug)) return false;
        final java.lang.Object this$title = this.getTitle();
        final java.lang.Object other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) return false;
        final java.lang.Object this$category = this.getCategory();
        final java.lang.Object other$category = other.getCategory();
        if (this$category == null ? other$category != null : !this$category.equals(other$category)) return false;
        final java.lang.Object this$content = this.getContent();
        final java.lang.Object other$content = other.getContent();
        if (this$content == null ? other$content != null : !this$content.equals(other$content)) return false;
        final java.lang.Object this$excerpt = this.getExcerpt();
        final java.lang.Object other$excerpt = other.getExcerpt();
        if (this$excerpt == null ? other$excerpt != null : !this$excerpt.equals(other$excerpt)) return false;
        final java.lang.Object this$coverImageId = this.getCoverImageId();
        final java.lang.Object other$coverImageId = other.getCoverImageId();
        if (this$coverImageId == null ? other$coverImageId != null : !this$coverImageId.equals(other$coverImageId)) return false;
        final java.lang.Object this$tags = this.getTags();
        final java.lang.Object other$tags = other.getTags();
        if (this$tags == null ? other$tags != null : !this$tags.equals(other$tags)) return false;
        final java.lang.Object this$metaData = this.getMetaData();
        final java.lang.Object other$metaData = other.getMetaData();
        if (this$metaData == null ? other$metaData != null : !this$metaData.equals(other$metaData)) return false;
        final java.lang.Object this$status = this.getStatus();
        final java.lang.Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        final java.lang.Object this$authorId = this.getAuthorId();
        final java.lang.Object other$authorId = other.getAuthorId();
        if (this$authorId == null ? other$authorId != null : !this$authorId.equals(other$authorId)) return false;
        final java.lang.Object this$authorName = this.getAuthorName();
        final java.lang.Object other$authorName = other.getAuthorName();
        if (this$authorName == null ? other$authorName != null : !this$authorName.equals(other$authorName)) return false;
        final java.lang.Object this$publishedAt = this.getPublishedAt();
        final java.lang.Object other$publishedAt = other.getPublishedAt();
        if (this$publishedAt == null ? other$publishedAt != null : !this$publishedAt.equals(other$publishedAt)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof PageDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $slug = this.getSlug();
        result = result * PRIME + ($slug == null ? 43 : $slug.hashCode());
        final java.lang.Object $title = this.getTitle();
        result = result * PRIME + ($title == null ? 43 : $title.hashCode());
        final java.lang.Object $category = this.getCategory();
        result = result * PRIME + ($category == null ? 43 : $category.hashCode());
        final java.lang.Object $content = this.getContent();
        result = result * PRIME + ($content == null ? 43 : $content.hashCode());
        final java.lang.Object $excerpt = this.getExcerpt();
        result = result * PRIME + ($excerpt == null ? 43 : $excerpt.hashCode());
        final java.lang.Object $coverImageId = this.getCoverImageId();
        result = result * PRIME + ($coverImageId == null ? 43 : $coverImageId.hashCode());
        final java.lang.Object $tags = this.getTags();
        result = result * PRIME + ($tags == null ? 43 : $tags.hashCode());
        final java.lang.Object $metaData = this.getMetaData();
        result = result * PRIME + ($metaData == null ? 43 : $metaData.hashCode());
        final java.lang.Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        final java.lang.Object $authorId = this.getAuthorId();
        result = result * PRIME + ($authorId == null ? 43 : $authorId.hashCode());
        final java.lang.Object $authorName = this.getAuthorName();
        result = result * PRIME + ($authorName == null ? 43 : $authorName.hashCode());
        final java.lang.Object $publishedAt = this.getPublishedAt();
        result = result * PRIME + ($publishedAt == null ? 43 : $publishedAt.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "PageDto(id=" + this.getId() + ", slug=" + this.getSlug() + ", title=" + this.getTitle() + ", category=" + this.getCategory() + ", content=" + this.getContent() + ", excerpt=" + this.getExcerpt() + ", coverImageId=" + this.getCoverImageId() + ", tags=" + this.getTags() + ", metaData=" + this.getMetaData() + ", status=" + this.getStatus() + ", authorId=" + this.getAuthorId() + ", authorName=" + this.getAuthorName() + ", publishedAt=" + this.getPublishedAt() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }

    public PageDto() {
    }

    public PageDto(final String id, final String slug, final String title, final PageCategory category, final String content, final String excerpt, final String coverImageId, final List<String> tags, final String metaData, final PageStatus status, final String authorId, final String authorName, final Instant publishedAt, final Instant createdAt, final Instant updatedAt) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.category = category;
        this.content = content;
        this.excerpt = excerpt;
        this.coverImageId = coverImageId;
        this.tags = tags;
        this.metaData = metaData;
        this.status = status;
        this.authorId = authorId;
        this.authorName = authorName;
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

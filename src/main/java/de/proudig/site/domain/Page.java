package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pages")
public class Page {
    @Id
    @Column(length = 36)
    private String id;
    @Column(unique = true, nullable = false, length = 255)
    private String slug;
    @Column(nullable = false, length = 500)
    private String title;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PageCategory category;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(length = 500)
    private String excerpt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_image_id")
    private Media coverImage;
    @Column(length = 1000)
    private String tags;
    @Column(name = "meta_data", columnDefinition = "TEXT")
    private String metaData;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PageStatus status = PageStatus.DRAFT;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    @Column(name = "published_at")
    private Instant publishedAt;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "updated_at")
    private Instant updatedAt;
    @Column(name = "show_in_hero", nullable = false)
    private boolean showInHero;
    @Column(name = "auto_archive_after", length = 20)
    private String autoArchiveAfter;
    @Column(name = "archived_at")
    private Instant archivedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    // Helper methods for tags
    public List<String> getTagsList() {
        if (tags == null || tags.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.asList(tags.split(",\\s*"));
    }

    public void setTagsList(List<String> tagsList) {
        if (tagsList == null || tagsList.isEmpty()) {
            this.tags = null;
        } else {
            this.tags = String.join(", ", tagsList);
        }
    }


    public static class PageBuilder {
        private String id;
        private String slug;
        private String title;
        private PageCategory category;
        private String content;
        private String excerpt;
        private Media coverImage;
        private String tags;
        private String metaData;
        private PageStatus status;
        private User author;
        private Instant publishedAt;
        private Instant createdAt;
        private Instant updatedAt;

        PageBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder slug(final String slug) {
            this.slug = slug;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder title(final String title) {
            this.title = title;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder category(final PageCategory category) {
            this.category = category;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder content(final String content) {
            this.content = content;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder excerpt(final String excerpt) {
            this.excerpt = excerpt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder coverImage(final Media coverImage) {
            this.coverImage = coverImage;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder tags(final String tags) {
            this.tags = tags;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder metaData(final String metaData) {
            this.metaData = metaData;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder status(final PageStatus status) {
            this.status = status;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder author(final User author) {
            this.author = author;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder publishedAt(final Instant publishedAt) {
            this.publishedAt = publishedAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Page.PageBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Page build() {
            return new Page(this.id, this.slug, this.title, this.category, this.content, this.excerpt, this.coverImage, this.tags, this.metaData, this.status, this.author, this.publishedAt, this.createdAt, this.updatedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "Page.PageBuilder(id=" + this.id + ", slug=" + this.slug + ", title=" + this.title + ", category=" + this.category + ", content=" + this.content + ", excerpt=" + this.excerpt + ", coverImage=" + this.coverImage + ", tags=" + this.tags + ", metaData=" + this.metaData + ", status=" + this.status + ", author=" + this.author + ", publishedAt=" + this.publishedAt + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
        }
    }

    public static Page.PageBuilder builder() {
        return new Page.PageBuilder();
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

    public Media getCoverImage() {
        return this.coverImage;
    }

    public String getTags() {
        return this.tags;
    }

    public String getMetaData() {
        return this.metaData;
    }

    public PageStatus getStatus() {
        return this.status;
    }

    public User getAuthor() {
        return this.author;
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

    public boolean isShowInHero() {
        return this.showInHero;
    }

    public void setShowInHero(final boolean showInHero) {
        this.showInHero = showInHero;
    }

    public String getAutoArchiveAfter() {
        return this.autoArchiveAfter;
    }

    public void setAutoArchiveAfter(final String autoArchiveAfter) {
        this.autoArchiveAfter = autoArchiveAfter;
    }

    public Instant getArchivedAt() {
        return this.archivedAt;
    }

    public void setArchivedAt(final Instant archivedAt) {
        this.archivedAt = archivedAt;
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

    public void setCoverImage(final Media coverImage) {
        this.coverImage = coverImage;
    }

    public void setTags(final String tags) {
        this.tags = tags;
    }

    public void setMetaData(final String metaData) {
        this.metaData = metaData;
    }

    public void setStatus(final PageStatus status) {
        this.status = status;
    }

    public void setAuthor(final User author) {
        this.author = author;
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
        if (!(o instanceof Page)) return false;
        final Page other = (Page) o;
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
        final java.lang.Object this$coverImage = this.getCoverImage();
        final java.lang.Object other$coverImage = other.getCoverImage();
        if (this$coverImage == null ? other$coverImage != null : !this$coverImage.equals(other$coverImage)) return false;
        final java.lang.Object this$tags = this.getTags();
        final java.lang.Object other$tags = other.getTags();
        if (this$tags == null ? other$tags != null : !this$tags.equals(other$tags)) return false;
        final java.lang.Object this$metaData = this.getMetaData();
        final java.lang.Object other$metaData = other.getMetaData();
        if (this$metaData == null ? other$metaData != null : !this$metaData.equals(other$metaData)) return false;
        final java.lang.Object this$status = this.getStatus();
        final java.lang.Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        final java.lang.Object this$author = this.getAuthor();
        final java.lang.Object other$author = other.getAuthor();
        if (this$author == null ? other$author != null : !this$author.equals(other$author)) return false;
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
        return other instanceof Page;
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
        final java.lang.Object $coverImage = this.getCoverImage();
        result = result * PRIME + ($coverImage == null ? 43 : $coverImage.hashCode());
        final java.lang.Object $tags = this.getTags();
        result = result * PRIME + ($tags == null ? 43 : $tags.hashCode());
        final java.lang.Object $metaData = this.getMetaData();
        result = result * PRIME + ($metaData == null ? 43 : $metaData.hashCode());
        final java.lang.Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        final java.lang.Object $author = this.getAuthor();
        result = result * PRIME + ($author == null ? 43 : $author.hashCode());
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
        return "Page(id=" + this.getId() + ", slug=" + this.getSlug() + ", title=" + this.getTitle() + ", category=" + this.getCategory() + ", content=" + this.getContent() + ", excerpt=" + this.getExcerpt() + ", coverImage=" + this.getCoverImage() + ", tags=" + this.getTags() + ", metaData=" + this.getMetaData() + ", status=" + this.getStatus() + ", author=" + this.getAuthor() + ", publishedAt=" + this.getPublishedAt() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }

    public Page() {
    }

    public Page(final String id, final String slug, final String title, final PageCategory category, final String content, final String excerpt, final Media coverImage, final String tags, final String metaData, final PageStatus status, final User author, final Instant publishedAt, final Instant createdAt, final Instant updatedAt) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.category = category;
        this.content = content;
        this.excerpt = excerpt;
        this.coverImage = coverImage;
        this.tags = tags;
        this.metaData = metaData;
        this.status = status;
        this.author = author;
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

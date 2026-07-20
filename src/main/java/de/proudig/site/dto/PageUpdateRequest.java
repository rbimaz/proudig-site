package de.proudig.site.dto;

import de.proudig.site.domain.PageCategory;
import java.util.List;

public class PageUpdateRequest {
    private String title;
    private String slug;
    private PageCategory category;
    private String content;
    private String excerpt;
    private String coverImageId;
    private List<String> tags;
    private String metaData;


    public static class PageUpdateRequestBuilder {
        private String title;
        private String slug;
        private PageCategory category;
        private String content;
        private String excerpt;
        private String coverImageId;
        private List<String> tags;
        private String metaData;

        PageUpdateRequestBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder title(final String title) {
            this.title = title;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder slug(final String slug) {
            this.slug = slug;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder category(final PageCategory category) {
            this.category = category;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder content(final String content) {
            this.content = content;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder excerpt(final String excerpt) {
            this.excerpt = excerpt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder coverImageId(final String coverImageId) {
            this.coverImageId = coverImageId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder tags(final List<String> tags) {
            this.tags = tags;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public PageUpdateRequest.PageUpdateRequestBuilder metaData(final String metaData) {
            this.metaData = metaData;
            return this;
        }

        public PageUpdateRequest build() {
            return new PageUpdateRequest(this.title, this.slug, this.category, this.content, this.excerpt, this.coverImageId, this.tags, this.metaData);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "PageUpdateRequest.PageUpdateRequestBuilder(title=" + this.title + ", slug=" + this.slug + ", category=" + this.category + ", content=" + this.content + ", excerpt=" + this.excerpt + ", coverImageId=" + this.coverImageId + ", tags=" + this.tags + ", metaData=" + this.metaData + ")";
        }
    }

    public static PageUpdateRequest.PageUpdateRequestBuilder builder() {
        return new PageUpdateRequest.PageUpdateRequestBuilder();
    }

    public String getTitle() {
        return this.title;
    }

    public String getSlug() {
        return this.slug;
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

    public void setTitle(final String title) {
        this.title = title;
    }

    public void setSlug(final String slug) {
        this.slug = slug;
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

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof PageUpdateRequest)) return false;
        final PageUpdateRequest other = (PageUpdateRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$title = this.getTitle();
        final java.lang.Object other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) return false;
        final java.lang.Object this$slug = this.getSlug();
        final java.lang.Object other$slug = other.getSlug();
        if (this$slug == null ? other$slug != null : !this$slug.equals(other$slug)) return false;
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
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof PageUpdateRequest;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $title = this.getTitle();
        result = result * PRIME + ($title == null ? 43 : $title.hashCode());
        final java.lang.Object $slug = this.getSlug();
        result = result * PRIME + ($slug == null ? 43 : $slug.hashCode());
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
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "PageUpdateRequest(title=" + this.getTitle() + ", slug=" + this.getSlug() + ", category=" + this.getCategory() + ", content=" + this.getContent() + ", excerpt=" + this.getExcerpt() + ", coverImageId=" + this.getCoverImageId() + ", tags=" + this.getTags() + ", metaData=" + this.getMetaData() + ")";
    }

    public PageUpdateRequest() {
    }

    public PageUpdateRequest(final String title, final String slug, final PageCategory category, final String content, final String excerpt, final String coverImageId, final List<String> tags, final String metaData) {
        this.title = title;
        this.slug = slug;
        this.category = category;
        this.content = content;
        this.excerpt = excerpt;
        this.coverImageId = coverImageId;
        this.tags = tags;
        this.metaData = metaData;
    }
}

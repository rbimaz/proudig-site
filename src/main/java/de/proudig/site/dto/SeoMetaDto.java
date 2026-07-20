package de.proudig.site.dto;

public class SeoMetaDto {
    private String title;
    private String description;
    private String ogTitle;
    private String ogDescription;
    private String ogImage;
    private String ogType;
    private String canonicalUrl;
    private String keywords;


    public static class SeoMetaDtoBuilder {
        private String title;
        private String description;
        private String ogTitle;
        private String ogDescription;
        private String ogImage;
        private String ogType;
        private String canonicalUrl;
        private String keywords;

        SeoMetaDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder title(final String title) {
            this.title = title;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder description(final String description) {
            this.description = description;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder ogTitle(final String ogTitle) {
            this.ogTitle = ogTitle;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder ogDescription(final String ogDescription) {
            this.ogDescription = ogDescription;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder ogImage(final String ogImage) {
            this.ogImage = ogImage;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder ogType(final String ogType) {
            this.ogType = ogType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder canonicalUrl(final String canonicalUrl) {
            this.canonicalUrl = canonicalUrl;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public SeoMetaDto.SeoMetaDtoBuilder keywords(final String keywords) {
            this.keywords = keywords;
            return this;
        }

        public SeoMetaDto build() {
            return new SeoMetaDto(this.title, this.description, this.ogTitle, this.ogDescription, this.ogImage, this.ogType, this.canonicalUrl, this.keywords);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "SeoMetaDto.SeoMetaDtoBuilder(title=" + this.title + ", description=" + this.description + ", ogTitle=" + this.ogTitle + ", ogDescription=" + this.ogDescription + ", ogImage=" + this.ogImage + ", ogType=" + this.ogType + ", canonicalUrl=" + this.canonicalUrl + ", keywords=" + this.keywords + ")";
        }
    }

    public static SeoMetaDto.SeoMetaDtoBuilder builder() {
        return new SeoMetaDto.SeoMetaDtoBuilder();
    }

    public String getTitle() {
        return this.title;
    }

    public String getDescription() {
        return this.description;
    }

    public String getOgTitle() {
        return this.ogTitle;
    }

    public String getOgDescription() {
        return this.ogDescription;
    }

    public String getOgImage() {
        return this.ogImage;
    }

    public String getOgType() {
        return this.ogType;
    }

    public String getCanonicalUrl() {
        return this.canonicalUrl;
    }

    public String getKeywords() {
        return this.keywords;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public void setOgTitle(final String ogTitle) {
        this.ogTitle = ogTitle;
    }

    public void setOgDescription(final String ogDescription) {
        this.ogDescription = ogDescription;
    }

    public void setOgImage(final String ogImage) {
        this.ogImage = ogImage;
    }

    public void setOgType(final String ogType) {
        this.ogType = ogType;
    }

    public void setCanonicalUrl(final String canonicalUrl) {
        this.canonicalUrl = canonicalUrl;
    }

    public void setKeywords(final String keywords) {
        this.keywords = keywords;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof SeoMetaDto)) return false;
        final SeoMetaDto other = (SeoMetaDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$title = this.getTitle();
        final java.lang.Object other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) return false;
        final java.lang.Object this$description = this.getDescription();
        final java.lang.Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        final java.lang.Object this$ogTitle = this.getOgTitle();
        final java.lang.Object other$ogTitle = other.getOgTitle();
        if (this$ogTitle == null ? other$ogTitle != null : !this$ogTitle.equals(other$ogTitle)) return false;
        final java.lang.Object this$ogDescription = this.getOgDescription();
        final java.lang.Object other$ogDescription = other.getOgDescription();
        if (this$ogDescription == null ? other$ogDescription != null : !this$ogDescription.equals(other$ogDescription)) return false;
        final java.lang.Object this$ogImage = this.getOgImage();
        final java.lang.Object other$ogImage = other.getOgImage();
        if (this$ogImage == null ? other$ogImage != null : !this$ogImage.equals(other$ogImage)) return false;
        final java.lang.Object this$ogType = this.getOgType();
        final java.lang.Object other$ogType = other.getOgType();
        if (this$ogType == null ? other$ogType != null : !this$ogType.equals(other$ogType)) return false;
        final java.lang.Object this$canonicalUrl = this.getCanonicalUrl();
        final java.lang.Object other$canonicalUrl = other.getCanonicalUrl();
        if (this$canonicalUrl == null ? other$canonicalUrl != null : !this$canonicalUrl.equals(other$canonicalUrl)) return false;
        final java.lang.Object this$keywords = this.getKeywords();
        final java.lang.Object other$keywords = other.getKeywords();
        if (this$keywords == null ? other$keywords != null : !this$keywords.equals(other$keywords)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof SeoMetaDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $title = this.getTitle();
        result = result * PRIME + ($title == null ? 43 : $title.hashCode());
        final java.lang.Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        final java.lang.Object $ogTitle = this.getOgTitle();
        result = result * PRIME + ($ogTitle == null ? 43 : $ogTitle.hashCode());
        final java.lang.Object $ogDescription = this.getOgDescription();
        result = result * PRIME + ($ogDescription == null ? 43 : $ogDescription.hashCode());
        final java.lang.Object $ogImage = this.getOgImage();
        result = result * PRIME + ($ogImage == null ? 43 : $ogImage.hashCode());
        final java.lang.Object $ogType = this.getOgType();
        result = result * PRIME + ($ogType == null ? 43 : $ogType.hashCode());
        final java.lang.Object $canonicalUrl = this.getCanonicalUrl();
        result = result * PRIME + ($canonicalUrl == null ? 43 : $canonicalUrl.hashCode());
        final java.lang.Object $keywords = this.getKeywords();
        result = result * PRIME + ($keywords == null ? 43 : $keywords.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "SeoMetaDto(title=" + this.getTitle() + ", description=" + this.getDescription() + ", ogTitle=" + this.getOgTitle() + ", ogDescription=" + this.getOgDescription() + ", ogImage=" + this.getOgImage() + ", ogType=" + this.getOgType() + ", canonicalUrl=" + this.getCanonicalUrl() + ", keywords=" + this.getKeywords() + ")";
    }

    public SeoMetaDto() {
    }

    public SeoMetaDto(final String title, final String description, final String ogTitle, final String ogDescription, final String ogImage, final String ogType, final String canonicalUrl, final String keywords) {
        this.title = title;
        this.description = description;
        this.ogTitle = ogTitle;
        this.ogDescription = ogDescription;
        this.ogImage = ogImage;
        this.ogType = ogType;
        this.canonicalUrl = canonicalUrl;
        this.keywords = keywords;
    }
}

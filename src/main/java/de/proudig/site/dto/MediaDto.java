package de.proudig.site.dto;

import java.time.Instant;

public class MediaDto {
    private String id;
    private String name;
    private String title;
    private String contentType;
    private Long fileSize;
    private Instant createdAt;


    public static class MediaDtoBuilder {
        private String id;
        private String name;
        private String title;
        private String contentType;
        private Long fileSize;
        private Instant createdAt;

        MediaDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public MediaDto.MediaDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public MediaDto.MediaDtoBuilder name(final String name) {
            this.name = name;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public MediaDto.MediaDtoBuilder title(final String title) {
            this.title = title;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public MediaDto.MediaDtoBuilder contentType(final String contentType) {
            this.contentType = contentType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public MediaDto.MediaDtoBuilder fileSize(final Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public MediaDto.MediaDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public MediaDto build() {
            return new MediaDto(this.id, this.name, this.title, this.contentType, this.fileSize, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "MediaDto.MediaDtoBuilder(id=" + this.id + ", name=" + this.name + ", title=" + this.title + ", contentType=" + this.contentType + ", fileSize=" + this.fileSize + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static MediaDto.MediaDtoBuilder builder() {
        return new MediaDto.MediaDtoBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getTitle() {
        return this.title;
    }

    public String getContentType() {
        return this.contentType;
    }

    public Long getFileSize() {
        return this.fileSize;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public void setContentType(final String contentType) {
        this.contentType = contentType;
    }

    public void setFileSize(final Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof MediaDto)) return false;
        final MediaDto other = (MediaDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$fileSize = this.getFileSize();
        final java.lang.Object other$fileSize = other.getFileSize();
        if (this$fileSize == null ? other$fileSize != null : !this$fileSize.equals(other$fileSize)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$name = this.getName();
        final java.lang.Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final java.lang.Object this$title = this.getTitle();
        final java.lang.Object other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) return false;
        final java.lang.Object this$contentType = this.getContentType();
        final java.lang.Object other$contentType = other.getContentType();
        if (this$contentType == null ? other$contentType != null : !this$contentType.equals(other$contentType)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof MediaDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $fileSize = this.getFileSize();
        result = result * PRIME + ($fileSize == null ? 43 : $fileSize.hashCode());
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final java.lang.Object $title = this.getTitle();
        result = result * PRIME + ($title == null ? 43 : $title.hashCode());
        final java.lang.Object $contentType = this.getContentType();
        result = result * PRIME + ($contentType == null ? 43 : $contentType.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "MediaDto(id=" + this.getId() + ", name=" + this.getName() + ", title=" + this.getTitle() + ", contentType=" + this.getContentType() + ", fileSize=" + this.getFileSize() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public MediaDto() {
    }

    public MediaDto(final String id, final String name, final String title, final String contentType, final Long fileSize, final Instant createdAt) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
    }
}

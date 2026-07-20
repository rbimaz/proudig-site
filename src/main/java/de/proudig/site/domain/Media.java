package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "media")
public class Media {
    @Id
    @Column(length = 36)
    private String id;
    @Column(nullable = false)
    private String name;
    private String title;
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;
    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
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


    public static class MediaBuilder {
        private String id;
        private String name;
        private String title;
        private String contentType;
        private String storagePath;
        private Long fileSize;
        private User uploadedBy;
        private Instant createdAt;

        MediaBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder name(final String name) {
            this.name = name;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder title(final String title) {
            this.title = title;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder contentType(final String contentType) {
            this.contentType = contentType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder storagePath(final String storagePath) {
            this.storagePath = storagePath;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder fileSize(final Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder uploadedBy(final User uploadedBy) {
            this.uploadedBy = uploadedBy;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Media.MediaBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Media build() {
            return new Media(this.id, this.name, this.title, this.contentType, this.storagePath, this.fileSize, this.uploadedBy, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "Media.MediaBuilder(id=" + this.id + ", name=" + this.name + ", title=" + this.title + ", contentType=" + this.contentType + ", storagePath=" + this.storagePath + ", fileSize=" + this.fileSize + ", uploadedBy=" + this.uploadedBy + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static Media.MediaBuilder builder() {
        return new Media.MediaBuilder();
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

    public String getStoragePath() {
        return this.storagePath;
    }

    public Long getFileSize() {
        return this.fileSize;
    }

    public User getUploadedBy() {
        return this.uploadedBy;
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

    public void setStoragePath(final String storagePath) {
        this.storagePath = storagePath;
    }

    public void setFileSize(final Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setUploadedBy(final User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof Media)) return false;
        final Media other = (Media) o;
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
        final java.lang.Object this$storagePath = this.getStoragePath();
        final java.lang.Object other$storagePath = other.getStoragePath();
        if (this$storagePath == null ? other$storagePath != null : !this$storagePath.equals(other$storagePath)) return false;
        final java.lang.Object this$uploadedBy = this.getUploadedBy();
        final java.lang.Object other$uploadedBy = other.getUploadedBy();
        if (this$uploadedBy == null ? other$uploadedBy != null : !this$uploadedBy.equals(other$uploadedBy)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof Media;
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
        final java.lang.Object $storagePath = this.getStoragePath();
        result = result * PRIME + ($storagePath == null ? 43 : $storagePath.hashCode());
        final java.lang.Object $uploadedBy = this.getUploadedBy();
        result = result * PRIME + ($uploadedBy == null ? 43 : $uploadedBy.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Media(id=" + this.getId() + ", name=" + this.getName() + ", title=" + this.getTitle() + ", contentType=" + this.getContentType() + ", storagePath=" + this.getStoragePath() + ", fileSize=" + this.getFileSize() + ", uploadedBy=" + this.getUploadedBy() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public Media() {
    }

    public Media(final String id, final String name, final String title, final String contentType, final String storagePath, final Long fileSize, final User uploadedBy, final Instant createdAt) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.contentType = contentType;
        this.storagePath = storagePath;
        this.fileSize = fileSize;
        this.uploadedBy = uploadedBy;
        this.createdAt = createdAt;
    }
}

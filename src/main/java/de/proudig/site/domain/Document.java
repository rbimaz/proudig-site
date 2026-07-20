package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @Column(length = 36)
    private String id;
    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;
    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "updated_at")
    private Instant updatedAt;

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


    public static class DocumentBuilder {
        private String id;
        private String fileName;
        private String storagePath;
        private Long fileSize;
        private String contentType;
        private Folder folder;
        private User uploadedBy;
        private String description;
        private Instant createdAt;
        private Instant updatedAt;

        DocumentBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder fileName(final String fileName) {
            this.fileName = fileName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder storagePath(final String storagePath) {
            this.storagePath = storagePath;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder fileSize(final Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder contentType(final String contentType) {
            this.contentType = contentType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder folder(final Folder folder) {
            this.folder = folder;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder uploadedBy(final User uploadedBy) {
            this.uploadedBy = uploadedBy;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder description(final String description) {
            this.description = description;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Document.DocumentBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Document build() {
            return new Document(this.id, this.fileName, this.storagePath, this.fileSize, this.contentType, this.folder, this.uploadedBy, this.description, this.createdAt, this.updatedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "Document.DocumentBuilder(id=" + this.id + ", fileName=" + this.fileName + ", storagePath=" + this.storagePath + ", fileSize=" + this.fileSize + ", contentType=" + this.contentType + ", folder=" + this.folder + ", uploadedBy=" + this.uploadedBy + ", description=" + this.description + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
        }
    }

    public static Document.DocumentBuilder builder() {
        return new Document.DocumentBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getFileName() {
        return this.fileName;
    }

    public String getStoragePath() {
        return this.storagePath;
    }

    public Long getFileSize() {
        return this.fileSize;
    }

    public String getContentType() {
        return this.contentType;
    }

    public Folder getFolder() {
        return this.folder;
    }

    public User getUploadedBy() {
        return this.uploadedBy;
    }

    public String getDescription() {
        return this.description;
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

    public void setFileName(final String fileName) {
        this.fileName = fileName;
    }

    public void setStoragePath(final String storagePath) {
        this.storagePath = storagePath;
    }

    public void setFileSize(final Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setContentType(final String contentType) {
        this.contentType = contentType;
    }

    public void setFolder(final Folder folder) {
        this.folder = folder;
    }

    public void setUploadedBy(final User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public void setDescription(final String description) {
        this.description = description;
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
        if (!(o instanceof Document)) return false;
        final Document other = (Document) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$fileSize = this.getFileSize();
        final java.lang.Object other$fileSize = other.getFileSize();
        if (this$fileSize == null ? other$fileSize != null : !this$fileSize.equals(other$fileSize)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$fileName = this.getFileName();
        final java.lang.Object other$fileName = other.getFileName();
        if (this$fileName == null ? other$fileName != null : !this$fileName.equals(other$fileName)) return false;
        final java.lang.Object this$storagePath = this.getStoragePath();
        final java.lang.Object other$storagePath = other.getStoragePath();
        if (this$storagePath == null ? other$storagePath != null : !this$storagePath.equals(other$storagePath)) return false;
        final java.lang.Object this$contentType = this.getContentType();
        final java.lang.Object other$contentType = other.getContentType();
        if (this$contentType == null ? other$contentType != null : !this$contentType.equals(other$contentType)) return false;
        final java.lang.Object this$folder = this.getFolder();
        final java.lang.Object other$folder = other.getFolder();
        if (this$folder == null ? other$folder != null : !this$folder.equals(other$folder)) return false;
        final java.lang.Object this$uploadedBy = this.getUploadedBy();
        final java.lang.Object other$uploadedBy = other.getUploadedBy();
        if (this$uploadedBy == null ? other$uploadedBy != null : !this$uploadedBy.equals(other$uploadedBy)) return false;
        final java.lang.Object this$description = this.getDescription();
        final java.lang.Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof Document;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $fileSize = this.getFileSize();
        result = result * PRIME + ($fileSize == null ? 43 : $fileSize.hashCode());
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $fileName = this.getFileName();
        result = result * PRIME + ($fileName == null ? 43 : $fileName.hashCode());
        final java.lang.Object $storagePath = this.getStoragePath();
        result = result * PRIME + ($storagePath == null ? 43 : $storagePath.hashCode());
        final java.lang.Object $contentType = this.getContentType();
        result = result * PRIME + ($contentType == null ? 43 : $contentType.hashCode());
        final java.lang.Object $folder = this.getFolder();
        result = result * PRIME + ($folder == null ? 43 : $folder.hashCode());
        final java.lang.Object $uploadedBy = this.getUploadedBy();
        result = result * PRIME + ($uploadedBy == null ? 43 : $uploadedBy.hashCode());
        final java.lang.Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Document(id=" + this.getId() + ", fileName=" + this.getFileName() + ", storagePath=" + this.getStoragePath() + ", fileSize=" + this.getFileSize() + ", contentType=" + this.getContentType() + ", folder=" + this.getFolder() + ", uploadedBy=" + this.getUploadedBy() + ", description=" + this.getDescription() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }

    public Document() {
    }

    public Document(final String id, final String fileName, final String storagePath, final Long fileSize, final String contentType, final Folder folder, final User uploadedBy, final String description, final Instant createdAt, final Instant updatedAt) {
        this.id = id;
        this.fileName = fileName;
        this.storagePath = storagePath;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.folder = folder;
        this.uploadedBy = uploadedBy;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

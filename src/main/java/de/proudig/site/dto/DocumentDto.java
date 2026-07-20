package de.proudig.site.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;

public class DocumentDto {
    private String id;
    private String fileName;
    @JsonIgnore
    private String storagePath;
    private String contentType;
    private Long fileSize;
    private String folderId;
    private String uploadedById;
    private String uploadedByName;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;


    public static class DocumentDtoBuilder {
        private String id;
        private String fileName;
        private String storagePath;
        private String contentType;
        private Long fileSize;
        private String folderId;
        private String uploadedById;
        private String uploadedByName;
        private String description;
        private Instant createdAt;
        private Instant updatedAt;

        DocumentDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder fileName(final String fileName) {
            this.fileName = fileName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        @JsonIgnore
        public DocumentDto.DocumentDtoBuilder storagePath(final String storagePath) {
            this.storagePath = storagePath;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder contentType(final String contentType) {
            this.contentType = contentType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder fileSize(final Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder folderId(final String folderId) {
            this.folderId = folderId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder uploadedById(final String uploadedById) {
            this.uploadedById = uploadedById;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder uploadedByName(final String uploadedByName) {
            this.uploadedByName = uploadedByName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder description(final String description) {
            this.description = description;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentDto.DocumentDtoBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public DocumentDto build() {
            return new DocumentDto(this.id, this.fileName, this.storagePath, this.contentType, this.fileSize, this.folderId, this.uploadedById, this.uploadedByName, this.description, this.createdAt, this.updatedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "DocumentDto.DocumentDtoBuilder(id=" + this.id + ", fileName=" + this.fileName + ", storagePath=" + this.storagePath + ", contentType=" + this.contentType + ", fileSize=" + this.fileSize + ", folderId=" + this.folderId + ", uploadedById=" + this.uploadedById + ", uploadedByName=" + this.uploadedByName + ", description=" + this.description + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
        }
    }

    public static DocumentDto.DocumentDtoBuilder builder() {
        return new DocumentDto.DocumentDtoBuilder();
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

    public String getContentType() {
        return this.contentType;
    }

    public Long getFileSize() {
        return this.fileSize;
    }

    public String getFolderId() {
        return this.folderId;
    }

    public String getUploadedById() {
        return this.uploadedById;
    }

    public String getUploadedByName() {
        return this.uploadedByName;
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

    @JsonIgnore
    public void setStoragePath(final String storagePath) {
        this.storagePath = storagePath;
    }

    public void setContentType(final String contentType) {
        this.contentType = contentType;
    }

    public void setFileSize(final Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setFolderId(final String folderId) {
        this.folderId = folderId;
    }

    public void setUploadedById(final String uploadedById) {
        this.uploadedById = uploadedById;
    }

    public void setUploadedByName(final String uploadedByName) {
        this.uploadedByName = uploadedByName;
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
        if (!(o instanceof DocumentDto)) return false;
        final DocumentDto other = (DocumentDto) o;
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
        final java.lang.Object this$folderId = this.getFolderId();
        final java.lang.Object other$folderId = other.getFolderId();
        if (this$folderId == null ? other$folderId != null : !this$folderId.equals(other$folderId)) return false;
        final java.lang.Object this$uploadedById = this.getUploadedById();
        final java.lang.Object other$uploadedById = other.getUploadedById();
        if (this$uploadedById == null ? other$uploadedById != null : !this$uploadedById.equals(other$uploadedById)) return false;
        final java.lang.Object this$uploadedByName = this.getUploadedByName();
        final java.lang.Object other$uploadedByName = other.getUploadedByName();
        if (this$uploadedByName == null ? other$uploadedByName != null : !this$uploadedByName.equals(other$uploadedByName)) return false;
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
        return other instanceof DocumentDto;
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
        final java.lang.Object $folderId = this.getFolderId();
        result = result * PRIME + ($folderId == null ? 43 : $folderId.hashCode());
        final java.lang.Object $uploadedById = this.getUploadedById();
        result = result * PRIME + ($uploadedById == null ? 43 : $uploadedById.hashCode());
        final java.lang.Object $uploadedByName = this.getUploadedByName();
        result = result * PRIME + ($uploadedByName == null ? 43 : $uploadedByName.hashCode());
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
        return "DocumentDto(id=" + this.getId() + ", fileName=" + this.getFileName() + ", storagePath=" + this.getStoragePath() + ", contentType=" + this.getContentType() + ", fileSize=" + this.getFileSize() + ", folderId=" + this.getFolderId() + ", uploadedById=" + this.getUploadedById() + ", uploadedByName=" + this.getUploadedByName() + ", description=" + this.getDescription() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }

    public DocumentDto() {
    }

    public DocumentDto(final String id, final String fileName, final String storagePath, final String contentType, final Long fileSize, final String folderId, final String uploadedById, final String uploadedByName, final String description, final Instant createdAt, final Instant updatedAt) {
        this.id = id;
        this.fileName = fileName;
        this.storagePath = storagePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.folderId = folderId;
        this.uploadedById = uploadedById;
        this.uploadedByName = uploadedByName;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

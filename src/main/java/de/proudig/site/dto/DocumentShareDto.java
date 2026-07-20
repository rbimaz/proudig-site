package de.proudig.site.dto;

import de.proudig.site.domain.DocumentPermission;
import java.time.Instant;

public class DocumentShareDto {
    private String id;
    private String documentId;
    private String sharedWithId;
    private String sharedWithName;
    private DocumentPermission permission;
    private Instant expiresAt;
    private Instant createdAt;


    public static class DocumentShareDtoBuilder {
        private String id;
        private String documentId;
        private String sharedWithId;
        private String sharedWithName;
        private DocumentPermission permission;
        private Instant expiresAt;
        private Instant createdAt;

        DocumentShareDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder documentId(final String documentId) {
            this.documentId = documentId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder sharedWithId(final String sharedWithId) {
            this.sharedWithId = sharedWithId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder sharedWithName(final String sharedWithName) {
            this.sharedWithName = sharedWithName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder permission(final DocumentPermission permission) {
            this.permission = permission;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder expiresAt(final Instant expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DocumentShareDto.DocumentShareDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DocumentShareDto build() {
            return new DocumentShareDto(this.id, this.documentId, this.sharedWithId, this.sharedWithName, this.permission, this.expiresAt, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "DocumentShareDto.DocumentShareDtoBuilder(id=" + this.id + ", documentId=" + this.documentId + ", sharedWithId=" + this.sharedWithId + ", sharedWithName=" + this.sharedWithName + ", permission=" + this.permission + ", expiresAt=" + this.expiresAt + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static DocumentShareDto.DocumentShareDtoBuilder builder() {
        return new DocumentShareDto.DocumentShareDtoBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getDocumentId() {
        return this.documentId;
    }

    public String getSharedWithId() {
        return this.sharedWithId;
    }

    public String getSharedWithName() {
        return this.sharedWithName;
    }

    public DocumentPermission getPermission() {
        return this.permission;
    }

    public Instant getExpiresAt() {
        return this.expiresAt;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setDocumentId(final String documentId) {
        this.documentId = documentId;
    }

    public void setSharedWithId(final String sharedWithId) {
        this.sharedWithId = sharedWithId;
    }

    public void setSharedWithName(final String sharedWithName) {
        this.sharedWithName = sharedWithName;
    }

    public void setPermission(final DocumentPermission permission) {
        this.permission = permission;
    }

    public void setExpiresAt(final Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof DocumentShareDto)) return false;
        final DocumentShareDto other = (DocumentShareDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$documentId = this.getDocumentId();
        final java.lang.Object other$documentId = other.getDocumentId();
        if (this$documentId == null ? other$documentId != null : !this$documentId.equals(other$documentId)) return false;
        final java.lang.Object this$sharedWithId = this.getSharedWithId();
        final java.lang.Object other$sharedWithId = other.getSharedWithId();
        if (this$sharedWithId == null ? other$sharedWithId != null : !this$sharedWithId.equals(other$sharedWithId)) return false;
        final java.lang.Object this$sharedWithName = this.getSharedWithName();
        final java.lang.Object other$sharedWithName = other.getSharedWithName();
        if (this$sharedWithName == null ? other$sharedWithName != null : !this$sharedWithName.equals(other$sharedWithName)) return false;
        final java.lang.Object this$permission = this.getPermission();
        final java.lang.Object other$permission = other.getPermission();
        if (this$permission == null ? other$permission != null : !this$permission.equals(other$permission)) return false;
        final java.lang.Object this$expiresAt = this.getExpiresAt();
        final java.lang.Object other$expiresAt = other.getExpiresAt();
        if (this$expiresAt == null ? other$expiresAt != null : !this$expiresAt.equals(other$expiresAt)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof DocumentShareDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $documentId = this.getDocumentId();
        result = result * PRIME + ($documentId == null ? 43 : $documentId.hashCode());
        final java.lang.Object $sharedWithId = this.getSharedWithId();
        result = result * PRIME + ($sharedWithId == null ? 43 : $sharedWithId.hashCode());
        final java.lang.Object $sharedWithName = this.getSharedWithName();
        result = result * PRIME + ($sharedWithName == null ? 43 : $sharedWithName.hashCode());
        final java.lang.Object $permission = this.getPermission();
        result = result * PRIME + ($permission == null ? 43 : $permission.hashCode());
        final java.lang.Object $expiresAt = this.getExpiresAt();
        result = result * PRIME + ($expiresAt == null ? 43 : $expiresAt.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "DocumentShareDto(id=" + this.getId() + ", documentId=" + this.getDocumentId() + ", sharedWithId=" + this.getSharedWithId() + ", sharedWithName=" + this.getSharedWithName() + ", permission=" + this.getPermission() + ", expiresAt=" + this.getExpiresAt() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public DocumentShareDto() {
    }

    public DocumentShareDto(final String id, final String documentId, final String sharedWithId, final String sharedWithName, final DocumentPermission permission, final Instant expiresAt, final Instant createdAt) {
        this.id = id;
        this.documentId = documentId;
        this.sharedWithId = sharedWithId;
        this.sharedWithName = sharedWithName;
        this.permission = permission;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }
}

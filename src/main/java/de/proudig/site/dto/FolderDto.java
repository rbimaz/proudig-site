package de.proudig.site.dto;

import java.time.Instant;

public class FolderDto {
    private String id;
    private String name;
    private String parentFolderId;
    private String ownerId;
    private Instant createdAt;
    private Instant updatedAt;
    private long documentCount;
    private long childFolderCount;
    private boolean hasChildren;


    public static class FolderDtoBuilder {
        private String id;
        private String name;
        private String parentFolderId;
        private String ownerId;
        private Instant createdAt;
        private Instant updatedAt;
        private long documentCount;
        private long childFolderCount;
        private boolean hasChildren;

        FolderDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder name(final String name) {
            this.name = name;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder parentFolderId(final String parentFolderId) {
            this.parentFolderId = parentFolderId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder ownerId(final String ownerId) {
            this.ownerId = ownerId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder documentCount(final long documentCount) {
            this.documentCount = documentCount;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder childFolderCount(final long childFolderCount) {
            this.childFolderCount = childFolderCount;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public FolderDto.FolderDtoBuilder hasChildren(final boolean hasChildren) {
            this.hasChildren = hasChildren;
            return this;
        }

        public FolderDto build() {
            return new FolderDto(this.id, this.name, this.parentFolderId, this.ownerId, this.createdAt, this.updatedAt, this.documentCount, this.childFolderCount, this.hasChildren);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "FolderDto.FolderDtoBuilder(id=" + this.id + ", name=" + this.name + ", parentFolderId=" + this.parentFolderId + ", ownerId=" + this.ownerId + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ", documentCount=" + this.documentCount + ", childFolderCount=" + this.childFolderCount + ", hasChildren=" + this.hasChildren + ")";
        }
    }

    public static FolderDto.FolderDtoBuilder builder() {
        return new FolderDto.FolderDtoBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getParentFolderId() {
        return this.parentFolderId;
    }

    public String getOwnerId() {
        return this.ownerId;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public long getDocumentCount() {
        return this.documentCount;
    }

    public long getChildFolderCount() {
        return this.childFolderCount;
    }

    public boolean isHasChildren() {
        return this.hasChildren;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void setParentFolderId(final String parentFolderId) {
        this.parentFolderId = parentFolderId;
    }

    public void setOwnerId(final String ownerId) {
        this.ownerId = ownerId;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(final Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setDocumentCount(final long documentCount) {
        this.documentCount = documentCount;
    }

    public void setChildFolderCount(final long childFolderCount) {
        this.childFolderCount = childFolderCount;
    }

    public void setHasChildren(final boolean hasChildren) {
        this.hasChildren = hasChildren;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof FolderDto)) return false;
        final FolderDto other = (FolderDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        if (this.getDocumentCount() != other.getDocumentCount()) return false;
        if (this.getChildFolderCount() != other.getChildFolderCount()) return false;
        if (this.isHasChildren() != other.isHasChildren()) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$name = this.getName();
        final java.lang.Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final java.lang.Object this$parentFolderId = this.getParentFolderId();
        final java.lang.Object other$parentFolderId = other.getParentFolderId();
        if (this$parentFolderId == null ? other$parentFolderId != null : !this$parentFolderId.equals(other$parentFolderId)) return false;
        final java.lang.Object this$ownerId = this.getOwnerId();
        final java.lang.Object other$ownerId = other.getOwnerId();
        if (this$ownerId == null ? other$ownerId != null : !this$ownerId.equals(other$ownerId)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof FolderDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $documentCount = this.getDocumentCount();
        result = result * PRIME + (int) ($documentCount >>> 32 ^ $documentCount);
        final long $childFolderCount = this.getChildFolderCount();
        result = result * PRIME + (int) ($childFolderCount >>> 32 ^ $childFolderCount);
        result = result * PRIME + (this.isHasChildren() ? 79 : 97);
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final java.lang.Object $parentFolderId = this.getParentFolderId();
        result = result * PRIME + ($parentFolderId == null ? 43 : $parentFolderId.hashCode());
        final java.lang.Object $ownerId = this.getOwnerId();
        result = result * PRIME + ($ownerId == null ? 43 : $ownerId.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "FolderDto(id=" + this.getId() + ", name=" + this.getName() + ", parentFolderId=" + this.getParentFolderId() + ", ownerId=" + this.getOwnerId() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ", documentCount=" + this.getDocumentCount() + ", childFolderCount=" + this.getChildFolderCount() + ", hasChildren=" + this.isHasChildren() + ")";
    }

    public FolderDto() {
    }

    public FolderDto(final String id, final String name, final String parentFolderId, final String ownerId, final Instant createdAt, final Instant updatedAt, final long documentCount, final long childFolderCount, final boolean hasChildren) {
        this.id = id;
        this.name = name;
        this.parentFolderId = parentFolderId;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.documentCount = documentCount;
        this.childFolderCount = childFolderCount;
        this.hasChildren = hasChildren;
    }
}

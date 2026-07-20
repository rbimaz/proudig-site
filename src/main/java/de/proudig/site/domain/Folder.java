package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "folders")
public class Folder {
    @Id
    @Column(length = 36)
    private String id;
    @Column(nullable = false, length = 255)
    private String name;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
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


    public static class FolderBuilder {
        private String id;
        private String name;
        private Folder parentFolder;
        private User owner;
        private Instant createdAt;
        private Instant updatedAt;

        FolderBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public Folder.FolderBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Folder.FolderBuilder name(final String name) {
            this.name = name;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Folder.FolderBuilder parentFolder(final Folder parentFolder) {
            this.parentFolder = parentFolder;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Folder.FolderBuilder owner(final User owner) {
            this.owner = owner;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Folder.FolderBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public Folder.FolderBuilder updatedAt(final Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Folder build() {
            return new Folder(this.id, this.name, this.parentFolder, this.owner, this.createdAt, this.updatedAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "Folder.FolderBuilder(id=" + this.id + ", name=" + this.name + ", parentFolder=" + this.parentFolder + ", owner=" + this.owner + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
        }
    }

    public static Folder.FolderBuilder builder() {
        return new Folder.FolderBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public Folder getParentFolder() {
        return this.parentFolder;
    }

    public User getOwner() {
        return this.owner;
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

    public void setName(final String name) {
        this.name = name;
    }

    public void setParentFolder(final Folder parentFolder) {
        this.parentFolder = parentFolder;
    }

    public void setOwner(final User owner) {
        this.owner = owner;
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
        if (!(o instanceof Folder)) return false;
        final Folder other = (Folder) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$name = this.getName();
        final java.lang.Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final java.lang.Object this$parentFolder = this.getParentFolder();
        final java.lang.Object other$parentFolder = other.getParentFolder();
        if (this$parentFolder == null ? other$parentFolder != null : !this$parentFolder.equals(other$parentFolder)) return false;
        final java.lang.Object this$owner = this.getOwner();
        final java.lang.Object other$owner = other.getOwner();
        if (this$owner == null ? other$owner != null : !this$owner.equals(other$owner)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof Folder;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final java.lang.Object $parentFolder = this.getParentFolder();
        result = result * PRIME + ($parentFolder == null ? 43 : $parentFolder.hashCode());
        final java.lang.Object $owner = this.getOwner();
        result = result * PRIME + ($owner == null ? 43 : $owner.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Folder(id=" + this.getId() + ", name=" + this.getName() + ", parentFolder=" + this.getParentFolder() + ", owner=" + this.getOwner() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }

    public Folder() {
    }

    public Folder(final String id, final String name, final Folder parentFolder, final User owner, final Instant createdAt, final Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.parentFolder = parentFolder;
        this.owner = owner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

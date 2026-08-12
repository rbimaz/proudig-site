package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Interne Freigabe eines Ordners (READ|WRITE) an genau einen Nutzer ODER eine
 * Gruppe. Wirkt auf den gesamten Teilbaum (Vererbung). Genau eines von
 * {@code sharedWithUser}/{@code sharedWithGroup} ist gesetzt.
 */
@Entity
@Table(name = "folder_shares")
public class FolderShare {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = false)
    private Folder folder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SharePermission permission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user")
    private User sharedWithUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_group")
    private UserGroup sharedWithGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_by", nullable = false)
    private User sharedBy;

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

    public FolderShare() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Folder getFolder() {
        return folder;
    }

    public void setFolder(Folder folder) {
        this.folder = folder;
    }

    public SharePermission getPermission() {
        return permission;
    }

    public void setPermission(SharePermission permission) {
        this.permission = permission;
    }

    public User getSharedWithUser() {
        return sharedWithUser;
    }

    public void setSharedWithUser(User sharedWithUser) {
        this.sharedWithUser = sharedWithUser;
    }

    public UserGroup getSharedWithGroup() {
        return sharedWithGroup;
    }

    public void setSharedWithGroup(UserGroup sharedWithGroup) {
        this.sharedWithGroup = sharedWithGroup;
    }

    public User getSharedBy() {
        return sharedBy;
    }

    public void setSharedBy(User sharedBy) {
        this.sharedBy = sharedBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

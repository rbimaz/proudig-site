package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "activity_log")
public class ActivityLog {
    @Id
    @Column(length = 36)
    private String id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false, length = 50)
    private String action;
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;
    @Column(name = "entity_id", length = 255)
    private String entityId;
    @Column(columnDefinition = "TEXT")
    private String details;
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


    public static class ActivityLogBuilder {
        private String id;
        private User user;
        private String action;
        private String entityType;
        private String entityId;
        private String details;
        private Instant createdAt;

        ActivityLogBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder user(final User user) {
            this.user = user;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder action(final String action) {
            this.action = action;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder entityType(final String entityType) {
            this.entityType = entityType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder entityId(final String entityId) {
            this.entityId = entityId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder details(final String details) {
            this.details = details;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLog.ActivityLogBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ActivityLog build() {
            return new ActivityLog(this.id, this.user, this.action, this.entityType, this.entityId, this.details, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "ActivityLog.ActivityLogBuilder(id=" + this.id + ", user=" + this.user + ", action=" + this.action + ", entityType=" + this.entityType + ", entityId=" + this.entityId + ", details=" + this.details + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static ActivityLog.ActivityLogBuilder builder() {
        return new ActivityLog.ActivityLogBuilder();
    }

    public String getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public String getAction() {
        return this.action;
    }

    public String getEntityType() {
        return this.entityType;
    }

    public String getEntityId() {
        return this.entityId;
    }

    public String getDetails() {
        return this.details;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    public void setAction(final String action) {
        this.action = action;
    }

    public void setEntityType(final String entityType) {
        this.entityType = entityType;
    }

    public void setEntityId(final String entityId) {
        this.entityId = entityId;
    }

    public void setDetails(final String details) {
        this.details = details;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof ActivityLog)) return false;
        final ActivityLog other = (ActivityLog) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$user = this.getUser();
        final java.lang.Object other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) return false;
        final java.lang.Object this$action = this.getAction();
        final java.lang.Object other$action = other.getAction();
        if (this$action == null ? other$action != null : !this$action.equals(other$action)) return false;
        final java.lang.Object this$entityType = this.getEntityType();
        final java.lang.Object other$entityType = other.getEntityType();
        if (this$entityType == null ? other$entityType != null : !this$entityType.equals(other$entityType)) return false;
        final java.lang.Object this$entityId = this.getEntityId();
        final java.lang.Object other$entityId = other.getEntityId();
        if (this$entityId == null ? other$entityId != null : !this$entityId.equals(other$entityId)) return false;
        final java.lang.Object this$details = this.getDetails();
        final java.lang.Object other$details = other.getDetails();
        if (this$details == null ? other$details != null : !this$details.equals(other$details)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof ActivityLog;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $user = this.getUser();
        result = result * PRIME + ($user == null ? 43 : $user.hashCode());
        final java.lang.Object $action = this.getAction();
        result = result * PRIME + ($action == null ? 43 : $action.hashCode());
        final java.lang.Object $entityType = this.getEntityType();
        result = result * PRIME + ($entityType == null ? 43 : $entityType.hashCode());
        final java.lang.Object $entityId = this.getEntityId();
        result = result * PRIME + ($entityId == null ? 43 : $entityId.hashCode());
        final java.lang.Object $details = this.getDetails();
        result = result * PRIME + ($details == null ? 43 : $details.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "ActivityLog(id=" + this.getId() + ", user=" + this.getUser() + ", action=" + this.getAction() + ", entityType=" + this.getEntityType() + ", entityId=" + this.getEntityId() + ", details=" + this.getDetails() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public ActivityLog() {
    }

    public ActivityLog(final String id, final User user, final String action, final String entityType, final String entityId, final String details, final Instant createdAt) {
        this.id = id;
        this.user = user;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.createdAt = createdAt;
    }
}

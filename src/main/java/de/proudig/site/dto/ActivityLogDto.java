package de.proudig.site.dto;

import java.time.Instant;

public class ActivityLogDto {
    private String id;
    private String userId;
    private String userEmail;
    private String userName;
    private String action;
    private String entityType;
    private String entityId;
    private String details;
    private Instant createdAt;


    public static class ActivityLogDtoBuilder {
        private String id;
        private String userId;
        private String userEmail;
        private String userName;
        private String action;
        private String entityType;
        private String entityId;
        private String details;
        private Instant createdAt;

        ActivityLogDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder userId(final String userId) {
            this.userId = userId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder userEmail(final String userEmail) {
            this.userEmail = userEmail;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder userName(final String userName) {
            this.userName = userName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder action(final String action) {
            this.action = action;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder entityType(final String entityType) {
            this.entityType = entityType;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder entityId(final String entityId) {
            this.entityId = entityId;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder details(final String details) {
            this.details = details;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ActivityLogDto.ActivityLogDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ActivityLogDto build() {
            return new ActivityLogDto(this.id, this.userId, this.userEmail, this.userName, this.action, this.entityType, this.entityId, this.details, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "ActivityLogDto.ActivityLogDtoBuilder(id=" + this.id + ", userId=" + this.userId + ", userEmail=" + this.userEmail + ", userName=" + this.userName + ", action=" + this.action + ", entityType=" + this.entityType + ", entityId=" + this.entityId + ", details=" + this.details + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static ActivityLogDto.ActivityLogDtoBuilder builder() {
        return new ActivityLogDto.ActivityLogDtoBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getUserId() {
        return this.userId;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public String getUserName() {
        return this.userName;
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

    public void setUserId(final String userId) {
        this.userId = userId;
    }

    public void setUserEmail(final String userEmail) {
        this.userEmail = userEmail;
    }

    public void setUserName(final String userName) {
        this.userName = userName;
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
        if (!(o instanceof ActivityLogDto)) return false;
        final ActivityLogDto other = (ActivityLogDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$userId = this.getUserId();
        final java.lang.Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final java.lang.Object this$userEmail = this.getUserEmail();
        final java.lang.Object other$userEmail = other.getUserEmail();
        if (this$userEmail == null ? other$userEmail != null : !this$userEmail.equals(other$userEmail)) return false;
        final java.lang.Object this$userName = this.getUserName();
        final java.lang.Object other$userName = other.getUserName();
        if (this$userName == null ? other$userName != null : !this$userName.equals(other$userName)) return false;
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
        return other instanceof ActivityLogDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        final java.lang.Object $userEmail = this.getUserEmail();
        result = result * PRIME + ($userEmail == null ? 43 : $userEmail.hashCode());
        final java.lang.Object $userName = this.getUserName();
        result = result * PRIME + ($userName == null ? 43 : $userName.hashCode());
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
        return "ActivityLogDto(id=" + this.getId() + ", userId=" + this.getUserId() + ", userEmail=" + this.getUserEmail() + ", userName=" + this.getUserName() + ", action=" + this.getAction() + ", entityType=" + this.getEntityType() + ", entityId=" + this.getEntityId() + ", details=" + this.getDetails() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public ActivityLogDto() {
    }

    public ActivityLogDto(final String id, final String userId, final String userEmail, final String userName, final String action, final String entityType, final String entityId, final String details, final Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.createdAt = createdAt;
    }
}

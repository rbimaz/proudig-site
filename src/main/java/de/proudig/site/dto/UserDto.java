package de.proudig.site.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class UserDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String company;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;


    public static class UserDtoBuilder {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String company;
        private Set<String> roles;
        private LocalDateTime createdAt;
        private LocalDateTime lastLoginAt;

        UserDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder email(final String email) {
            this.email = email;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder firstName(final String firstName) {
            this.firstName = firstName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder lastName(final String lastName) {
            this.lastName = lastName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder company(final String company) {
            this.company = company;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder roles(final Set<String> roles) {
            this.roles = roles;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder createdAt(final LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserDto.UserDtoBuilder lastLoginAt(final LocalDateTime lastLoginAt) {
            this.lastLoginAt = lastLoginAt;
            return this;
        }

        public UserDto build() {
            return new UserDto(this.id, this.email, this.firstName, this.lastName, this.company, this.roles, this.createdAt, this.lastLoginAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "UserDto.UserDtoBuilder(id=" + this.id + ", email=" + this.email + ", firstName=" + this.firstName + ", lastName=" + this.lastName + ", company=" + this.company + ", roles=" + this.roles + ", createdAt=" + this.createdAt + ", lastLoginAt=" + this.lastLoginAt + ")";
        }
    }

    public static UserDto.UserDtoBuilder builder() {
        return new UserDto.UserDtoBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getEmail() {
        return this.email;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public String getCompany() {
        return this.company;
    }

    public Set<String> getRoles() {
        return this.roles;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getLastLoginAt() {
        return this.lastLoginAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public void setCompany(final String company) {
        this.company = company;
    }

    public void setRoles(final Set<String> roles) {
        this.roles = roles;
    }

    public void setCreatedAt(final LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setLastLoginAt(final LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof UserDto)) return false;
        final UserDto other = (UserDto) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$email = this.getEmail();
        final java.lang.Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        final java.lang.Object this$firstName = this.getFirstName();
        final java.lang.Object other$firstName = other.getFirstName();
        if (this$firstName == null ? other$firstName != null : !this$firstName.equals(other$firstName)) return false;
        final java.lang.Object this$lastName = this.getLastName();
        final java.lang.Object other$lastName = other.getLastName();
        if (this$lastName == null ? other$lastName != null : !this$lastName.equals(other$lastName)) return false;
        final java.lang.Object this$company = this.getCompany();
        final java.lang.Object other$company = other.getCompany();
        if (this$company == null ? other$company != null : !this$company.equals(other$company)) return false;
        final java.lang.Object this$roles = this.getRoles();
        final java.lang.Object other$roles = other.getRoles();
        if (this$roles == null ? other$roles != null : !this$roles.equals(other$roles)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$lastLoginAt = this.getLastLoginAt();
        final java.lang.Object other$lastLoginAt = other.getLastLoginAt();
        if (this$lastLoginAt == null ? other$lastLoginAt != null : !this$lastLoginAt.equals(other$lastLoginAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof UserDto;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final java.lang.Object $firstName = this.getFirstName();
        result = result * PRIME + ($firstName == null ? 43 : $firstName.hashCode());
        final java.lang.Object $lastName = this.getLastName();
        result = result * PRIME + ($lastName == null ? 43 : $lastName.hashCode());
        final java.lang.Object $company = this.getCompany();
        result = result * PRIME + ($company == null ? 43 : $company.hashCode());
        final java.lang.Object $roles = this.getRoles();
        result = result * PRIME + ($roles == null ? 43 : $roles.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $lastLoginAt = this.getLastLoginAt();
        result = result * PRIME + ($lastLoginAt == null ? 43 : $lastLoginAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "UserDto(id=" + this.getId() + ", email=" + this.getEmail() + ", firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", company=" + this.getCompany() + ", roles=" + this.getRoles() + ", createdAt=" + this.getCreatedAt() + ", lastLoginAt=" + this.getLastLoginAt() + ")";
    }

    public UserDto() {
    }

    public UserDto(final String id, final String email, final String firstName, final String lastName, final String company, final Set<String> roles, final LocalDateTime createdAt, final LocalDateTime lastLoginAt) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.roles = roles;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }
}

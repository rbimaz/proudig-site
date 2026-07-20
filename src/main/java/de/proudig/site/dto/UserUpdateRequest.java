package de.proudig.site.dto;

import java.util.Set;

public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String company;
    private Set<String> roles;
    private String password;


    public static class UserUpdateRequestBuilder {
        private String firstName;
        private String lastName;
        private String company;
        private Set<String> roles;
        private String password;

        UserUpdateRequestBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public UserUpdateRequest.UserUpdateRequestBuilder firstName(final String firstName) {
            this.firstName = firstName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserUpdateRequest.UserUpdateRequestBuilder lastName(final String lastName) {
            this.lastName = lastName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserUpdateRequest.UserUpdateRequestBuilder company(final String company) {
            this.company = company;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserUpdateRequest.UserUpdateRequestBuilder roles(final Set<String> roles) {
            this.roles = roles;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserUpdateRequest.UserUpdateRequestBuilder password(final String password) {
            this.password = password;
            return this;
        }

        public UserUpdateRequest build() {
            return new UserUpdateRequest(this.firstName, this.lastName, this.company, this.roles, this.password);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "UserUpdateRequest.UserUpdateRequestBuilder(firstName=" + this.firstName + ", lastName=" + this.lastName + ", company=" + this.company + ", roles=" + this.roles + ", password=" + this.password + ")";
        }
    }

    public static UserUpdateRequest.UserUpdateRequestBuilder builder() {
        return new UserUpdateRequest.UserUpdateRequestBuilder();
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

    public String getPassword() {
        return this.password;
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

    public void setPassword(final String password) {
        this.password = password;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof UserUpdateRequest)) return false;
        final UserUpdateRequest other = (UserUpdateRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
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
        final java.lang.Object this$password = this.getPassword();
        final java.lang.Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof UserUpdateRequest;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $firstName = this.getFirstName();
        result = result * PRIME + ($firstName == null ? 43 : $firstName.hashCode());
        final java.lang.Object $lastName = this.getLastName();
        result = result * PRIME + ($lastName == null ? 43 : $lastName.hashCode());
        final java.lang.Object $company = this.getCompany();
        result = result * PRIME + ($company == null ? 43 : $company.hashCode());
        final java.lang.Object $roles = this.getRoles();
        result = result * PRIME + ($roles == null ? 43 : $roles.hashCode());
        final java.lang.Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "UserUpdateRequest(firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", company=" + this.getCompany() + ", roles=" + this.getRoles() + ", password=" + this.getPassword() + ")";
    }

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(final String firstName, final String lastName, final String company, final Set<String> roles, final String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.roles = roles;
        this.password = password;
    }
}

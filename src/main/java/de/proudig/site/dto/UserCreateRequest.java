package de.proudig.site.dto;

import java.util.Set;

public class UserCreateRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String company;
    private Set<String> roles;
    private boolean forcePasswordChange;


    public static class UserCreateRequestBuilder {
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String company;
        private Set<String> roles;
        private boolean forcePasswordChange;

        UserCreateRequestBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder email(final String email) {
            this.email = email;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder password(final String password) {
            this.password = password;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder firstName(final String firstName) {
            this.firstName = firstName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder lastName(final String lastName) {
            this.lastName = lastName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder company(final String company) {
            this.company = company;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder roles(final Set<String> roles) {
            this.roles = roles;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public UserCreateRequest.UserCreateRequestBuilder forcePasswordChange(final boolean forcePasswordChange) {
            this.forcePasswordChange = forcePasswordChange;
            return this;
        }

        public UserCreateRequest build() {
            return new UserCreateRequest(this.email, this.password, this.firstName, this.lastName, this.company, this.roles, this.forcePasswordChange);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "UserCreateRequest.UserCreateRequestBuilder(email=" + this.email + ", password=" + this.password + ", firstName=" + this.firstName + ", lastName=" + this.lastName + ", company=" + this.company + ", roles=" + this.roles + ", forcePasswordChange=" + this.forcePasswordChange + ")";
        }
    }

    public static UserCreateRequest.UserCreateRequestBuilder builder() {
        return new UserCreateRequest.UserCreateRequestBuilder();
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
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

    public boolean isForcePasswordChange() {
        return this.forcePasswordChange;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public void setPassword(final String password) {
        this.password = password;
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

    public void setForcePasswordChange(final boolean forcePasswordChange) {
        this.forcePasswordChange = forcePasswordChange;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof UserCreateRequest)) return false;
        final UserCreateRequest other = (UserCreateRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        if (this.isForcePasswordChange() != other.isForcePasswordChange()) return false;
        final java.lang.Object this$email = this.getEmail();
        final java.lang.Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        final java.lang.Object this$password = this.getPassword();
        final java.lang.Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
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
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof UserCreateRequest;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        result = result * PRIME + (this.isForcePasswordChange() ? 79 : 97);
        final java.lang.Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final java.lang.Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        final java.lang.Object $firstName = this.getFirstName();
        result = result * PRIME + ($firstName == null ? 43 : $firstName.hashCode());
        final java.lang.Object $lastName = this.getLastName();
        result = result * PRIME + ($lastName == null ? 43 : $lastName.hashCode());
        final java.lang.Object $company = this.getCompany();
        result = result * PRIME + ($company == null ? 43 : $company.hashCode());
        final java.lang.Object $roles = this.getRoles();
        result = result * PRIME + ($roles == null ? 43 : $roles.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "UserCreateRequest(email=" + this.getEmail() + ", password=" + this.getPassword() + ", firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", company=" + this.getCompany() + ", roles=" + this.getRoles() + ", forcePasswordChange=" + this.isForcePasswordChange() + ")";
    }

    public UserCreateRequest() {
    }

    public UserCreateRequest(final String email, final String password, final String firstName, final String lastName, final String company, final Set<String> roles, final boolean forcePasswordChange) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.roles = roles;
        this.forcePasswordChange = forcePasswordChange;
    }
}

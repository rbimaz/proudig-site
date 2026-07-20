package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {
    @Id
    @Column(length = 36)
    private String id;
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    @Column(nullable = false, length = 255)
    private String email;
    @Column(length = 255)
    private String company;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    @Column(name = "is_read", nullable = false)
    private Boolean isRead;
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

    private static Boolean $default$isRead() {
        return false;
    }


    public static class ContactMessageBuilder {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String company;
        private String message;
        private boolean isRead$set;
        private Boolean isRead$value;
        private Instant createdAt;

        ContactMessageBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder firstName(final String firstName) {
            this.firstName = firstName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder lastName(final String lastName) {
            this.lastName = lastName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder email(final String email) {
            this.email = email;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder company(final String company) {
            this.company = company;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder message(final String message) {
            this.message = message;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder isRead(final Boolean isRead) {
            this.isRead$value = isRead;
            isRead$set = true;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessage.ContactMessageBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ContactMessage build() {
            Boolean isRead$value = this.isRead$value;
            if (!this.isRead$set) isRead$value = ContactMessage.$default$isRead();
            return new ContactMessage(this.id, this.firstName, this.lastName, this.email, this.company, this.message, isRead$value, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "ContactMessage.ContactMessageBuilder(id=" + this.id + ", firstName=" + this.firstName + ", lastName=" + this.lastName + ", email=" + this.email + ", company=" + this.company + ", message=" + this.message + ", isRead$value=" + this.isRead$value + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static ContactMessage.ContactMessageBuilder builder() {
        return new ContactMessage.ContactMessageBuilder();
    }

    public String getId() {
        return this.id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public String getCompany() {
        return this.company;
    }

    public String getMessage() {
        return this.message;
    }

    public Boolean getIsRead() {
        return this.isRead;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public void setCompany(final String company) {
        this.company = company;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public void setIsRead(final Boolean isRead) {
        this.isRead = isRead;
    }

    public void setCreatedAt(final Instant createdAt) {
        this.createdAt = createdAt;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof ContactMessage)) return false;
        final ContactMessage other = (ContactMessage) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$isRead = this.getIsRead();
        final java.lang.Object other$isRead = other.getIsRead();
        if (this$isRead == null ? other$isRead != null : !this$isRead.equals(other$isRead)) return false;
        final java.lang.Object this$id = this.getId();
        final java.lang.Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final java.lang.Object this$firstName = this.getFirstName();
        final java.lang.Object other$firstName = other.getFirstName();
        if (this$firstName == null ? other$firstName != null : !this$firstName.equals(other$firstName)) return false;
        final java.lang.Object this$lastName = this.getLastName();
        final java.lang.Object other$lastName = other.getLastName();
        if (this$lastName == null ? other$lastName != null : !this$lastName.equals(other$lastName)) return false;
        final java.lang.Object this$email = this.getEmail();
        final java.lang.Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        final java.lang.Object this$company = this.getCompany();
        final java.lang.Object other$company = other.getCompany();
        if (this$company == null ? other$company != null : !this$company.equals(other$company)) return false;
        final java.lang.Object this$message = this.getMessage();
        final java.lang.Object other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof ContactMessage;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $isRead = this.getIsRead();
        result = result * PRIME + ($isRead == null ? 43 : $isRead.hashCode());
        final java.lang.Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final java.lang.Object $firstName = this.getFirstName();
        result = result * PRIME + ($firstName == null ? 43 : $firstName.hashCode());
        final java.lang.Object $lastName = this.getLastName();
        result = result * PRIME + ($lastName == null ? 43 : $lastName.hashCode());
        final java.lang.Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final java.lang.Object $company = this.getCompany();
        result = result * PRIME + ($company == null ? 43 : $company.hashCode());
        final java.lang.Object $message = this.getMessage();
        result = result * PRIME + ($message == null ? 43 : $message.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "ContactMessage(id=" + this.getId() + ", firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", email=" + this.getEmail() + ", company=" + this.getCompany() + ", message=" + this.getMessage() + ", isRead=" + this.getIsRead() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public ContactMessage() {
        this.isRead = ContactMessage.$default$isRead();
    }

    public ContactMessage(final String id, final String firstName, final String lastName, final String email, final String company, final String message, final Boolean isRead, final Instant createdAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.company = company;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
}

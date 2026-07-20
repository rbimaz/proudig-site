package de.proudig.site.dto;

import de.proudig.site.domain.ContactMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public class ContactMessageDto {
    private String id;
    @NotBlank(message = "Vorname ist erforderlich")
    @Size(max = 100, message = "Vorname darf maximal 100 Zeichen lang sein")
    private String firstName;
    @NotBlank(message = "Nachname ist erforderlich")
    @Size(max = 100, message = "Nachname darf maximal 100 Zeichen lang sein")
    private String lastName;
    @NotBlank(message = "E-Mail ist erforderlich")
    @Email(message = "Ungültige E-Mail-Adresse")
    @Size(max = 255, message = "E-Mail darf maximal 255 Zeichen lang sein")
    private String email;
    @Size(max = 255, message = "Unternehmen darf maximal 255 Zeichen lang sein")
    private String company;
    @NotBlank(message = "Nachricht ist erforderlich")
    @Size(max = 5000, message = "Nachricht darf maximal 5000 Zeichen lang sein")
    private String message;
    private Boolean isRead;
    private Instant createdAt;

    public static ContactMessageDto fromEntity(ContactMessage entity) {
        return ContactMessageDto.builder().id(entity.getId()).firstName(entity.getFirstName()).lastName(entity.getLastName()).email(entity.getEmail()).company(entity.getCompany()).message(entity.getMessage()).isRead(entity.getIsRead()).createdAt(entity.getCreatedAt()).build();
    }

    public ContactMessage toEntity() {
        return ContactMessage.builder().firstName(this.firstName).lastName(this.lastName).email(this.email).company(this.company).message(this.message).build();
    }


    public static class ContactMessageDtoBuilder {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String company;
        private String message;
        private Boolean isRead;
        private Instant createdAt;

        ContactMessageDtoBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder id(final String id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder firstName(final String firstName) {
            this.firstName = firstName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder lastName(final String lastName) {
            this.lastName = lastName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder email(final String email) {
            this.email = email;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder company(final String company) {
            this.company = company;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder message(final String message) {
            this.message = message;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder isRead(final Boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public ContactMessageDto.ContactMessageDtoBuilder createdAt(final Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ContactMessageDto build() {
            return new ContactMessageDto(this.id, this.firstName, this.lastName, this.email, this.company, this.message, this.isRead, this.createdAt);
        }

        @java.lang.Override
        public java.lang.String toString() {
            return "ContactMessageDto.ContactMessageDtoBuilder(id=" + this.id + ", firstName=" + this.firstName + ", lastName=" + this.lastName + ", email=" + this.email + ", company=" + this.company + ", message=" + this.message + ", isRead=" + this.isRead + ", createdAt=" + this.createdAt + ")";
        }
    }

    public static ContactMessageDto.ContactMessageDtoBuilder builder() {
        return new ContactMessageDto.ContactMessageDtoBuilder();
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
        if (!(o instanceof ContactMessageDto)) return false;
        final ContactMessageDto other = (ContactMessageDto) o;
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
        return other instanceof ContactMessageDto;
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
        return "ContactMessageDto(id=" + this.getId() + ", firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", email=" + this.getEmail() + ", company=" + this.getCompany() + ", message=" + this.getMessage() + ", isRead=" + this.getIsRead() + ", createdAt=" + this.getCreatedAt() + ")";
    }

    public ContactMessageDto() {
    }

    public ContactMessageDto(final String id, final String firstName, final String lastName, final String email, final String company, final String message, final Boolean isRead, final Instant createdAt) {
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

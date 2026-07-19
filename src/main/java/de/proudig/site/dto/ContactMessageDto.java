package de.proudig.site.dto;

import de.proudig.site.domain.ContactMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
        return ContactMessageDto.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .company(entity.getCompany())
                .message(entity.getMessage())
                .isRead(entity.getIsRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public ContactMessage toEntity() {
        return ContactMessage.builder()
                .firstName(this.firstName)
                .lastName(this.lastName)
                .email(this.email)
                .company(this.company)
                .message(this.message)
                .build();
    }
}

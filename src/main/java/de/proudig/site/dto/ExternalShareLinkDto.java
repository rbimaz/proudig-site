package de.proudig.site.dto;

import de.proudig.site.domain.ExternalShareLink;
import java.time.Instant;

/** Admin-Sicht auf einen externen Freigabe-Link. */
public record ExternalShareLinkDto(
        String id,
        String token,
        String targetType,   // DOCUMENT | FOLDER
        String targetId,
        String targetName,
        boolean requiresPassword,
        Instant expiresAt,
        String recipientEmail,
        boolean revoked,
        Instant createdAt,
        Instant lastAccessedAt,
        int accessCount
) {
    public static ExternalShareLinkDto of(ExternalShareLink link) {
        boolean folder = link.isFolderLink();
        return new ExternalShareLinkDto(
                link.getId(),
                link.getToken(),
                folder ? "FOLDER" : "DOCUMENT",
                folder ? link.getFolder().getId() : link.getDocument().getId(),
                folder ? link.getFolder().getName() : link.getDocument().getFileName(),
                link.getPasswordHash() != null,
                link.getExpiresAt(),
                link.getRecipientEmail(),
                link.isRevoked(),
                link.getCreatedAt(),
                link.getLastAccessedAt(),
                link.getAccessCount()
        );
    }
}

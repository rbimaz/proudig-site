package de.proudig.site.dto;

/** Öffentliche Metadaten eines Freigabe-Links (kein Datei-Inhalt). */
public record PublicShareMetaDto(
        String targetType,   // DOCUMENT | FOLDER
        String name,
        boolean requiresPassword,
        boolean valid
) {
}

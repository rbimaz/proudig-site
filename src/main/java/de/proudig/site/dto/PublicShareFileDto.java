package de.proudig.site.dto;

/** Eine Datei innerhalb eines freigegebenen Ordners (öffentliche Liste). */
public record PublicShareFileDto(
        String documentId,
        String fileName,
        String relativePath,
        Long fileSize
) {
}

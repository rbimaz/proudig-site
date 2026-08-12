package de.proudig.site.dto;

/** Eine Ordner-Freigabe: Ziel ist ein Nutzer ODER eine Gruppe. */
public record FolderShareDto(String id, String permission, String targetType, String targetId, String targetName) {
}

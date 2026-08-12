package de.proudig.site.domain;

/**
 * Berechtigungsstufe einer internen Ordner-Freigabe.
 * READ = browsen + download. WRITE = zusätzlich hochladen/aktualisieren/anlegen
 * (Löschen/Umbenennen/Verschieben nur für selbst erstellte Elemente).
 */
public enum SharePermission {
    READ,
    WRITE
}

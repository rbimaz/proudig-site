# Mediathek-UI mit vollständigen CRUD-Operationen

## Warum
Die Admin-Mediathek ist unbrauchbar bedienbar:
- Es existieren **keine `.media-*`-CSS-Regeln** → Vorschaubilder werden in Naturgröße dargestellt,
  das Layout bricht, und die Aktions-Buttons (URL, Löschen) sind praktisch nicht sichtbar.
- **Update fehlt komplett**: Das Backend bietet nur Upload (Create), Liste (Read) und Löschen
  (Delete) — es gibt keinen Endpunkt, um eine Datei umzubenennen.

## Was
- Mediathek-Grid gestalten: gleichmäßiges Raster, auf feste Größe beschnittene Vorschaubilder,
  Datei-Icon für Nicht-Bilder, pro Eintrag klar sichtbare Aktionen (Umbenennen, URL, Löschen).
- Upload-Bereich und Kopfzeile gestalten.
- **Update** ergänzen: Endpunkt `PUT /api/admin/media/{id}` zum Umbenennen; im Frontend eine
  „Umbenennen"-Aktion pro Eintrag.

Damit sind alle CRUD-Operationen in der Mediathek möglich und sichtbar bedienbar.

## Nicht-Ziele
- Keine Ordner/Kategorien, keine Bildbearbeitung, keine echte Thumbnail-Generierung.
- Die physische Datei wird nicht umbenannt (nur der Anzeigename/Titel in der Datenbank).

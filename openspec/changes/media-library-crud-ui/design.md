# Design — Mediathek-CRUD-UI

## Update-Endpunkt (Rename)
- `MediaUpdateRequest` (Record) mit Feld `name`.
- `MediaService.updateMedia(String id, String name, User user)`: lädt die `Media`, setzt `name`
  und `title` auf den neuen Wert, speichert, protokolliert (`activityLogService`), gibt `MediaDto` zurück.
- `MediaController`: `PUT /api/admin/media/{id}` (`@PreAuthorize` wie die übrigen Admin-Endpunkte)
  → `mediaService.updateMedia(id, request.name(), user)`.

Die physische Datei/`storagePath` bleibt unverändert.

## Frontend
- `MediaLibrary`: pro Eintrag eine Aktion **„Umbenennen"** — `window.prompt('Neuer Name', item.name)`,
  dann `PUT /api/admin/media/{id}` mit `{ name }`; bei Erfolg den Eintrag in der Liste aktualisieren.
  Bestehende Aktionen „URL" und „Löschen" bleiben.

## Styles (`admin.css`, neuer `.media-*`-Block)
- `.media-grid`: `repeat(auto-fill, minmax(200px, 1fr))`, Gap.
- `.media-item`: Karte mit Rahmen/Radius, Spaltenlayout.
- `.media-preview`: feste Höhe (~150px), `overflow:hidden`; `img { width:100%; height:100%; object-fit:cover }`;
  `.file-icon` zentriert für Nicht-Bilder.
- `.media-info`: Dateiname (einzeilig, Ellipsis) + `.media-actions` (Buttons in einer Reihe, immer sichtbar).
- `.btn-sm.danger` rot; Upload-Bereich (`.upload-area`, `.drag-active`, `.upload-button`) und
  `.library-header` gestalten. Akzentfarbe Brand-Orange `#E8731A`.

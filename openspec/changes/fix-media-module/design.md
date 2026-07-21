# Design — Mediathek

## Upload
`MediaLibrary.handleUpload`: `POST /api/admin/media/upload` → `POST /api/admin/media`
(entspricht `MediaController.uploadMedia`, `@RequestParam("file")`). Antwort ist `MediaDto`.

## MediaDto-Felder (Quelle der Wahrheit)
`id`, `name`, `title`, `contentType`, `fileSize`, `createdAt`. Es gibt **kein** `url`-Feld —
Bilder werden über `/api/media/{id}` ausgeliefert (Thumbnail: `/api/media/{id}/thumbnail`).

Grid-Anpassungen in `MediaLibrary`:
- Bild-Erkennung: `item.contentType?.startsWith('image/')`
- Vorschau-`src`: `/api/media/${item.id}`
- Dateiname: `item.name`; Datei-Icon: `item.name?.split('.').pop()` (mit Guard)
- „URL kopieren": kopiert `/api/media/${item.id}`

## Bild-Picker (`PageEditor`)
Neue Komponente `MediaPicker` (Modal):
- Zeigt bei gesetztem Wert eine Vorschau (`/api/media/{id}`) + „Ändern"/„Entfernen".
- Ohne Wert: Button „Aus Mediathek wählen" → lädt `/api/admin/media`, zeigt Bild-Kacheln;
  Klick setzt `coverImageId`.
- Ersetzt das manuelle Textfeld „Titelbild-ID" im `PageEditor`.
- CSS `.media-picker*` in `admin.css`.

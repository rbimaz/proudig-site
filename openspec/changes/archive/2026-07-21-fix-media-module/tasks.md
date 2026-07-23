## 1. Upload & Liste reparieren

- [x] 1.1 `MediaLibrary.handleUpload`: Endpunkt `/api/admin/media/upload` → `/api/admin/media`
- [x] 1.2 Grid auf reale `MediaDto`-Felder umstellen: Bild `/api/media/{id}`, Name `item.name`, Typ `item.contentType`; Datei-Icon mit Guard; „URL kopieren" kopiert `/api/media/{id}`

## 2. Bild-Picker im Editor

- [x] 2.1 Komponente `MediaPicker` (Modal): lädt `/api/admin/media`, zeigt Bild-Kacheln, Klick setzt ID; Vorschau + „Ändern"/„Entfernen"
- [x] 2.2 `PageEditor`: Textfeld „Titelbild-ID" durch `MediaPicker` ersetzen
- [x] 2.3 CSS `.media-picker*` in `admin.css`

## 3. Verifikation

- [x] 3.1 Frontend Lint/Build grün
- [x] 3.2 `openspec validate fix-media-module --strict` grün

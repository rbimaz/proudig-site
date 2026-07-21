## 1. Backend — Update/Rename

- [x] 1.1 `MediaUpdateRequest` (Record mit `name`)
- [x] 1.2 `MediaService.updateMedia(id, name, user)` (setzt `name`/`title`, speichert, loggt)
- [x] 1.3 `MediaController`: `PUT /api/admin/media/{id}` → `updateMedia`

## 2. Frontend — Umbenennen

- [x] 2.1 `MediaLibrary`: „Umbenennen"-Aktion (Prompt) → `PUT /api/admin/media/{id}`, Liste aktualisieren

## 3. Styles

- [x] 3.1 `.media-*`-Block in `admin.css`: Grid, beschnittene Vorschauen, sichtbare Aktionen, Upload-Bereich, Kopfzeile

## 4. Verifikation

- [x] 4.1 Backend kompiliert, Frontend Lint/Build grün
- [x] 4.2 `openspec validate media-library-crud-ui --strict` grün
- [ ] 4.3 Visuelle Kontrolle der Mediathek (nach Backend-Neustart; Admin-Login nötig)

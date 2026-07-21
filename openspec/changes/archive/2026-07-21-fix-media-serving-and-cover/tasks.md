## 1. Titelbild optional

- [x] 1.1 `PageService.createPage`: Guard `coverImageId != null && !coverImageId.isBlank()`
- [x] 1.2 `PageService.updatePage`: gleicher Guard
- [x] 1.3 `PageEditor.toPayload`: `coverImageId: data.coverImageId || null`

## 2. Media-Auslieferung reparieren

- [x] 2.1 `MediaController`: `FileStorageService` injizieren
- [x] 2.2 `serveMedia` über `fileStorageService.load(storagePath, "media")` ausliefern
- [x] 2.3 `serveThumbnail` analog

## 3. Verifikation

- [x] 3.1 Backend kompiliert (`./mvnw -q compile` bzw. Test), Frontend Lint/Build grün
- [x] 3.2 `openspec validate fix-media-serving-and-cover --strict` grün
- [x] 3.3 Nach Backend-Neustart: `/api/media/{id}` liefert 200; Anlegen ohne Titelbild funktioniert (manuell) — per Merge abgenommen

## 1. Leerer Screen beim Anlegen/Bearbeiten

- [x] 1.1 `BlogList`: Navigation `/admin/blog/new` → `/admin/cms/blog/new`, Edit → `/admin/cms/blog/${id}`
- [x] 1.2 `SeminarList`: Navigation `/admin/seminare/new` → `/admin/cms/seminare/new`, Edit → `/admin/cms/seminare/${id}`
- [x] 1.3 `PageEditor`: Weiterleitung nach Speichern/Veröffentlichen → `/admin/cms/<segment>/<id>` (Segment `seminare` für `SEMINAR`)
- [x] 1.4 `PageEditor`: `tags` als Array (`List<String>`) senden statt leerem String (behebt „Cannot coerce empty String to element of ArrayList"); beim Laden Array → kommagetrennter String fürs Eingabefeld

## 2. Mediathek in Inhalte einfügen

- [x] 2.1 `MediaPicker`: optionalen Einfüge-Modus (`onInsert`, `buttonLabel`) ergänzen
- [x] 2.2 `PageEditor`: „Bild aus Mediathek einfügen" über dem Inhalt → `![name](/api/media/{id})` anhängen
- [x] 2.3 `StaticPageEditor`: Media-Einfüge-Button → `<img src="/api/media/{id}">` via `insertSnippet`

## 3. Verifikation

- [x] 3.1 Frontend Lint/Build grün
- [x] 3.2 `openspec validate fix-admin-editors --strict` grün

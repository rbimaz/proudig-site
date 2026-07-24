# Design — News/Blog Publish/Archive über die UI

## Backend (unverändert)
Vorhandene, ausreichende Endpunkte:
- `PUT /api/admin/pages/{id}/publish` → Status `PUBLISHED`
- `PUT /api/admin/pages/{id}/archive` → Status `ARCHIVED`

Statuslebenszyklus für die UI-Logik: `DRAFT` → `PUBLISHED` → `ARCHIVED` (und `ARCHIVED`/`DRAFT`
wieder → `PUBLISHED`).

## `NewsList`
- Bereits vorhanden: `handlePublish` + „Veröffentlichen" (Bedingung `status !== 'PUBLISHED'`).
- Ergänzen: `handleArchive(id)` → `PUT …/archive`, danach `fetchPosts()`.
- Button **Archivieren** rendern, wenn `status === 'PUBLISHED'`.
- „Veröffentlichen" bleibt sichtbar bei `status !== 'PUBLISHED'` (deckt Entwurf **und** Archiviert
  ab → Re-Publish).

## `BlogList`
- Status-Handling an `NewsList` angleichen: `STATUS_LABELS`/`statusLabel`/`statusClass`,
  Vergleiche in Großschreibung (`PUBLISHED`).
- Status-Badge korrekt anzeigen (nicht mehr immer „Entwurf").
- `handlePublish` (vorhanden) + neues `handleArchive` analog NewsList; Buttons nach denselben
  Bedingungen wie oben.

## UX
- Buttons in der Aktionsspalte: Bearbeiten · Veröffentlichen/Archivieren (statusabhängig) · Löschen.
- Icons konsistent (`bi-check-circle` Veröffentlichen, `bi-archive` Archivieren).
- Kein Bestätigungsdialog (reversibler Statuswechsel); optionales kurzes Deaktivieren während des
  Requests (analog `deleting`) ist möglich, aber nicht zwingend.

# News/Blog über die UI veröffentlichen und archivieren

## Warum
Im Admin-CMS lassen sich News- und Blog-Beiträge zwar veröffentlichen, aber **nicht über die UI
archivieren** — obwohl das Backend den Endpunkt bereits bietet (`PUT /api/admin/pages/{id}/archive`).
Redaktionen brauchen einen einfachen Weg, Beiträge wieder offline zu nehmen (Archivieren) und
Archivierte/Entwürfe (wieder) zu veröffentlichen — direkt aus der Liste.

Zusätzlich ist die Status-Behandlung in `BlogList` fehlerhaft: sie vergleicht kleingeschrieben
(`'published'`), das Backend liefert aber `PUBLISHED`. Dadurch zeigt das Status-Badge immer
„Entwurf" und der „Veröffentlichen"-Button erscheint auch bei bereits veröffentlichten Beiträgen.

## Was
- In `NewsList` und `BlogList` je Eintrag Aktionen für den Statuswechsel:
  - **Veröffentlichen** (`PUT …/publish`) — sichtbar, wenn nicht `PUBLISHED` (Entwurf oder Archiviert).
  - **Archivieren** (`PUT …/archive`) — sichtbar, wenn `PUBLISHED`.
- Nach der Aktion die Liste aktualisieren; Status-Badge korrekt anzeigen.
- `BlogList` auf die korrekte (Großschreibung-)Statuslogik bringen — analog `NewsList`
  (`STATUS_LABELS`, `PUBLISHED`/`ARCHIVED`/`DRAFT`).

## Nicht-Ziele
- Keine Backend-Änderung (Publish/Archive-Endpunkte existieren bereits).
- Kein Bestätigungsdialog für Publish/Archive (reversible Statuswechsel); Löschen bleibt separat.
- Seminare/Statische Seiten sind nicht Teil dieser Change (gleiches Muster später anwendbar).

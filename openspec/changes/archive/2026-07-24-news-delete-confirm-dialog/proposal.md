# News löschen mit Bestätigungsdialog (statt Browser-Alert)

## Warum
Das Löschen einer News in der Admin-Verwaltung (`/admin/cms/news`) ist möglich, nutzt aber
das native `confirm('Wirklich löschen?')` — einen Browser-Alert. Gewünscht ist ein
gestylter In-App-**Bestätigungsdialog**.

Die passende Komponente existiert bereits: `ConfirmDialog` (Modal mit Fokus-Falle, ESC-Handling,
Backdrop-Klick, Danger-Variante; Styles in `portal.css`, global geladen) — sie ist aktuell nur
nirgends eingebunden.

Beim Test zeigte sich zudem: `PageService.deletePage` erlaubt nur `DRAFT`-Seiten
(`Only draft pages can be deleted`) — **veröffentlichte** News lassen sich gar nicht löschen.

## Was
- In `NewsList` das native `confirm()` durch die `ConfirmDialog`-Komponente ersetzen.
- Backend: den `DRAFT`-only-Guard in `deletePage` entfernen, sodass News/Seiten unabhängig vom
  Status löschbar sind (die Bestätigung erfolgt im UI-Dialog).
- Löschen bleibt sonst funktional identisch (`DELETE /api/admin/pages/{id}`).

## Nicht-Ziele
- Keine Änderung am Lösch-Endpunkt/Berechtigungen (nur der Status-Guard entfällt).
- Andere Listen (Blog/Seminar/Static/Media) nutzen dasselbe native `confirm()`; deren Umstellung
  auf den Dialog ist nicht Teil dieser Change (separat angleichbar). Der Backend-Guard-Wegfall gilt
  generisch (`deletePage`), betrifft also alle Kategorien.

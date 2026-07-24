# Design — „Jetzt ausführen"-Button

## Backend (unverändert)
`POST /api/admin/pages/run-lifecycle` → `{ "transitions": <int> }` (führt `runNewsLifecycle` aus:
PUBLISHED→ARCHIVED nach Frist A, ARCHIVED→HIDDEN nach Aufbewahrung).

## `Settings.jsx`
- Neuer State `running` (Button-Deaktivierung während des Requests).
- Handler `runLifecycleNow`:
  - `POST /api/admin/pages/run-lifecycle` (via `authFetch`).
  - Erfolg: `{transitions}` auslesen → `setMessage('Lebenszyklus ausgeführt: N Übergänge')`.
  - Fehler: Fehlermeldung wie bei `handleSave`.
  - Message nach ~4 s ausblenden (wie vorhanden).
- Button **„Jetzt ausführen"** (Icon `bi-play-fill`/`bi-arrow-repeat`, `btn-secondary`) neben
  „Speichern" in `.form-actions`.
- Hinweistext ergänzen, dass der Lebenszyklus sonst gemäß Cron läuft.

Kein neuer CSS nötig (vorhandene Button-/Message-Styles).

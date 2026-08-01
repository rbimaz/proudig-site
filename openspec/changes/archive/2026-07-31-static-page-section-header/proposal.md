## Why

Redaktionell gepflegte STATIC-Seiten rendern im Kopfbereich nur Titel und
(optional) Untertitel, aber keinen Eyebrow — die kleine, orange Label-Zeile über
dem Titel, die das übrige Seiten-Muster (z. B. „LEISTUNGEN / Unsere Leistungen /
Wissen vermitteln …") prägt. Zusätzlich bot der Seiten-Editor bislang kein Feld
für den Untertitel, sodass das dreiteilige Section-Header-Muster für CMS-Seiten
nicht reproduzierbar war und beim Umzug einer Seite ins CMS verloren ging.

## What Changes

- Der öffentliche STATIC-Renderer gibt im Kopfbereich einen optionalen **Eyebrow**
  (`section-tag`) über dem Titel aus, wenn das Feld gesetzt ist. Titel
  (`section-title`) und Untertitel (`section-subtitle`) bleiben wie bisher.
- Der Seiten-Editor (`/admin/cms/seiten`) erhält zwei zusätzliche Felder:
  **Eyebrow** und **Untertitel**. Beide sind optional und werden beim Speichern
  und Veröffentlichen mitgesendet sowie beim Laden vorbefüllt.
- **Feld-Zuordnung ohne neue Datenstruktur:** Untertitel nutzt das bestehende
  `excerpt`-Feld; der Eyebrow nutzt das für STATIC bislang ungenutzte
  `metaData`-Feld. Kein Backend-/DB-Change.

## Capabilities

### New Capabilities
- `static-pages`: Öffentliche Auslieferung und Admin-Pflege redaktioneller
  STATIC-Seiten als Markdown, inkl. dreiteiligem Section-Header (Eyebrow, Titel,
  Untertitel).

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. static-pages war
     bisher nicht als Spec erfasst und wird hier als neue Baseline eingeführt. -->

## Impact

- Frontend: `StaticPageRenderer.jsx` (Eyebrow-Ausgabe) und
  `StaticPageEditor.jsx` (zwei neue Felder, Save/Publish/Load).
- Keine Backend-/DB-Änderung: `excerpt` und `metaData` sind bereits in
  `PageCreateRequest`/`PageUpdateRequest`, Entity und `PageDto` verdrahtet und
  werden von `/api/pages/{slug}` ausgeliefert.
- Feld-Umnutzung: `metaData` wird serverseitig nur für SEMINAR-Auto-Archiv
  gelesen und ist für STATIC frei — kein funktionaler Konflikt.

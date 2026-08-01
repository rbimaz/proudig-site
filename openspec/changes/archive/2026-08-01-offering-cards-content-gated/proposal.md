## Why

Die „Unsere Leistungen"-Karten verlinken aktuell **immer** auf ihre Übersicht.
Ist zu einer Leistung noch kein Inhalt gepflegt, landet der Nutzer auf einer
leeren Seite („Noch keine Beiträge zu ‚Vorträge'"). Das wirkt unfertig. Karten
ohne Inhalt sollen stattdessen **nicht reagieren** (nicht navigieren).

## What Changes

- Die Leistungs-Karten werden **inhaltsabhängig** klickbar:
  - Eine Offering-Karte ist klickbar, wenn es veröffentlichte Offerings mit ihrem
    Tag gibt (`GET /api/offerings/tags` enthält den Tag).
  - Die Karte **Weiterbildung** ist klickbar, wenn veröffentlichte Seminare
    existieren.
- Karten **ohne** Inhalt werden als **nicht-interaktives** Element gerendert
  (kein Link, keine Navigation, kein Klick-Cursor/Hover-Effekt). Die Karte bleibt
  sichtbar (Leistungs-Info), nur der Link reagiert nicht.
- Die Empty-State-Ansicht der Offering-Übersicht bleibt als **Fallback** für den
  direkten URL-Aufruf erhalten.

## Capabilities

### New Capabilities
<!-- Keine neue Capability. -->

### Modified Capabilities
- `offerings`: Die klickbaren Leistungs-Karten werden inhaltsabhängig — nur
  Karten mit vorhandenem Inhalt navigieren; leere Karten reagieren nicht.

## Impact

- Frontend: `Expertise.jsx` (Inhalts-Check + bedingtes Rendern Link vs.
  nicht-interaktiv), kleine CSS-Anpassung für den „inaktiv"-Zustand.
- Backend: **Bugfix** an `PageRepository.findDistinctTagsByCategoryAndStatus`.
  Bei der Umsetzung stellte sich heraus, dass `GET /api/offerings/tags` (und
  ebenso `/api/blog/tags`, `/api/news/tags`) mit **HTTP 500** fehlschlug — die
  Derived-Query lieferte `Page`-Entitäten statt der `tags`-Spalte. Behoben per
  expliziter `@Query`. Das reparierte den benötigten Endpunkt und **zugleich**
  die Blog-/News-Tag-Endpunkte.
- `GET /api/seminare` existiert bereits (unverändert).
- Baut auf `add-offering-content-type` auf.

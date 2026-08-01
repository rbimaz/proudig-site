## Context

STATIC-Seiten werden seit dem Change `static-pages-markdown` als Markdown gepflegt
und über `StaticPageRenderer` mit eigenem Seitenrahmen (`section` → `container` →
`section-header`) gerendert. Der Renderer gab bisher nur `title` und `excerpt` aus;
der Seiten-Editor bot nur Titel, Slug und Markdown-Inhalt. Das dreiteilige
Section-Header-Muster der übrigen Seiten (Eyebrow/Titel/Untertitel, CSS-Klassen
`section-tag`/`section-title`/`section-subtitle`) ließ sich damit nicht abbilden.

## Goals / Non-Goals

**Goals:**
- STATIC-Seiten können den vollständigen dreiteiligen Section-Header rendern.
- Redaktion pflegt Eyebrow und Untertitel im Seiten-Editor.
- Umsetzung ohne Backend-/DB-Änderung.

**Non-Goals:**
- Kein neues, sauber benanntes `eyebrow`-Feld/Spalte (bewusst aufgeschoben).
- Keine Änderung an anderen Content-Typen (News/Blog/Seminar/Offering).
- Keine Änderung am Eyebrow anderer Seiten (die bleiben hartkodiert).

## Decisions

- **Eyebrow über `metaData` statt neuer Spalte.** `metaData` ist ein bereits
  vorhandenes, frei durch Entity/DTO/Requests verdrahtetes Page-Feld und wird im
  Frontend nirgends genutzt; serverseitig nur für SEMINAR-Auto-Archiv gelesen. Für
  STATIC ist es frei. Damit entfällt eine Liquibase-Migration.
  - Alternative: dedizierte `eyebrow`-Spalte + DTO/Request-Erweiterung. Sauberer
    benannt, aber Backend-/DB-Change für ein rein kosmetisches Feld —
    Over-Engineering für den aktuellen Bedarf.
- **Untertitel über `excerpt`.** Der Renderer gab `excerpt` bereits als
  `section-subtitle` aus; es fehlte nur das Editor-Feld. Semantisch identisch zu
  News/Offering, daher keine Umnutzung nötig.
- **Beide Felder optional.** Leere Werte rendern keinen `section-tag`/
  `section-subtitle`; bestehende Seiten (Impressum) bleiben unverändert.

## Risks / Trade-offs

- Semantische Überladung von `metaData` (Name generisch, für SEMINAR anders
  belegt) → per Kategorie getrennt (STATIC liest/schreibt nur den Eyebrow), im
  Code und in dieser Spec dokumentiert; spätere Umstellung auf ein `eyebrow`-Feld
  bleibt als separater Change möglich.
- Kein Sanitizing nötig: Eyebrow/Untertitel werden als Text (kein Markdown/HTML)
  gerendert.

## Migration Plan

- Rein additive Frontend-Änderung, keine Datenmigration. Bestehende STATIC-Seiten
  ohne `metaData`/`excerpt` verhalten sich unverändert. Rollback = Frontend
  zurücksetzen; persistierte `metaData`/`excerpt`-Werte bleiben harmlos.

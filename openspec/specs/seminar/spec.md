# seminar Specification

## Purpose
TBD - created by archiving change fix-seminar-module. Update Purpose after archive.
## Requirements
### Requirement: Öffentliche Seminar-Darstellung über dedizierte Endpunkte
Das System SHALL veröffentlichte Seminare öffentlich anzeigen: eine Listenseite unter
`/seminare` und eine Detailseite unter `/seminare/:slug`. Die Seiten SHALL die dedizierten
Seminar-Endpunkte (`/api/seminare`, `/api/seminare/{slug}`) verwenden — nicht `/api/pages`.
Seminare SHALL als Inhaltsseiten dargestellt werden (Titel, Auszug, Tags als Array,
Veröffentlichungsdatum, Markdown-Inhalt); nicht modellierte strukturierte Felder SHALL nicht
verwendet werden.

#### Scenario: Seminar-Liste anzeigen
- **WHEN** ein Besucher `/seminare` öffnet
- **THEN** werden die veröffentlichten Seminare über `/api/seminare` geladen und angezeigt

#### Scenario: Seminar-Detail anzeigen
- **WHEN** ein Besucher `/seminare/:slug` öffnet
- **THEN** wird das Seminar über `/api/seminare/{slug}` geladen und als Inhaltsseite angezeigt

### Requirement: Designkonsistente Seminar-Seiten
Die Seminar-Seiten SHALL dem Design-System folgen: `--c-*`-Tokens, Brand-Orange `#E8731A`
(kein Blau), Inhalt im Standard-`.container`, navbarfreier Kopf. Der Detail-Kopf SHALL oben das
Bereichs-Label „SEMINARE" (Link auf `/seminare`) allein zeigen, gefolgt vom Titel genau einmal.

#### Scenario: Seminar-Seiten sind designkonsistent
- **WHEN** die Seminar-Listen- oder Detailseite dargestellt wird
- **THEN** nutzt sie Tokens und Brand-Orange (kein Blau), die `.container`-Breite und einen navbarfreien Kopf; der Titel erscheint genau einmal

### Requirement: Seminare öffentlich erreichbar mit Beispieldaten
Die Navigationsleiste SHALL einen Link „Seminare" auf `/seminare` enthalten. Das System SHALL
Beispiel-Seminare als Seed-Daten (Entwicklung) bereitstellen.

#### Scenario: Navigation zu Seminaren
- **WHEN** der Besucher in der Navigationsleiste „Seminare" wählt
- **THEN** gelangt er zur Seminar-Listenseite `/seminare`

#### Scenario: Beispiel-Seminare vorhanden
- **WHEN** die Anwendung mit Entwicklungs-Seed startet
- **THEN** sind veröffentlichte Beispiel-Seminare vorhanden


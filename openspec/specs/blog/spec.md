# blog Specification

## Purpose
TBD - created by archiving change fix-blog-module. Update Purpose after archive.
## Requirements
### Requirement: Öffentliche Blog-Darstellung über dedizierte Endpunkte
Das System SHALL veröffentlichte Blog-Beiträge öffentlich anzeigen: eine Listenseite unter
`/blog` und eine Detailseite unter `/blog/:slug`. Die Seiten SHALL die dedizierten
Blog-Endpunkte (`/api/blog`, `/api/blog/{slug}`) verwenden — nicht die generischen
`/api/pages`-Routen. Tags SHALL als Liste (Array) gerendert werden.

#### Scenario: Blog-Liste anzeigen
- **WHEN** ein Besucher `/blog` öffnet
- **THEN** werden die veröffentlichten Blog-Beiträge (neueste zuerst) über `/api/blog` geladen und angezeigt

#### Scenario: Blog-Detail anzeigen
- **WHEN** ein Besucher `/blog/:slug` öffnet
- **THEN** wird der Beitrag über `/api/blog/{slug}` geladen und angezeigt, mit korrekt gerenderten Tags

### Requirement: Designkonsistente Blog-Seiten
Die Blog-Seiten SHALL dem Design-System folgen: `--c-*`-Farbtokens, Brand-Orange `#E8731A`
für Links/Akzente (kein Blau), Inhalt im Standard-`.container` (`max-width: 1200px`,
`padding: 0 32px`), ausreichend Kopf-Abstand zur fixierten Navbar. Der Detail-Kopf SHALL oben
das Bereichs-Label „BLOG" (Link auf `/blog`) allein zeigen, gefolgt vom Titel genau einmal
(kein duplizierter Titel im Breadcrumb).

#### Scenario: Blog-Seiten sind designkonsistent
- **WHEN** die Blog-Listen- oder Detailseite dargestellt wird
- **THEN** nutzt sie `--c-*`-Tokens und Brand-Orange (kein Blau), die `.container`-Breite und einen navbarfreien Kopf; der Titel erscheint genau einmal

### Requirement: Blog öffentlich erreichbar mit Beispieldaten
Die Navigationsleiste SHALL einen Link „Blog" auf `/blog` enthalten. Das System SHALL
Beispiel-Blog-Beiträge als Seed-Daten (Entwicklung) bereitstellen.

#### Scenario: Navigation zum Blog
- **WHEN** der Besucher in der Navigationsleiste „Blog" wählt
- **THEN** gelangt er zur Blog-Listenseite `/blog`

#### Scenario: Beispiel-Beiträge vorhanden
- **WHEN** die Anwendung mit Entwicklungs-Seed startet
- **THEN** sind veröffentlichte Blog-Beispielbeiträge vorhanden


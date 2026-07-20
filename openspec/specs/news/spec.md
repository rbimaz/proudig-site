# news Specification

## Purpose
TBD - created by archiving change add-news-module. Update Purpose after archive.
## Requirements
### Requirement: News über das CMS pflegen
Das System SHALL News-Beiträge als CMS-Inhalte der Kategorie `NEWS` verwalten.
Administratoren/Redakteure SHALL News über die bestehende Seitenverwaltung
anlegen, bearbeiten, veröffentlichen, archivieren und löschen können (analog
Blog/Seminare), inkl. Titel, Slug, Inhalt, Auszug, Titelbild, Tags und Status.

#### Scenario: News-Beitrag anlegen und veröffentlichen
- **WHEN** ein Redakteur im CMS unter „News" einen Beitrag erstellt und veröffentlicht
- **THEN** wird der Beitrag mit Kategorie `NEWS` und Status `PUBLISHED` gespeichert

#### Scenario: News im Admin auflisten
- **WHEN** die News-Verwaltung geöffnet wird
- **THEN** werden alle News-Beiträge (`category=NEWS`) aufgelistet

### Requirement: Öffentliche News-Darstellung
Das System SHALL veröffentlichte News öffentlich anzeigen: eine Listenseite unter
`/news` und eine Detailseite unter `/news/:slug`. Die Daten SHALL über einen
öffentlichen News-Endpunkt (`/api/news`, `/api/news/{slug}`) bereitgestellt
werden; nur veröffentlichte Beiträge SHALL in der Liste erscheinen. Die News-Seiten
SHALL eigene, designkonsistente Styles verwenden (nicht die Alt-Blog-Styles):
`--c-*`-Farbtokens, Brand-Orange `#E8731A` für Links/Akzente (kein Blau) und
ausreichend Kopf-Abstand, sodass der Titel nicht von der fixierten Navigationsleiste
verdeckt wird.

#### Scenario: News-Liste anzeigen
- **WHEN** ein Besucher `/news` öffnet
- **THEN** werden die veröffentlichten News-Beiträge (neueste zuerst) angezeigt

#### Scenario: News-Detail anzeigen
- **WHEN** ein Besucher `/news/:slug` öffnet
- **THEN** wird der zugehörige veröffentlichte News-Beitrag angezeigt
- **AND** der Kopf zeigt oben das Bereichs-Label „NEWS" (Link auf `/news`) allein, gefolgt vom Titel genau einmal als Überschrift (kein duplizierter Titel im Breadcrumb)

#### Scenario: News-Seiten sind designkonsistent
- **WHEN** die News-Listen- oder Detailseite dargestellt wird
- **THEN** nutzen sie eigene `.news-*`-Styles mit `--c-*`-Tokens und Brand-Orange (kein Blau) und der Titel wird nicht von der fixierten Navbar verdeckt

#### Scenario: News-Seiten normieren die Breite wie die übrigen Seiten
- **WHEN** die News-Listen- oder Detailseite dargestellt wird
- **THEN** ist der Inhalt in den Standard-`.container` (`max-width: 1200px`, `padding: 0 32px`) gefasst — konsistent zu den anderen Seiten

### Requirement: News-Sektion auf der Startseite
Die Startseite SHALL eine News-Sektion mit den neuesten veröffentlichten
News-Beiträgen zeigen und auf die News-Listenseite verlinken. Die Navigationsleiste
SHALL einen Link „News" enthalten. Die News-Sektion SHALL dem Sektions-Muster der
übrigen Startseiten-Sektionen folgen: `position: relative`, horizontale Polsterung
`1.5rem` an der Sektion und Hintergrund über das Design-Token `var(--c-bg)`; Text-
und Rahmenfarben über die `--c-*`-Tokens. Der Akzent SHALL das Brand-Orange
`#E8731A` verwenden.

#### Scenario: Neueste News auf der Startseite
- **WHEN** die Startseite geladen wird
- **THEN** erscheint eine News-Sektion mit den neuesten veröffentlichten Beiträgen

#### Scenario: Navigation zu News
- **WHEN** der Besucher in der Navigationsleiste „News" wählt
- **THEN** gelangt er zur News-Listenseite `/news`

#### Scenario: News-Sektion folgt dem Design-System
- **WHEN** die News-Sektion dargestellt wird
- **THEN** nutzt sie `position: relative`, `padding: … 1.5rem`, `background: var(--c-bg)` und `--c-*`-Farbtokens (Akzent Brand-Orange `#E8731A`) — konsistent mit den übrigen Sektionen


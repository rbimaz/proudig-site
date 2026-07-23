# landing Specification

## Purpose
TBD - created by archiving change landing-hero-newsbox. Update Purpose after archive.
## Requirements
### Requirement: Konfigurierbare Landing (neue Kugel/News ⇄ alte Prozess-Bild)
Das System SHALL die Landing-Variante über Konfiguration steuern. Bei aktivierter neuer Landing
SHALL der Hero die Kugel bzw. die Hero-News-Box zeigen; bei deaktivierter (`false`) SHALL die alte
Landing mit Prozess-Bild (`HeroVisualCarousel`) angezeigt werden. Das Flag SHALL über das
ContentBlock-System (`HERO`) im Admin schaltbar sein und ohne Redeploy wirken.

#### Scenario: Neue Landing aktiv
- **WHEN** das Konfig-Flag nicht auf `false` steht
- **THEN** zeigt der Hero die neue Variante (Kugel oder Hero-News-Box), ohne die Homepage-News-Sektion

#### Scenario: Alte Landing (Flag false)
- **WHEN** das Konfig-Flag auf `false` steht
- **THEN** zeigt der Hero das Prozess-Bild (`HeroVisualCarousel`) und die Homepage-News-Sektion erscheint

### Requirement: Hero-News-Box statt Kugel bei relevanten News
Das System SHALL im Hero-Slot rechts eine News-Box anzeigen, wenn veröffentlichte News mit
gesetztem Hero-Flag (`showInHero`) existieren; andernfalls die Kugel. Die relevanten News SHALL
über `GET /api/news/hero` (neueste zuerst) bereitgestellt werden. News SHALL im CMS als
„im Hero anzeigen" markierbar sein.

#### Scenario: Keine relevanten News
- **WHEN** keine veröffentlichte News mit `showInHero` existiert
- **THEN** zeigt der Hero die Kugel

#### Scenario: Eine relevante News
- **WHEN** genau eine relevante News existiert
- **THEN** zeigt die Box den Aufmacher (Kategorie, Datum, Titel, Kurztext, „Mehr erfahren")

#### Scenario: Mehrere relevante News
- **WHEN** mehrere relevante News existieren
- **THEN** zeigt die Box den neuesten Aufmacher plus eine kompakte Liste weiterer und einen Zähler

#### Scenario: News im CMS für den Hero markieren
- **WHEN** ein Redakteur eine News als „im Hero anzeigen" markiert und veröffentlicht
- **THEN** wird `showInHero=true` gespeichert und die News über `/api/news/hero` geliefert


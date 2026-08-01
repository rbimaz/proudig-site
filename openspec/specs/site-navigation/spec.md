# site-navigation Specification

## Purpose
TBD - created by archiving change ueber-proudig-nav-link. Update Purpose after archive.
## Requirements
### Requirement: „Über Proudig" verlinkt auf die CMS-Seite

Der Navigations-Eintrag „Über Proudig" SHALL sowohl im Desktop- als auch im
Mobil-Menü der Navbar auf die Seite `/seite/ueber-proudig` navigieren (clientseitig
per Router), statt zum Landing-Anker `#ueber` zu scrollen.

#### Scenario: Klick im Desktop-Menü

- **WHEN** ein Nutzer im Desktop-Navbar auf „Über Proudig" klickt
- **THEN** navigiert die App auf `/seite/ueber-proudig`

#### Scenario: Klick im Mobil-Menü

- **WHEN** ein Nutzer im geöffneten Mobil-Menü auf „Über Proudig" tippt
- **THEN** navigiert die App auf `/seite/ueber-proudig` und das Mobil-Menü schließt

### Requirement: Footer-Navigationslinks

Der Footer SHALL die folgenden Navigationslinks enthalten: **News** (`/news`),
**Blog** (`/blog`), **Datenschutz** (`/datenschutz`) und **Impressum**
(`/impressum`).

#### Scenario: Footer-Links vorhanden

- **WHEN** ein Nutzer den Footer betrachtet
- **THEN** sind Links zu News, Blog, Datenschutz und Impressum sichtbar und führen
  auf die jeweilige Route


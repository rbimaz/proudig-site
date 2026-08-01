## ADDED Requirements

### Requirement: Footer-Navigationslinks

Der Footer SHALL die folgenden Navigationslinks enthalten: **News** (`/news`),
**Blog** (`/blog`), **Datenschutz** (`/datenschutz`) und **Impressum**
(`/impressum`).

#### Scenario: Footer-Links vorhanden

- **WHEN** ein Nutzer den Footer betrachtet
- **THEN** sind Links zu News, Blog, Datenschutz und Impressum sichtbar und führen
  auf die jeweilige Route

## REMOVED Requirements

### Requirement: Footer-Link „Über Proudig"

**Reason**: Die Footer-Navigation wurde auf News, Blog, Datenschutz und Impressum
umgestellt; „Über Proudig" ist im Footer nicht mehr enthalten.

**Migration**: „Über Proudig" bleibt über die Navbar (Desktop und Mobil) auf
`/seite/ueber-proudig` erreichbar.

## Why

Die Footer-Navigation soll die wichtigsten öffentlichen Bereiche direkt erreichbar
machen. Bisher enthielt der Footer „Über Proudig", Impressum und einen toten
Datenschutz-Anker (`#datenschutz`). Gewünscht sind stattdessen direkte Links zu
News und Blog sowie ein funktionierender Datenschutz-Link.

## What Changes

- Footer-Links werden ersetzt durch: **News** (`/news`), **Blog** (`/blog`),
  **Datenschutz** (`/datenschutz`), **Impressum** (`/impressum`).
- Der Footer-Link **„Über Proudig" entfällt** (über die Navbar weiterhin
  erreichbar).
- Der Datenschutz-Link zeigt jetzt auf die reale Route `/datenschutz` statt auf den
  toten Anker `#datenschutz`.

## Capabilities

### New Capabilities
<!-- Keine. -->

### Modified Capabilities
- `site-navigation`: Footer-Linkliste neu definiert; der Footer-Link „Über Proudig"
  wird entfernt.

## Impact

- Frontend: `Footer.jsx` (Linkliste).
- Keine Backend-, API- oder DB-Änderung.
- Beobachtung (kein Ziel dieses Changes): Der Datenschutz-Eintrag nutzt ein
  einfaches `<a href>` (Full-Reload) statt `<Link>`; die übrigen nutzen `<Link>`.

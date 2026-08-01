## Context

`Expertise.jsx` rendert jede Leistungs-Karte als React-Router `<Link to={targetFor(title)}>`.
`targetFor`: Weiterbildung → `/seminare`, übrige fünf → `/offerings/:key` (Keys/Tags
aus `config/offerings.js`). Es gibt keinen Inhalts-Check — leere Ziele führen auf
die Empty-State-Übersicht.

Vorhandene, wiederverwendbare Endpunkte (kein Backend-Change nötig):
- `GET /api/offerings/tags` → distinct **veröffentlichte** OFFERING-Tags.
- `GET /api/seminare` → veröffentlichte Seminare (paginiert).

## Goals / Non-Goals

**Goals:**
- Karten ohne Inhalt reagieren nicht (keine Navigation).
- Karten mit Inhalt verhalten sich wie bisher.

**Non-Goals:**
- Kein Backend-Change.
- Kein Entfernen des Empty-State der Übersicht (bleibt Fallback für Direktaufruf).

## Decisions

**1. Inhalts-Check auf der Landing per vorhandener Endpunkte.**
`Expertise` lädt beim Mount `GET /api/offerings/tags` (Set der Tags mit Inhalt) und
prüft für Weiterbildung, ob Seminare existieren (`GET /api/seminare?size=1` →
`content`/`totalElements` > 0). Ergebnis in State.

**2. Pro Karte `hasContent` bestimmen.**
`hasContent = istOffering ? tagsMitInhalt.has(card.tag) : (Weiterbildung ? seminareVorhanden : false)`.

**3. Bedingtes Rendern: Link vs. nicht-interaktiv.**
- `hasContent` → `<Link to={…} className="expertise-card …">` wie bisher.
- sonst → gleiches Karten-Markup als `<div>` (kein `to`, kein Klick), mit einer
  Modifier-Klasse (z. B. `expertise-card--inactive`) für Cursor `default` und
  ohne Hover-Lift. Optional dezent (kein Dimmen erzwungen).

**4. Ladeverhalten.**
Während die Checks laufen (kurz), Karten neutral rendern. Um „Aufblitzen" eines
falschen Zustands zu vermeiden, bis zum Laden konservativ als **nicht-interaktiv**
behandeln (dann aktivieren, sobald Daten da sind). Bei Fehler der Checks: Karten
nicht-interaktiv (fail-safe, kein Sprung auf leere Seiten).

**5. Backend-Bugfix (bei Umsetzung entdeckt).**
`GET /api/offerings/tags` (und `/api/blog/tags`, `/api/news/tags`) warfen 500:
`findDistinctTagsByCategoryAndStatus` war eine Derived-Query, deren Namensableitung
`Page`-Entitäten statt der `tags`-Spalte lieferte. Fix: explizite
`@Query("SELECT DISTINCT p.tags FROM Page p WHERE p.category = ?1 AND p.status = ?2 AND p.tags IS NOT NULL AND p.tags <> ''")`.
`getAllTags` splittet die komma-getrennten Strings wie bisher. Damit funktioniert
der Inhalts-Check und die geteilten Blog-/News-Tag-Endpunkte sind ebenfalls repariert.

## Risks / Trade-offs

- [Zusätzliche Fetches auf der Landing] → zwei kleine GETs, unkritisch; laufen
  parallel und blockieren das Rendering nicht.
- [Kurzer Zustandwechsel beim Laden] → durch „bis Daten da: inaktiv" vermieden;
  Hover-/Cursor-Wechsel ist minimal.

## Open Questions

- Optische Ausgestaltung des inaktiven Zustands (nur Cursor/kein Hover vs. leicht
  gedämpft) — Default: nur Interaktion entfernen, keine starke visuelle Dämpfung.

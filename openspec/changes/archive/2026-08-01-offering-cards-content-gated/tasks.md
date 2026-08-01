## 1. Inhalts-Check

- [x] 1.1 `Expertise.jsx`: beim Mount `GET /api/offerings/tags` laden (Set der Tags mit Inhalt); für Weiterbildung `GET /api/seminare?size=1` prüfen (Seminare vorhanden?)
- [x] 1.2 Fehler/Ladezustand fail-safe behandeln: bis Daten da bzw. bei Fehler → Karten nicht-interaktiv (kein Sprung auf leere Übersicht)

## 2. Bedingtes Rendern

- [x] 2.1 Pro Karte `hasContent` bestimmen (Offering: Tag in Set; Weiterbildung: Seminare vorhanden)
- [x] 2.2 `hasContent` → `<Link>` wie bisher; sonst nicht-interaktives `<div>` (kein `to`, kein Klick)
- [x] 2.3 CSS-Modifier für inaktive Karte (`cursor: default`, kein Hover-Lift)

## 3. Backend-Bugfix Tag-Endpunkte

- [x] 3.0a `PageRepository.findDistinctTagsByCategoryAndStatus` per expliziter `@Query` reparieren (lieferte 500: `Page` statt `tags`-Spalte) — behebt `/api/offerings/tags`, `/api/blog/tags`, `/api/news/tags`
- [x] 3.0b Backend-Test `getAllTags` (Split/distinct/sortiert) + Live-Prüfung der JPQL gegen echte DB

## 4. Tests & Verifikation

- [x] 3.1 Frontend-Test `Expertise`: Karte mit Inhalt rendert `<a>`-Link mit korrektem `href`; Karte ohne Inhalt rendert **keinen** Link (kein `href`/keine Navigation)
- [x] 3.2 `npm run test:run` grün, `npm run lint` ohne neue Errors, `npm run build` erfolgreich
- [x] 3.3 Live-Verifikation (Screenshot): Karte mit Inhalt navigiert; Karte ohne Inhalt reagiert nicht (keine Navigation, kein Klick-Cursor)

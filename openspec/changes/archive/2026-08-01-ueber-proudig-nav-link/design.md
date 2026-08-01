## Context

„Über Proudig" war bislang eine hartkodierte Landing-Sektion (`About.jsx`, Anker
`#ueber`); der Navbar-Eintrag nutzte die `scrollTo('ueber')`-Mechanik. Mit der neuen
redaktionell pflegbaren STATIC-Seite (`/seite/ueber-proudig`, siehe Change
`static-page-section-header`) soll die Navigation dorthin führen.

## Goals / Non-Goals

**Goals:**
- Navbar (Desktop + Mobil) und Footer verlinken „Über Proudig" auf die CMS-Seite.

**Non-Goals:**
- Kein Entfernen der Landing-Sektion `About.jsx` (bewusst „ergänzen", nicht
  „ersetzen").
- Keine schöne Top-Level-Route `/ueber-proudig` (bleibt bei `/seite/:slug`).
- Kein Anlegen der CMS-Seite selbst (redaktioneller Schritt).

## Decisions

- **Repointing statt Scroll.** Neuer Helfer `goToUeber` navigiert per Router auf
  `/seite/ueber-proudig`; ersetzt `scrollTo('ueber')` in Desktop- und Mobil-Eintrag.
  - Alternative: Anker-Scroll beibehalten und zusätzlich Seite verlinken —
    verworfen, da doppelte Einstiegspunkte verwirren.
- **Footer-Link ergänzt** (bisher nur Impressum/Datenschutz) für einen zweiten,
  persistenten Einstieg.

## Risks / Trade-offs

- Link läuft ins Leere, bis die STATIC-Seite `ueber-proudig` veröffentlicht ist →
  vor/zusammen mit dem Deploy die Seite anlegen und veröffentlichen.
- Landing-Sektion `#ueber` bleibt erreichbar (Scrollen), aber ohne Navigations-
  Einstieg — bewusst akzeptiert.

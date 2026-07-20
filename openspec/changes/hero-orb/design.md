## Context

Der Live-Hero ist `theme='udig2'` → `HeroUdig2` in `Hero.jsx`, zweispaltig (Text
links, `HeroVisualCarousel` rechts). `.hero-udig2` in `App.css` hat bereits
`position: relative` + `overflow: hidden` und einen dunklen Navy-Verlauf. Der
Handoff liefert exakte Orb-Werte; das Asset ist eine Kugel auf dunklem Grund mit
eingebranntem „DIGITAL IMPACT"-Sockel.

## Goals / Non-Goals

**Goals:** Kugel handoff-treu (absolut, überlappend) im Hero; Float-Animation;
saubere Darstellung ohne sichtbaren Sockel/Text; barrierearm.

**Non-Goals:** Umbau anderer Hero-Themes; Änderung von Text/Buttons.

## Decisions

- **Asset lokal statt externer URL:** `public/proudig-orb.jpg` (die Google-aida-URL
  ist temporär). Referenz `/proudig-orb.jpg`.
- **`mix-blend-mode: screen` + radiale Maske:** `screen` blendet den dunklen
  Bild-Hintergrund weg (funktioniert nur auf dunklem Grund — hier gegeben); die
  Maske `radial-gradient(52% 46% at 55% 42%, #000 55%, transparent 82%)`
  zentriert auf die Kugel und schneidet Kanten **und** den unteren
  „DIGITAL IMPACT"-Sockel weg.
- **Absolut/dekorativ statt Spalte:** Kugel als direktes Kind von `.hero-udig2`
  (`z-index: 1`), Text/Container darüber (`z-index: 2`). Das bisherige
  Rechts-Visual entfällt; Layout einspaltig.
- **Float-Animation** exakt aus Handoff; bei `prefers-reduced-motion: reduce`
  deaktiviert.

## Risks / Trade-offs

- [Externe URL temporär] → durch lokales Ablegen entschärft.
- [`mix-blend-mode: screen` nur auf dunklem Grund überzeugend] → Hero ist dunkel;
  akzeptiert.
- [Kugel überlappt Text auf sehr schmalen Viewports] → per Media-Query dezenter
  gesetzt (opacity gesenkt).

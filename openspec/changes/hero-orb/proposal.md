## Why

Der Landing-Page-Hero (Theme `udig2`, dunkler Navy-Hintergrund) soll rechts eine
leuchtende, schwebende Kugel/Orb-Grafik erhalten (Design-Handoff „orb"). Der
übrige Hero (Headline, Text, zwei Buttons) bleibt unverändert.

## What Changes

- **Asset:** Die Orb-Grafik wird als Projekt-Asset `public/proudig-orb.jpg`
  abgelegt (ersetzt die temporäre externe URL aus dem Handoff).
- **Platzierung (handoff-treu):** Die Kugel wird als **absolut positioniertes,
  dekoratives Element** im `hero-udig2`-Section eingefügt (rechts, überlappend,
  ragt leicht aus dem Viewport). Das bisherige Rechts-Spalten-Visual
  (`HeroVisualCarousel`/`HeroProcessFlow`) wird **entfernt**; der Hero wird
  einspaltig (Text links).
- **CSS (1:1 aus Handoff):** `.orb`-Positionierung, `mix-blend-mode: screen`,
  `filter: hue-rotate(-8deg) saturate(1.2) brightness(1.1)`, radiale
  `mask-image` (federt Kanten aus und schneidet den eingebrannten
  „DIGITAL IMPACT"-Sockel weg), Float-Animation `floatOrb 6s ease-in-out infinite`
  (translateY 0 → −22px) inkl. `prefers-reduced-motion`-Abschaltung. Text-/
  Container-Layer erhält höheren `z-index`. Auf schmalen Viewports (< ~900px)
  wird die Kugel dezenter.

## Non-Goals

- Keine Änderung an Headline/Text/Buttons oder anderen Hero-Themes.
- `HeroVisualCarousel`/`HeroProcessFlow` werden nicht gelöscht, nur nicht mehr
  im `udig2`-Hero verwendet.

## Capabilities

### New Capabilities
- `landing-page`: Darstellung der öffentlichen Landing-Page (hier: Hero-Orb).

## Impact

- Frontend: `components/Hero.jsx` (HeroUdig2-Markup), `App.css` (Orb-Styles),
  neues Asset `public/proudig-orb.jpg`. Kein Backend.

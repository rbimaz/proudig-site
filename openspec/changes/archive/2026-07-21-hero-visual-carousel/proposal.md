## Why

Der Hero der Landing-Page (Theme `udig2`) zeigt im rechten Visual-Bereich aktuell fest nur das Prozessdiagramm (`HeroProcessFlow`). Für mehr visuelle Wirkung soll dort zusätzlich ein Marken-Bild („Digital Impact"-Kugel) gezeigt werden — bei Bedarf abwechselnd als Carousel. Gleichzeitig muss der bewährte Einzelmodus (nur Diagramm) ohne Aufwand wieder aktivierbar sein.

## What Changes

- Der Hero-Visual-Bereich (`.hero-udig2-visual`) wird von einem festen Diagramm zu einem umschaltbaren Visual: **Carousel** (Diagramm + Bild) ODER **Einzelmodus** (nur Diagramm).
- Neue Slide-Inhalte: Slide 1 = bestehendes `HeroProcessFlow`, Slide 2 = „Digital Impact"-Kugel als lokales Bild (`public/hero-sphere.jpg`).
- Umschaltung über eine **Code-Konstante/Prop** (kein für Besucher sichtbares UI). Default = Einzelmodus (aktuelles Verhalten bleibt unverändert).
- Carousel-Bedienung: Punkt-Indikatoren und automatischer Slide-Wechsel; Styling gemäß `src/main/frontend/DESIGN.md` (Tokens statt Hex, Orange nur für Aktion/Fokus des aktiven Indikators, `Inter`).
- Neues Asset `public/hero-sphere.jpg` (lokal eingebunden, keine externe Stitch-URL).

## Capabilities

### New Capabilities
- `landing-hero-visual`: Darstellung und Umschaltverhalten des Hero-Visual-Bereichs der Landing-Page (Diagramm-Einzelmodus vs. Carousel aus Diagramm + Marken-Bild).

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. -->

## Impact

- **Frontend-Komponenten:** `src/main/frontend/src/components/Hero.jsx` (Visual-Slot in `HeroUdig2`), neue Komponente für das umschaltbare Visual; `HeroProcessFlow.jsx` bleibt unverändert und wird wiederverwendet.
- **Styles:** `src/main/frontend/src/App.css` (Carousel-Slides, Indikatoren, Bild-Styling im `.hero-udig2-visual`).
- **Assets:** neues `src/main/frontend/public/hero-sphere.jpg`.
- **Design-System:** Umsetzung folgt `src/main/frontend/DESIGN.md`; keine neuen Tokens nötig.
- Keine Backend-, API- oder DB-Änderungen.

## Context

Der aktive Landing-Page-Hero ist `HeroUdig2` in `src/main/frontend/src/components/Hero.jsx`. Der rechte Visual-Slot (`.hero-udig2-visual`) rendert fest `<HeroProcessFlow />` — ein vertikales SVG-Prozessdiagramm (`.va-flow`, 280×360). Das Bild „Digital Impact" stammt aus einem Stitch-Export (`~/Downloads/stitch_landing_page_process_redesign/code.html`); dort ist es über eine ephemere Google-`aida`-URL eingebunden. Verbindliches UI-Regelwerk: `src/main/frontend/DESIGN.md` (Tokens statt Hex, ein Akzentton nur für Aktion/Fokus, `Inter`/`Space Grotesk`).

## Goals / Non-Goals

**Goals:**
- Hero-Visual per Code-Konstante/Prop zwischen Einzelmodus (nur Diagramm) und Carousel (Diagramm + Bild) umschalten.
- Default = Einzelmodus → bisheriges Verhalten bleibt bit-genau erhalten.
- Marken-Bild lokal einbinden (kein Ablauf-Risiko durch externe URL).
- Design-Token-konformes, schlankes Carousel (Indikatoren + Auto-Advance).

**Non-Goals:**
- Kein für Besucher sichtbarer Umschalter/Settings-UI.
- Keine Übernahme des übrigen Stitch-Designs (Farben, Bento-Grid, weitere Bilder).
- Keine Änderung an `HeroProcessFlow` selbst.
- Keine weiteren Slides über die zwei genannten hinaus.

## Decisions

- **Neue Komponente `HeroVisualCarousel.jsx`** kapselt die Modus-Logik. `Hero.jsx` ersetzt im `.hero-udig2-visual`-Slot nur `<HeroProcessFlow />` durch `<HeroVisualCarousel />`. Alternative (Logik inline in `Hero.jsx`) verworfen: `Hero.jsx` ist bereits groß und variantenreich; Kapselung hält den Diff chirurgisch.
- **Umschaltung via Modul-Konstante `SHOW_CAROUSEL` mit optionalem Prop-Override.** Default `false` = Einzelmodus. Entspricht der Codebasis-Konvention (Variantenschaltung über Konstante, vgl. `theme` in `App.jsx`). Ein sichtbares UI wurde bewusst nicht gewählt (User-Vorgabe).
- **Einzelmodus rendert unverändert `<HeroProcessFlow />`** ohne Carousel-Wrapper/Indikatoren, damit Layout und Verhalten identisch zum Ist-Zustand bleiben.
- **Bild lokal unter `public/hero-sphere.jpg`**, eingebunden als `/hero-sphere.jpg`. Datei wurde aus der Stitch-URL heruntergeladen (JPEG, 512×382). Externe URL wird nicht referenziert (Ablauf-/Datenschutz-Risiko).
- **Auto-Advance via `setInterval` in `useEffect`** mit Cleanup; State `active` (Index). Klick auf Indikator setzt `active` direkt. Festes Intervall (z. B. 5 s).
- **Styling in `App.css`** direkt beim bestehenden `.hero-udig2-visual`-Block. Slides absolut überlagert mit `opacity`-Transition; Indikatoren als Punkte, aktiver Punkt `var(--c-accent)`, inaktiv tokenbasiert neutral. Bild `object-fit`/`border-radius` tokenkonform, passend zur 400px-Visual-Spalte.

## Risks / Trade-offs

- **Bild-Seitenverhältnis (512×382) vs. Diagramm-Höhe (360)** → Bild in einen Container mit fixer Höhe fassen und `object-fit: cover`/`contain` wählen, damit der Slide-Wechsel nicht springt.
- **Auto-Advance kann bei Reduced-Motion stören** → optional `prefers-reduced-motion` respektieren (Auto-Advance pausieren); als kleine Erweiterung, kein Muss.
- **Konstante statt UI** → Umschalten erfordert Rebuild. Akzeptiert, da explizite User-Vorgabe.

## Migration Plan

Reines Frontend-Additiv. Deploy über normalen SPA-Build ins JAR. Rollback = Konstante auf `false` (bzw. Revert des Commits); da Default ohnehin Einzelmodus ist, ändert sich für Besucher ohne Aktivierung nichts.

## Open Questions

- Keine offen — Bildwahl (Hero-Kugel), Umschaltung (Code-Konstante) und Einzelmodus-Inhalt (nur Diagramm) sind mit dem User geklärt.

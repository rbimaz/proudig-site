## 1. Asset

- [x] 1.1 `hero-sphere.jpg` in `src/main/frontend/public/` bereitstellen (Digital-Impact-Kugel, lokal; bereits heruntergeladen — Vorhandensein prüfen)

## 2. Komponente

- [x] 2.1 Neue Komponente `src/main/frontend/src/components/HeroVisualCarousel.jsx` anlegen mit Modul-Konstante `SHOW_CAROUSEL` (Default `false`) und optionalem Prop-Override
- [x] 2.2 Einzelmodus: gibt unverändert `<HeroProcessFlow />` zurück (kein Carousel-Wrapper, keine Indikatoren)
- [x] 2.3 Carousel-Modus: zwei Slides rendern — Slide 1 `<HeroProcessFlow />`, Slide 2 `<img src="/hero-sphere.jpg">` mit deutschem Alt-Text
- [x] 2.4 Slide-State (`active`) + Punkt-Indikatoren; Klick auf Indikator setzt aktive Slide
- [x] 2.5 Auto-Advance via `setInterval` in `useEffect` inkl. Cleanup; nach letzter Slide zurück zur ersten

## 3. Einbindung

- [x] 3.1 In `Hero.jsx` (`HeroUdig2`) im `.hero-udig2-visual`-Slot `<HeroProcessFlow />` durch `<HeroVisualCarousel />` ersetzen; Import ergänzen, ungenutzten `HeroProcessFlow`-Import nur entfernen, falls dadurch verwaist

## 4. Styling (App.css, tokenkonform)

- [x] 4.1 Carousel-/Slide-Container im Bereich `.hero-udig2-visual`: Slides überlagert mit `opacity`-Transition, feste Höhe passend zur 400px-Visual-Spalte
- [x] 4.2 Bild-Slide: `object-fit`, `border-radius`, Schatten über Tokens (`var(--shadow*)`), kein springendes Layout beim Wechsel
- [x] 4.3 Indikatoren: aktiver Punkt `var(--c-accent)`, inaktiv tokenbasiert neutral; ausschließlich `var(--c-*)`/`var(--shadow-*)`, keine Hex-Werte

## 5. Verifikation

- [x] 5.1 Frontend-Build (`npm run build` im Frontend) läuft fehlerfrei
- [x] 5.2 Default (`SHOW_CAROUSEL=false`): Hero zeigt nur das Diagramm, keine Indikatoren (unverändert zum Ist-Zustand)
- [x] 5.3 Aktiviert (`SHOW_CAROUSEL=true`): zwei Slides, Auto-Advance und Indikator-Klick funktionieren, Bild lädt lokal
- [x] 5.4 DESIGN.md-Check: keine hartkodierten Farben in den neuen Styles, Orange nur für aktiven Indikator

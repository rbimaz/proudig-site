# landing-hero-visual Specification

## Purpose
TBD - created by archiving change hero-visual-carousel. Update Purpose after archive.
## Requirements
### Requirement: Umschaltbarer Hero-Visual-Modus

Der Hero-Visual-Bereich der Landing-Page (Theme `udig2`, rechter Bereich `.hero-udig2-visual`) SHALL über eine Code-Konstante bzw. Prop zwischen zwei Modi umschaltbar sein: **Einzelmodus** (nur das Prozessdiagramm) und **Carousel-Modus** (Prozessdiagramm und Marken-Bild als Slides). Der Default SHALL der Einzelmodus sein, sodass das bisherige Verhalten ohne Konfiguration erhalten bleibt.

#### Scenario: Einzelmodus als Default

- **WHEN** die Landing-Page ohne aktivierte Carousel-Konstante geladen wird
- **THEN** zeigt der Hero-Visual-Bereich ausschließlich das Prozessdiagramm (`HeroProcessFlow`)
- **AND** es werden keine Carousel-Indikatoren angezeigt

#### Scenario: Carousel per Konstante aktivieren

- **WHEN** die Carousel-Konstante/Prop auf aktiv gesetzt ist
- **THEN** zeigt der Hero-Visual-Bereich das Carousel mit zwei Slides
- **AND** ein Wechsel zurück auf den Einzelmodus ist allein durch Umstellen der Konstante möglich, ohne weitere Code-Änderungen

### Requirement: Carousel-Slides Diagramm und Marken-Bild

Im Carousel-Modus SHALL das Hero-Visual genau zwei Slides enthalten: Slide 1 das bestehende Prozessdiagramm (`HeroProcessFlow`), Slide 2 das lokal eingebundene Marken-Bild „Digital Impact" (`public/hero-sphere.jpg`). Das Bild SHALL aus dem lokalen `public`-Verzeichnis geladen werden und KEINE externe (Stitch-/Google-)URL referenzieren.

#### Scenario: Beide Slides vorhanden

- **WHEN** das Carousel angezeigt wird
- **THEN** ist die erste Slide das Prozessdiagramm und die zweite Slide das Marken-Bild
- **AND** das Bild wird über einen lokalen Pfad (`/hero-sphere.jpg`) geladen

#### Scenario: Bild mit Alt-Text

- **WHEN** die Bild-Slide gerendert wird
- **THEN** besitzt das `<img>` einen aussagekräftigen deutschen Alt-Text

### Requirement: Carousel-Bedienung und -Wechsel

Im Carousel-Modus SHALL das Visual Punkt-Indikatoren für die verfügbaren Slides anzeigen und automatisch zwischen den Slides wechseln. Der aktive Indikator SHALL visuell hervorgehoben sein. Ein Klick auf einen Indikator SHALL direkt zur zugehörigen Slide wechseln.

#### Scenario: Automatischer Wechsel

- **WHEN** das Carousel aktiv ist und keine Nutzerinteraktion erfolgt
- **THEN** wechselt die angezeigte Slide nach einem festen Intervall automatisch zur nächsten Slide
- **AND** nach der letzten Slide wird wieder die erste angezeigt

#### Scenario: Direktauswahl per Indikator

- **WHEN** der Nutzer auf einen Slide-Indikator klickt
- **THEN** zeigt das Carousel die zugehörige Slide
- **AND** der zugehörige Indikator wird als aktiv hervorgehoben

### Requirement: Design-Konformität des Hero-Visuals

Die Darstellung des Hero-Visuals SHALL dem Design-System (`src/main/frontend/DESIGN.md`) folgen: Farben ausschließlich über Design-Tokens (`var(--c-*)`), keine hartkodierten Hex-Werte in neuen Styles; die Akzentfarbe (Orange) SHALL nur für Aktion/Fokus verwendet werden (aktiver Indikator); UI-Text in `Inter`.

#### Scenario: Aktiver Indikator nutzt Akzentfarbe

- **WHEN** ein Slide-Indikator aktiv ist
- **THEN** wird er in der Akzentfarbe über das Token `var(--c-accent)` dargestellt
- **AND** inaktive Indikatoren nutzen eine neutrale, tokenbasierte Farbe

#### Scenario: Keine hartkodierten Farben

- **WHEN** neue Styles für das Hero-Visual ergänzt werden
- **THEN** referenzieren sie Farben und Schatten ausschließlich über `var(--c-*)`/`var(--shadow-*)`


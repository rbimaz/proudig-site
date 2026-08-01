## Context

Der Wurzel-Container `.app` hat `min-height: 100vh`, aber Block-Layout. STATIC-Seiten
rendern als Geschwister `Navbar`, `.static-page-content` (`min-height: 60vh`) und
`Footer`. Bei kurzem Inhalt endet der Content nach ~60vh und der Footer folgt
direkt — der Rest des Viewports bleibt leer. `App.jsx` berechnet bereits
`isStaticPage`, verwendet es aber nicht.

## Goals / Non-Goals

**Goals:**
- Footer bei kurzem Inhalt am unteren Viewport-Rand (Sticky-Footer).
- Minimaler Blast-Radius: nur STATIC-Seiten.

**Non-Goals:**
- Kein globaler Layout-Umbau von `.app` für alle Seiten (Option C, verworfen wegen
  Regressionsrisiko).
- Keine Änderung an Footer-Inhalt oder Navbar.

## Decisions

- **Scoped Flex-Spalte statt globalem Umbau.** `isStaticPage` wird als Klasse an
  `.app` gehängt (z. B. `app static-layout`); eine CSS-Regel macht nur
  `.app.static-layout` zur Flex-Spalte und setzt `.static-page-content { flex: 1 }`.
  - Alternative A: `.app` global zur Flex-Spalte — verworfen, betrifft jede Seite.
  - Alternative B: `min-height: calc(100vh - Navbar - Footer)` — verworfen, weil die
    Footerhöhe variabel/fragil ist.
- **`min-height: 60vh` bleibt** als Fallback bestehen; `flex: 1` dominiert im
  Flex-Kontext und übernimmt die Höhenverteilung.

## Risks / Trade-offs

- Flex-Spalte auf `.app.static-layout` könnte Rand-Layouts beeinflussen → nur die
  drei STATIC-Routen betroffen (impressum, datenschutz, `/seite/*`), alle mit
  identischer Renderer-Struktur; per Sichtprüfung mit kurzem und langem Inhalt
  abgesichert.

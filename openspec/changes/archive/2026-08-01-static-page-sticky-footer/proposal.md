## Why

Auf STATIC-Seiten mit wenig Inhalt (z. B. `/seite/ueber-proudig`) sitzt der Footer
nicht am unteren Viewport-Rand, sondern direkt unter dem kurzen Content-Block —
darunter bleibt der Rest des Viewports leer. Der Footer wirkt dadurch „mitten auf
der Seite" statt als Seitenabschluss. Ursache: Das `.app`-Layout hat zwar
`min-height: 100vh`, ist aber ein reines Block-Layout ohne Sticky-Footer-Mechanik.

## What Changes

- STATIC-Seiten (impressum, datenschutz, `/seite/*`) erhalten ein
  **Sticky-Footer-Layout**: Der Wurzel-Container wird für diese Seiten zur
  Flex-Spalte, der Content-Bereich wächst (`flex: 1`) und schiebt den Footer an den
  unteren Rand.
- Umsetzung gezielt (scoped): die bereits berechnete, bislang ungenutzte
  `isStaticPage`-Bedingung in `App.jsx` wird als Layout-Klasse an `.app` gehängt;
  eine CSS-Regel greift nur bei dieser Klasse.
- Andere Seiten bleiben unberührt.

## Capabilities

### New Capabilities
<!-- Keine neue Capability. -->

### Modified Capabilities
- `static-pages`: Ergänzt das Darstellungsverhalten um ein Sticky-Footer-Layout,
  sodass der Footer bei wenig Inhalt am unteren Viewport-Rand steht.

## Impact

- Frontend: `App.jsx` (Layout-Klasse an `.app` via `isStaticPage`) und `App.css`
  (Flex-Spalten-Layout + `flex: 1` auf `.static-page-content`).
- Keine Backend-, API- oder DB-Änderung.

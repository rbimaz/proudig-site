## Context

Der Sticky-Footer für STATIC-Seiten (`.app.static-layout`, Footer als Geschwister
von `.static-page-content`) löst deren Fall. Die öffentlichen Content-Seiten haben
eine andere Struktur: Jede rendert `<div className="page …">` mit dem `<Footer/>`
als letztem Kind INNERHALB dieses Wrappers. `.page` hat bislang keine eigene
CSS-Regel; die Navbar ist `position: fixed`.

## Goals / Non-Goals

**Goals:**
- Footer bei kurzem Inhalt am unteren Viewport-Rand für alle `.page`-Content-Seiten.
- Eine gemeinsame Regel statt Änderungen je Seitenkomponente.

**Non-Goals:**
- Kein globaler Umbau von `.app` (HomePage/Kontakt bleiben unberührt).
- Keine Änderung der Seitenkomponenten oder des Footer-Inhalts.

## Decisions

- **Fix auf `.page`-Ebene mit `margin-top: auto`.** `.page` wird zur Flex-Spalte
  (`display:flex; flex-direction:column; min-height:100vh`); der Footer als letztes
  Kind erhält `margin-top: auto` und wird nach unten geschoben.
  - Alternative: pro Seite das jeweils wachsende Element (`flex:1`) markieren —
    verworfen, weil das growing-Element je Seite unterschiedlich ist; `margin-top:
    auto` am Footer ist strukturunabhängig.
  - Alternative: `.app` global zur Flex-Spalte — verworfen (Regressionsrisiko auf
    Nicht-`.page`-Seiten).
- **`min-height: 100vh` ist sicher**, weil die Navbar `position: fixed` (außer
  Flow) ist → kein Navbar-Höhen-Overflow, kein zusätzlicher Scroll.

## Risks / Trade-offs

- `.page` wird von vielen Seiten geteilt → eine Regel wirkt breit. Da alle dasselbe
  Muster (Footer als letztes Kind) und denselben Bug haben, ist die breite Wirkung
  gewollt; per Sichtprüfung an kurzer (Empty-State) und langer Seite abgesichert.

## Why

„Über Proudig" existierte bisher nur als hartkodierte Landing-Sektion (`About.jsx`,
Anker `#ueber`); der Navigations-Eintrag scrollte lediglich dorthin. Für eine
redaktionell pflegbare „Über Proudig"-Seite (CMS-STATIC-Seite unter
`/seite/ueber-proudig`) muss die Navigation auf diese Seite zeigen statt zu scrollen.

## What Changes

- Der Navbar-Eintrag **„Über Proudig"** (Desktop **und** Mobil) navigiert auf die
  Seite `/seite/ueber-proudig` statt zum Landing-Anker `#ueber`.
- Der **Footer** erhält einen neuen Link **„Über Proudig"** auf dieselbe Seite.
- Die Landing-Sektion `About.jsx` (`#ueber`) bleibt bestehen, wird aber nicht mehr
  aus der Navigation angesprungen.

## Capabilities

### New Capabilities
- `site-navigation`: Verhalten der seitenweiten Navigation (Navbar Desktop/Mobil,
  Footer-Links), insbesondere die Zielsetzung der „Über Proudig"-Verlinkung.

### Modified Capabilities
<!-- Keine bestehende Capability. Die seitenweite Navigation war bisher nicht als
     Spec erfasst und wird hier als neue Baseline für den betroffenen Ausschnitt
     eingeführt. -->

## Impact

- Frontend: `Navbar.jsx` (Helfer `goToUeber`, Desktop- und Mobil-Eintrag) und
  `Footer.jsx` (neuer Link).
- Abhängigkeit: Der Link funktioniert erst, wenn eine veröffentlichte STATIC-Seite
  mit Slug `ueber-proudig` existiert (sonst „Seite nicht gefunden").
- Keine Backend-Änderung.

## Why

Auf öffentlichen Content-Seiten mit wenig Inhalt (z. B. `/offerings/talks` ohne
Beiträge) sitzt der Footer nicht am unteren Viewport-Rand, sondern direkt unter dem
kurzen Inhalt. Der bereits gelöste Sticky-Footer greift nur für STATIC-Seiten
(`.app.static-layout`); die Content-Seiten haben eine andere DOM-Struktur (der
Footer liegt **innerhalb** eines gemeinsamen `.page`-Wrappers) und sind daher noch
betroffen.

## What Changes

- Der gemeinsame `.page`-Wrapper aller öffentlichen Content-Seiten (Offering-
  Übersicht/-Detail, News, Blog, Seminare) erhält ein **Sticky-Footer-Layout**:
  `.page` wird zur Flex-Spalte mit `min-height: 100vh`, der Footer (letztes Kind)
  wird per `margin-top: auto` an den unteren Rand geschoben.
- Eine einzige CSS-Regel deckt alle `.page`-Seiten ab; keine Änderung an den
  einzelnen Seitenkomponenten.
- Seiten ohne `.page`-Wrapper (Landing/HomePage, Kontakt) bleiben unberührt.

## Capabilities

### New Capabilities
- `content-page-layout`: Gemeinsames Layout-Verhalten der öffentlichen
  `.page`-Content-Seiten, insbesondere der Sticky-Footer bei wenig Inhalt.

### Modified Capabilities
<!-- Keine. STATIC-Seiten wurden separat gelöst (static-pages). -->

## Impact

- Frontend: `App.css` (neue `.page`-Regel + `.page .footer { margin-top: auto }`).
- Betroffen: `.page`-Wrapper von OfferingOverviewPage, OfferingDetailPage,
  NewsPage, NewsPostPage, BlogPage, BlogPostPage, SeminarePage, SeminarDetailPage
  (inkl. `.page not-found`-Fallbacks).
- Keine Backend-, API- oder DB-Änderung. Navbar ist `position: fixed`, daher kein
  zusätzlicher Scroll durch `min-height: 100vh`.

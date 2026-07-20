## 1. Backend

- [x] 1.1 `PageCategory.NEWS` ergänzen
- [x] 1.2 `PageService.getPublishedNews(Pageable)` (analog `getPublishedBlogPosts`)
- [x] 1.3 `NewsController` (`/api/news`): GET Liste (paginiert), `/tags`, `/{slug}` (spiegelt `BlogController`)

## 2. Admin (CMS für News)

- [x] 2.1 `NewsList.jsx` (spiegelt `BlogList`, `category=NEWS`, korrekte `/admin/cms/news/…`-Pfade)
- [x] 2.2 `App.jsx`: Routen `/admin/cms/news` → `NewsList`, `/admin/cms/news/new` und `/:id` → `PageEditor category="NEWS"`
- [x] 2.3 `AdminLayout`: Nav-Eintrag „News"

## 3. Öffentlich

- [x] 3.1 `NewsPage.jsx` (Liste, `/news`) — lädt `/api/news`
- [x] 3.2 `NewsPostPage.jsx` (Detail, `/news/:slug`) — lädt `/api/news/{slug}`
- [x] 3.3 `App.jsx`: öffentliche Routen `/news`, `/news/:slug`
- [x] 3.4 `News.jsx` Homepage-Sektion (neueste Beiträge via `/api/news?size=3`) in `HomePage` einbinden
- [x] 3.5 `Navbar`: Link „News" → `/news`
- [x] 3.6 CSS für News-Sektion/Seiten (bestehende Blog-Styles wiederverwenden wo möglich)
- [x] 3.7 News-Sektion an Design-System angleichen: `.news-section` `position: relative; padding: 6rem 1.5rem; background: var(--c-bg)`; `.container` durch `max-width`-Wrapper ersetzen; hardcodierte Farben → `--c-*`-Tokens (Akzent bleibt `#E8731A`)
- [x] 3.8 `/news`-Seiten von den Alt-Blog-Styles entkoppeln: dedizierte `.news-*`-Klassen in `NewsPage`/`NewsPostPage` + CSS (Token-Farben, Brand-Orange-Links statt `#2563eb`, Karten-Rand `var(--c-border)`, Hero-Padding-Top gegen Navbar-Überdeckung)
- [x] 3.9 News-Listenseite auf den Standard-`.container` (`max-width: 1200px; padding: 0 32px`) umstellen — Breite konsistent zu den übrigen Seiten normieren (Hero/Section nur noch vertikal polstern)
- [x] 3.10 News-Detailseite ebenfalls auf die volle `.container`-Breite ziehen (statt schmaler 760px-Lesespalte); vertikale Polsterung und Navbar-Abstand (ohne Titelbild) beibehalten
- [x] 3.11 Detail-Header: Breadcrump (dupliziert den Titel) durch Bereichs-Eyebrow „NEWS" (Link auf `/news`) ersetzen — Titel nur noch einmal als `<h1>`, Bereich allein oben (Muster wie Übersichtsseiten)

## 4. Tests & Verifikation

- [x] 4.1 Backend-Test: `NewsController`/`PageService` liefert veröffentlichte News
- [x] 4.2 Backend kompiliert + Tests grün; Frontend Lint/Build grün
- [x] 4.3 Visuelle Kontrolle (Homepage-News-Sektion + `/news`)
- [x] 4.4 `openspec validate add-news-module --strict` erfolgreich

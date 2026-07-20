## Why

Die Website soll ein **News-Modul** erhalten, gepflegt über das bestehende CMS.
Das CMS ist kategoriebasiert (`Page.category`); News wird als eigene Kategorie
`NEWS` eingeführt und über die vorhandene, kategorie-agnostische Admin-Verwaltung
(`/api/admin/pages`) sowie den generischen `PageEditor` gepflegt.

## What Changes

- **Backend:**
  - `PageCategory.NEWS` ergänzen.
  - `PageService.getPublishedNews(pageable)` (analog `getPublishedBlogPosts`).
  - `NewsController` (`/api/news`): veröffentlichte News (paginiert), `/tags`,
    `/{slug}` — spiegelt das **funktionierende** `BlogController`-Muster. Die
    Admin-CRUD (`AdminPageController`) bleibt unverändert (Kategorie-Parameter).
- **Admin (CMS für News):**
  - Nav-Eintrag „News" (`AdminLayout`), Routen `/admin/cms/news` → `NewsList`,
    `/admin/cms/news/new` und `/admin/cms/news/:id` → `PageEditor category="NEWS"`.
  - `NewsList`-Komponente (spiegelt `BlogList`, **mit korrekten `/admin/cms/…`-
    Pfaden**). Optional News-Zähler im Dashboard.
- **Öffentlich (News-Modul auf der Website):**
  - `NewsPage` (Liste, `/news`) + `NewsPostPage` (Detail, `/news/:slug`), die
    `/api/news` bzw. `/api/news/{slug}` konsumieren.
  - **News-Sektion auf der Homepage** (neueste Beiträge) als eigene Komponente
    in `HomePage`.
  - Navbar-Link „News".

## Non-Goals

- Keine Änderung/Reparatur der bestehenden (teilweise kaputten) Blog-Public-Seiten.
- Kein DB-Schema-Umbau (nur Enum-Wert; `category` ist String-Spalte).

## Capabilities

### New Capabilities
- `news`: News-Modul (CMS-gepflegt, öffentliche Darstellung, Homepage-Sektion).

## Impact

- Backend: `PageCategory`, `PageService`, neuer `NewsController`.
- Frontend: `App.jsx` (Routen), `AdminLayout` (Nav), neue `NewsList`,
  `NewsPage`, `NewsPostPage`, `News`-Homepage-Komponente, `Navbar` (Link),
  CSS. Kein DB-Migration nötig.

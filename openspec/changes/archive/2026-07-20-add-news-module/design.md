## Context

Das CMS speichert Inhalte generisch in `Page` mit `category` (BLOG/SEMINAR/STATIC),
`status` (DRAFT/PUBLISHED/ARCHIVED), slug, title, content, excerpt, coverImage,
tags, author, publishedAt. Admin-CRUD läuft kategorie-agnostisch über
`AdminPageController` (`/api/admin/pages?category=`); der `PageEditor` nimmt die
Kategorie als Prop. Öffentliche Lesekanäle sind pro Kategorie eigene Controller
(`BlogController` `/api/blog`, `SeminarController` `/api/seminare`).

**Befund:** Die öffentlichen Blog-*Seiten* (`BlogPage`/`BlogPostPage`) rufen
nicht-existente Endpoints (`/api/pages?category=…`, `/api/pages/slug/…`) und die
Admin-Navigation von `BlogList` nutzt falsche Pfade (`/admin/blog/…`). News wird
daher **nicht** 1:1 von diesen Seiten kopiert, sondern auf dem funktionierenden
`BlogController`/`/api/blog`-Muster und mit korrekten Routen aufgebaut.

## Goals / Non-Goals

**Goals:** News per CMS pflegbar (Kategorie NEWS), funktionierende öffentliche
Liste/Detail, Homepage-Sektion, Navbar-Link.

**Non-Goals:** Reparatur der Blog-Public-Seiten; DB-Migration.

## Decisions

- **NEWS als PageCategory** statt eigenem Datenmodell → maximale Wiederverwendung
  (Admin-CRUD, PageEditor, Media, Tags, Status/Publish unverändert).
- **`NewsController` `/api/news`** spiegelt `BlogController` (list published
  paginiert, `/tags`, `/{slug}`) — der nachweislich funktionierende Kanal.
- **Frontend-Public** konsumiert `/api/news` (Liste) und `/api/news/{slug}`
  (Detail) — nicht die kaputten `/api/pages`-Aufrufe des Blogs.
- **Admin-Routen** unter `/admin/cms/news/…` (korrekt, im Gegensatz zu BlogList).
- **Homepage-Sektion** lädt die neuesten News über `/api/news?size=N`.

## Risks / Trade-offs

- [Slug-Kollision zwischen Kategorien] → `getBySlug` ist global; Slugs sind
  unique (DB-Constraint) → kein Konflikt.
- [Blog-Bugs bleiben bestehen] → bewusst außerhalb des Scopes; separat behandelbar.

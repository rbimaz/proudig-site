# Design — Blog-Modul

## Endpunkte (Frontend → bestehende Controller)
- Liste: `GET /api/blog?size=50` → paginiert, `data.content` (neueste zuerst, `publishedAt DESC`).
- Detail: `GET /api/blog/{slug}` → `PageDto`.
- Verwandte Beiträge: `GET /api/blog?size=4`, aktuellen Beitrag herausfiltern, max. 3.

`BlogController` und `PageService.getPublishedBlogPosts(Pageable)` existieren bereits — keine
Backend-Änderung nötig. `SecurityConfig` erlaubt `/api/blog/**` bereits.

## Tags
`PageDto.tags` ist `List<String>`. Rendern per `tags.map(...)`, kein `.split(',')`.

## Design (analog News, eigene `.blog-*`-Klassen)
Die `.blog-*`-Styles in `public.css` werden an das Design-System angeglichen (nicht neu benannt,
da sie nur noch von den Blog-Seiten genutzt werden):
- Farben über `--c-*`-Tokens, Akzent/Links Brand-Orange `#E8731A` (kein `#2563eb`).
- Karten: Rand `var(--c-border)`, neutraler Hover-Schatten.
- Listen-Hero und -Section in den Standard-`.container` (`max-width: 1200px; padding: 0 32px`);
  Hero mit ausreichend Top-Padding gegen die fixierte Navbar.
- Detail-Kopf: Bereichs-Eyebrow „BLOG" (Link auf `/blog`) statt Breadcrumb; Titel genau einmal.
- Detailseite in `.container`-Breite.

## Navbar
Auskommentierten „Blog"-Link (Desktop + Mobile) aktivieren.

## Seed
Neues Liquibase-Changelog `011-blog-seed.xml` (context `dev`) mit ~3 Beispiel-Beiträgen,
Kategorie `BLOG`, Status `PUBLISHED`; Einbindung in `master.xml`.

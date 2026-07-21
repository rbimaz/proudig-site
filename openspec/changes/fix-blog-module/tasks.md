## 1. Frontend — Endpunkte & Tags

- [x] 1.1 `BlogPage`: Liste über `GET /api/blog?size=50` laden (`data.content`), statt `/api/pages?category=BLOG`
- [x] 1.2 `BlogPostPage`: Detail über `GET /api/blog/{slug}`, verwandte Beiträge über `GET /api/blog?size=4` (aktuellen herausfiltern, max. 3)
- [x] 1.3 Tags als Array rendern (`tags.map`), `.split(',')` entfernen (Liste + Detail)

## 2. Frontend — Design

- [x] 2.1 `.blog-*`-Styles in `public.css` an Tokens/Brand-Orange angleichen (keine `#2563eb`, Karten-Rand `var(--c-border)`, neutraler Hover)
- [x] 2.2 Listen-Hero + -Section in `.container` fassen; Hero-Top-Padding gegen Navbar
- [x] 2.3 Detail-Kopf: Bereichs-Eyebrow „BLOG" (Link `/blog`) statt Breadcrumb; Titel nur als `<h1>`; Detail in `.container`-Breite

## 3. Sichtbarkeit & Daten

- [x] 3.1 Navbar: „Blog"-Link (Desktop + Mobile) aktivieren
- [x] 3.2 Seed `011-blog-seed.xml` (context `dev`, ~3 Beiträge, PUBLISHED) + `master.xml`-Include

## 4. Verifikation

- [x] 4.1 Frontend Lint/Build grün
- [x] 4.2 Visuelle Kontrolle `/blog` + `/blog/:slug` (keine 404, kein Blau, ein Titel)
- [x] 4.3 `openspec validate fix-blog-module --strict` grün

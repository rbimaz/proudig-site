# Blog-Modul reparieren und an News angleichen

## Warum
Das öffentliche Blog-Modul ist derzeit **funktionsunfähig** und weicht vom
inzwischen korrekten News-Muster ab:

- `BlogPage` ruft `/api/pages?category=BLOG&status=published` → **HTTP 404** (kein Handler),
  `BlogPostPage` ruft `/api/pages/slug/{slug}` → **HTTP 404**. Liste und Detail laden nie.
- Der vorhandene, funktionierende `BlogController` (`/api/blog`, `/api/blog/{slug}`, `/api/blog/tags`)
  wird gar nicht genutzt (toter Code).
- `post.tags.split(',')` verwendet, obwohl `tags` ein Array (`List<String>`) ist → Laufzeitfehler.
- Alt-Styles `.blog-*`: blaue Ränder/Links, Breadcrumb dupliziert den Titel, Hero-Padding zu
  klein (unter fixierter Navbar), keine normierte `.container`-Breite.
- Navbar-Link „Blog" ist auskommentiert → öffentlich nicht erreichbar; keine Beispieldaten.

## Was
- Blog-Frontend auf die dedizierten, existierenden Blog-Endpunkte umstellen (wie News).
- Tags als Array rendern.
- Blog-Seiten designkonsistent gestalten (Tokens, Brand-Orange `#E8731A`, `.container`-Breite,
  Bereichs-Eyebrow statt Titel-duplizierendem Breadcrumb, Navbar-Abstand).
- Navbar-Link „Blog" aktivieren.
- Beispiel-Seed für Blog-Beiträge anlegen.

## Nicht-Ziele
- Keine Änderung am generischen CMS/Admin-CRUD (`/api/admin/pages`).
- Kein gemeinsames DRY-Content-Muster (bewusst je Modul gespiegelt).

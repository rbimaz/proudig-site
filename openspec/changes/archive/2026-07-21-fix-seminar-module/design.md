# Design — Seminar-Modul

## Endpunkte
- Liste: `GET /api/seminare?size=50` → `data.content` (bestehender `SeminarController`).
- Detail: `GET /api/seminare/{slug}`.

Backend (`SeminarController`, `PageService.getPublishedSeminars`) existiert bereits;
`SecurityConfig` erlaubt `/api/seminare/**`. Keine Backend-Änderung.

## Vereinfachung
Alle Referenzen auf nicht existierende Felder entfernen: `date`, `endDate`, `time`, `location`,
`format`, `duration`, `maxParticipants`, `price`, `registrationLink`, `registrationDeadline`,
`targetAudience`, `prerequisites`. Ebenso den „kommend/vergangen"-Filter (basiert auf `date`).
Angezeigt werden Titel, Auszug, Tags, Datum (`publishedAt`) und Markdown-Inhalt.

## Design (konsistent mit Blog/News)
- Listen- und Detailseite behalten die `.seminar-*`-Seitenrahmen (Hero/Section — bereits an
  Tokens/`.container` angeglichen) und nutzen für Karten/Detail die bereits designkonsistenten,
  geteilten Inhaltsklassen (`blog-grid`/`blog-card…`, `blog-post…`) — identische Optik zu Blog/News.
- Detail-Kopf: Bereichs-Eyebrow „SEMINARE" (Link `/seminare`) statt Breadcrumb; Titel einmal;
  volle `.container`-Breite; Navbar-Abstand.

## Navbar & Seed
- Auskommentierten „Seminare"-Link (Desktop + Mobile) aktivieren.
- Neues Changelog `012-seminar-seed.xml` (context `dev`, ~3 Seminare, `SEMINAR`, `PUBLISHED`) +
  `master.xml`-Include.

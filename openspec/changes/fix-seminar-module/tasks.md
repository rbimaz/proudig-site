## 1. Frontend — Endpunkte, Vereinfachung, Design

- [x] 1.1 `SeminarePage`: Liste über `GET /api/seminare?size=50` (`data.content`); Filter „kommend/vergangen" und `date`-Logik entfernen
- [x] 1.2 `SeminarePage`: Karten vereinfachen (Titel, Auszug, Tags, Datum, „Mehr erfahren"), nicht existierende Felder (Ort/Preis/Dauer …) entfernen; designkonsistente Karten
- [x] 1.3 `SeminarDetailPage`: Detail über `GET /api/seminare/{slug}`; Info-Box/Layout entfernen; Inhalt als Markdown; Tags-Array; Bereichs-Eyebrow „SEMINARE" statt Breadcrumb; `.container`-Breite

## 2. Sichtbarkeit & Daten

- [x] 2.1 Navbar: „Seminare"-Link (Desktop + Mobile) aktivieren
- [x] 2.2 Seed `012-seminar-seed.xml` (context `dev`, ~3 Seminare, PUBLISHED) + `master.xml`-Include

## 3. Verifikation

- [x] 3.1 Frontend Lint/Build grün
- [x] 3.2 Visuelle Kontrolle `/seminare` + `/seminare/:slug` (keine 404, kein Blau, ein Titel)
- [x] 3.3 `openspec validate fix-seminar-module --strict` grün

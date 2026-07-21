# Seminar-Modul reparieren und wie News/Blog vereinfachen

## Warum
Das öffentliche Seminar-Modul ist funktionsunfähig und war auf ein Datenmodell ausgelegt,
das das CMS nicht bereitstellt:

- `SeminarePage` ruft `/api/pages?category=SEMINAR&status=published` → **HTTP 404**,
  `SeminarDetailPage` ruft `/api/pages/slug/{slug}` → **HTTP 404**. Nichts lädt.
- Der vorhandene `SeminarController` (`/api/seminare`, `/api/seminare/{slug}`) wird nicht genutzt.
- Die Seiten lesen strukturierte Felder (`date`, `location`, `price`, `duration`, `format`,
  `registrationLink` …), die `Page`/`PageDto` **nicht** modelliert oder speichert — die Info-Box
  bliebe leer.
- Alt-Styles/Breadcrumb/Navbar wie beim Blog (blaue Reste, Titel-Duplikat, Link auskommentiert),
  keine Seed-Daten.

## Was
Seminare werden — wie News/Blog — als Inhaltsseiten behandelt:
- Frontend auf die dedizierten Endpunkte (`/api/seminare`, `/api/seminare/{slug}`) umstellen.
- Tags als Array rendern.
- Nicht vorhandene strukturierte Felder (Info-Box, Datum/Ort/Preis/Anmeldung, Filter
  „kommend/vergangen") entfernen; relevante Angaben gehören in den Markdown-Inhalt.
- Designkonsistent wie Blog/News (Tokens, Brand-Orange, `.container`, Bereichs-Eyebrow „SEMINARE").
- Navbar-Link „Seminare" aktivieren.
- Beispiel-Seed für Seminare anlegen.

## Nicht-Ziele
- Keine Erweiterung des Datenmodells um Seminar-Felder (bewusst vereinfacht).

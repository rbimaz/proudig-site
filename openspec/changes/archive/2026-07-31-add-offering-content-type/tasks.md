## 1. Backend: Content-Typ & API

- [x] 1.1 `OFFERING` zum Enum `PageCategory` hinzufügen
- [x] 1.2 `PageService`-Methoden ergänzen: `getPublishedOfferings(Pageable)` und `getPublishedOfferingsByTag(String tag, Pageable)` (exakter ganzer-Tag-Match über `getTagsList().contains(tag)`, kein LIKE)
- [x] 1.3 `OfferingController` unter `/api/offerings` (spiegelt `BlogController`): Liste published, `?tag=`-Filter, `/{slug}` Detail
- [x] 1.4 Backend-Test: Tag-Filter liefert exakte Treffer (Beitrag „Beratung" ja, „Strategieberatung" nein) und nur PUBLISHED

## 2. Admin

- [x] 2.1 `OfferingList` (spiegelt `BlogList`, lädt `/api/admin/pages?category=OFFERING`)
- [x] 2.2 Admin-Routen in `App.jsx`: `/admin/cms/offerings`, `/offerings/new`, `/offerings/:id` mit `PageEditor category="OFFERING"`
- [x] 2.3 Nav-Eintrag „Leistungen" in `AdminLayout.jsx` ergänzen
- [x] 2.4 Prüfen, dass Anlegen/Ändern/Publish/Archiv über den generischen `AdminPageController` mit `category=OFFERING` funktioniert (ggf. minimal anpassen)

## 3. Frontend öffentlich

- [x] 3.1 Config-Modul `src/config/offerings.js`: 5 Offerings als `{ key, title, tag }` (consulting/Beratung, studies/Studien, talks/Vorträge, software/Software-Lösungen, ai/KI-Anwendungen)
- [x] 3.2 `OfferingOverviewPage` unter `/offerings/:key`: Tag aus Config, `/api/offerings?tag=` laden, News-Card-Grid rendern, Empty-State bei 0 Beiträgen, unbekannter Key → Not-Found/Empty
- [x] 3.3 `OfferingDetailPage` unter `/offerings/:key/:slug`: Beitrag per Slug laden, Inhalt via `MarkdownContent` rendern
- [x] 3.4 Routen `/offerings/:key` und `/offerings/:key/:slug` in `App.jsx` registrieren

## 4. Leistungs-Karten klickbar

- [x] 4.1 `Expertise.jsx`: Karten mit Ziel verknüpfen — 5 Karten → `/offerings/:key` (aus Config), Weiterbildung → `/seminare`; Kartentitel bleiben deutsch, Karten als React-Router-`Link`

## 5. Tests & Verifikation

- [x] 5.1 Frontend-Unit-Tests: `OfferingOverviewPage` (Grid + Empty-State), `Expertise` (Karten verlinken korrekt)
- [x] 5.2 `npm run test:run` grün, `npm run lint` ohne neue Errors, `npm run build` erfolgreich; Backend-Build/-Tests grün
- [x] 5.3 Live-Verifikation (Screenshot): Klick auf Karte „Beratung" → `/offerings/consulting` zeigt getaggte Offerings; Detailseite rendert Markdown; „Weiterbildung" → `/seminare`

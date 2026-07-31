## Why

Die Landing-Sektion „Unsere Leistungen" (`Expertise.jsx`) zeigt sechs hartcodierte
Karten (Beratung, Studien, Vorträge, Weiterbildung, Software-Lösungen,
KI-Anwendungen), die **nicht klickbar** sind und ins Leere zeigen. Es fehlt ein
CMS-Content-Typ, mit dem Redaktion Inhalte zu einzelnen Leistungen pflegen kann,
und eine Übersicht, die beim Klick auf eine Karte die passenden Beiträge zeigt —
so wie es die News-/Blog-Übersichten bereits tun.

## What Changes

- Neuer CMS-Content-Typ **`OFFERING`** (deutsch: „Leistungen"; UI-Text bleibt
  deutsch, Technik/URLs englisch wie `BLOG`/`NEWS`). Gleiche `Page`-Entität,
  neuer `category`-Wert — **keine DB-Migration** (category ist `varchar`).
- **Backend**: `OfferingController` unter `/api/offerings` (Liste published,
  Tag-Filter mit **exaktem ganzen-Tag-Match**, `/{slug}` Detail); passende
  `PageService`-Methoden.
- **Admin**: Verwaltungsliste + Editor-Routen `/admin/cms/offerings`
  (`/new`, `/:id`) mit `PageEditor category="OFFERING"`; Menü-/Dashboard-Eintrag.
- **Öffentlich**: `OfferingOverviewPage` (News-Card-Grid, tag-gefiltert) unter
  `/offerings/:key` und `OfferingDetailPage` (Markdown via `MarkdownContent`)
  unter `/offerings/:key/:slug`. Empty-State, wenn (noch) keine Beiträge.
- **Karten klickbar**: `Expertise.jsx` erhält eine Mapping-Config (fester
  englischer Key ↔ deutscher Kartentitel ↔ deutscher Content-Tag). Fünf Karten
  öffnen die Offering-Übersicht ihres Tags; **Weiterbildung** verlinkt unverändert
  auf `/seminare` (Kategorie `SEMINAR`).

## Capabilities

### New Capabilities
- `offerings`: CMS-Content-Typ „Offering" samt Backend-API, Admin-Verwaltung,
  öffentlichen Übersichts-/Detailseiten und den klickbaren Leistungs-Karten der
  Landing-Page, die tag-gefilterte Offering-Übersichten öffnen.

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. Die Leistungs-Karten
     waren bisher nicht spezifiziert; die Landing-Specs decken nur Hero/News ab.
     Der MarkdownContent-Renderer wird unverändert wiederverwendet. -->

## Impact

- Backend: `PageCategory` (neuer Wert `OFFERING`), neuer `OfferingController`,
  `PageService`-Erweiterung, exakter Tag-Query im `PageRepository`.
  Kein DB-/Liquibase-Change.
- Frontend öffentlich: `Expertise.jsx` (klickbare Karten), neue Seiten
  `OfferingOverviewPage`/`OfferingDetailPage`, neue Routen in `App.jsx`.
- Frontend Admin: `OfferingList`, Admin-Routen, Navigations-/Dashboard-Eintrag.
- Baut auf `cms-markdown-cta-button` auf (`MarkdownContent` für die Detailseite).
- Redaktions-Workflow: Offering-Beiträge werden mit dem jeweiligen Leistungs-Tag
  (deutsch, z. B. „Beratung") versehen.

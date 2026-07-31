## 1. Kopf aus CMS-Index-Seite

- [x] 1.1 `OfferingOverviewPage`: zusätzlich `GET /api/offerings/{key}` laden (Index-Seite); 404/Fehler still behandeln (kein Fehlerzustand)
- [x] 1.2 Kopf rendern: bei vorhandener Index-Seite `title` → h1 und `excerpt` → Untertitel; sonst Fallback (Config-Titel + Eyebrow „LEISTUNG")
- [x] 1.3 Optionaler Intro-Block: falls Index-Seite `content` hat, über dem Grid via `MarkdownContent` rendern

## 2. Grid-Anpassung

- [x] 2.1 Grid-Beiträge um die Index-Seite bereinigen (`post.slug !== key`)

## 3. Tests & Verifikation

- [x] 3.1 Unit-Tests `OfferingOverviewPage`: (a) Kopf aus Index-Seite (title/excerpt/Intro), (b) Fallback ohne Index-Seite (Config-Titel), (c) Index-Seite nicht im Grid
- [x] 3.2 `npm run test:run` grün, `npm run lint` ohne neue Errors, `npm run build` erfolgreich
- [x] 3.3 Live-Verifikation (Screenshot): Index-Seite mit Slug `consulting` (Titel/Untertitel/Intro) anlegen → `/offerings/consulting` zeigt CMS-Kopf, Index-Seite nicht als Karte; ohne Index-Seite greift der Fallback

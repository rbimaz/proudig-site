## Why

Die öffentliche Website ist aktuell vollständig hinter einer „Coming Soon"-Sperre
(`ComingSoon`), die nur mit dem Preview-Passwort umgangen werden kann. Es gibt
keinen Weg, die Site „live" zu schalten, ohne Code zu ändern. Der Launch soll
stattdessen als **Einstellung** über die Admin-Oberfläche erfolgen — ein Umschalter,
der die Sperre für alle Besucher aufhebt.

## What Changes

- Neue persistente Systemeinstellung **`site.launched`** (Boolean, Default `false`
  über Property-Fallback) im bestehenden Key-Value-Setting-System.
- **Öffentlicher Status-Endpoint** `GET /api/public/site-status` liefert
  `{ "launched": true|false }` (ohne Auth, unter dem bereits offenen `/api/public/**`).
- **Frontend-Gate**: Beim Laden fragt die App den Launch-Status ab. Ist die Site
  **live**, entfällt die `ComingSoon`-Sperre für alle. Ist sie **nicht** live, gilt
  wie bisher: `ComingSoon`, außer die Preview wurde per Passwort freigeschaltet.
- **Admin-Umschalter**: Die Einstellungsseite (`/api/admin/settings`, ADMIN-only)
  bekommt einen Schalter „Website live schalten"; er ist reversibel (zurück auf
  „Coming Soon").
- Der Preview-Passwort-Mechanismus bleibt unverändert (Vorschau vor dem Launch).

## Capabilities

### New Capabilities
- `site-launch`: Öffentlicher Zugangs-Gate der Website, gesteuert über die
  persistente Launch-Einstellung, inkl. öffentlichem Status-Endpoint und
  Preview-Bypass vor dem Launch.

### Modified Capabilities
- `cms-settings`: Die Admin-Einstellungsseite verwaltet zusätzlich den
  Launch-Umschalter (neue persistente Einstellung `site.launched`).

## Impact

- Backend: `SettingService` (neuer Key `site.launched` + Boolean-Getter/-Validierung),
  Settings-DTO/-Controller (`launched` in GET/PUT), neuer öffentlicher
  Status-Endpoint (`/api/public/site-status`), `application.properties`
  (`app.site.launched:false`).
- Frontend: `App.jsx` (Launch-Status abfragen statt nur sessionStorage),
  `Settings.jsx` (Umschalter).
- Sicherheit: Status-Endpoint gibt nur einen Boolean preis; Umschalten bleibt
  ADMIN-only. Default `false` → Verhalten unverändert bis zum bewussten Launch.

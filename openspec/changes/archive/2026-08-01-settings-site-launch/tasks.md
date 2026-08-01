## 1. Backend — Setting

- [x] 1.1 In `SettingService` `KEY_SITE_LAUNCHED = "site.launched"`, Property-Fallback `app.site.launched:false`, Getter `isSiteLaunched()` und Boolean-Validierung (`true`/`false`) ergänzen.
- [x] 1.2 In `application.properties` `app.site.launched=false` setzen.

## 2. Backend — Endpoints

- [x] 2.1 Öffentlichen Endpoint `GET /api/public/site-status` ergänzen, der `{ "launched": <boolean> }` liefert (unter `/api/public/**`, ohne Auth).
- [x] 2.2 Settings-GET/PUT (`/api/admin/settings`) um das Feld `launched` erweitern (lesen + validiert setzen), ADMIN-only.

## 3. Frontend — Gate

- [x] 3.1 In `App.jsx` beim Start `GET /api/public/site-status` abfragen; Status `null` bis geladen; Gate erst danach entscheiden (Loader statt Aufblitzen). `launched === true` oder Preview-freigeschaltet → Inhalt; sonst `ComingSoon`. Bei Fehler fail-safe `false`.

## 4. Frontend — Admin-Umschalter

- [x] 4.1 In `Settings.jsx` einen Umschalter „Website live schalten" ergänzen, der `launched` aus `/api/admin/settings` liest und speichert.

## 5. Verifikation

- [x] 5.1 Backend-Tests: `site-status` liefert Default `false`; nach Setzen `true`; Setting-Validierung lehnt Nicht-Boolean ab. Frontend-Testsuite grün.
- [x] 5.2 Manuell: Default → „Coming Soon"; Umschalter an → Site öffentlich; Umschalter aus → wieder „Coming Soon"; Preview-Passwort funktioniert vor Launch weiterhin.

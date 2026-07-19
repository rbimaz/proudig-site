## 1. Backend

- [x] 1.1 `UserCreateRequest` um `boolean forcePasswordChange` (Default `false`) erweitern
- [x] 1.2 `UserService.createUser` setzt `user.setForcePasswordChange(request.isForcePasswordChange())`

## 2. Frontend – Erstellen-Dialog

- [x] 2.1 `newUser`-State um `forcePasswordChange` (Default `false`) erweitern; Reset in `closeCreate`
- [x] 2.2 Checkbox »Passwortänderung beim ersten Login erforderlich« im Dialog (unter den Passwortfeldern)
- [x] 2.3 Wert im POST-Payload mitsenden

## 3. Frontend – Enforcement

- [x] 3.1 Verifiziert: Enforcement ist bereits über `AdminLogin` vollständig; alle Logins laufen dort (`/portal/login` → Redirect auf `/admin/login`, `PortalLogin` ist ungenutzter Legacy-Redirect). Keine Code-Änderung nötig.

## 4. Tests & Verifikation

- [x] 4.1 Frontend-Test: Anlegen mit aktivierter Checkbox sendet `forcePasswordChange: true` im Payload
- [x] 4.2 Backend kompiliert (`./mvnw -q compile`)
- [x] 4.3 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 4.4 `openspec validate user-first-login-password-change --strict` erfolgreich

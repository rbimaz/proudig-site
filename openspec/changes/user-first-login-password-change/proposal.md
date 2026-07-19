## Why

Beim Anlegen eines Benutzers kann ein Administrator derzeit nicht festlegen, ob
der Benutzer beim ersten Login sein (Initial-)Passwort ändern muss. Die dafür
nötige Infrastruktur existiert bereits vollständig (`User.forcePasswordChange`,
DB-Spalte `force_password_change`, Ausgabe in der Login-/Refresh-Response,
Zurücksetzen des Flags bei `POST /api/auth/change-password`, Redirect in
`AdminLogin`) — nur das **Setzen des Flags bei der Anlage** fehlt.

## What Changes

- **Backend:** `UserCreateRequest` erhält ein optionales Feld
  `forcePasswordChange` (Default `false`); `UserService.createUser` setzt es am
  neuen Benutzer.
- **Frontend:** Der „Neuen Benutzer erstellen"-Dialog erhält eine Checkbox
  »Passwortänderung beim ersten Login erforderlich«, deren Wert im POST-Payload
  mitgesendet wird.
- **Enforcement:** Bereits vollständig vorhanden. Alle Logins laufen über
  `AdminLogin` (das bei `forcePasswordChange` auf die Passwort-ändern-Seite
  umleitet); `/portal/login` ist nur ein Redirect dorthin und `PortalLogin` ein
  ungenutzter Legacy-Redirect. Keine Code-Änderung nötig.

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirement „Benutzer anlegen" wird um das optionale
  Setzen des Flags erweitert; eine Requirement zur erzwungenen Passwortänderung
  beim ersten Login wird ergänzt (dokumentiert das bestehende Verhalten und
  schließt die Portal-Login-Lücke).

## Impact

- Backend: `UserCreateRequest`, `UserService.createUser`.
- Frontend: `PortalUsers.jsx` (Checkbox + Payload).
- Keine DB-Migration nötig (Spalte `force_password_change` existiert bereits).
- Enforcement unverändert (bereits über `AdminLogin` + `change-password`).

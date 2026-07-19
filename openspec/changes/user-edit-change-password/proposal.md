## Why

Im Bearbeiten-Dialog eines Benutzers lässt sich aktuell nur Name und Rolle
ändern, aber nicht das Passwort. Ein Administrator soll für einen bestehenden
Benutzer ein neues Passwort setzen können (z. B. Zurücksetzen), ohne den Benutzer
neu anzulegen.

## What Changes

- **Backend:** `UserUpdateRequest` erhält ein optionales Feld `password`.
  `UserService.updateUser` setzt bei nicht-leerem Passwort das BCrypt-kodierte
  neue Passwort; ein leeres/fehlendes Passwort lässt das bisherige unverändert.
  Mindestlänge wie beim Ändern über `change-password` (min. 3 Zeichen).
- **Frontend:** Der Bearbeiten-Dialog erhält ein optionales Passwortfeld inkl.
  Bestätigung, Live-Match-Hinweis und Sichtbarkeits-Toggle (wie im Erstellen-
  Dialog). Leer lassen = Passwort unverändert. Nur bei Eingabe wird das Feld
  validiert und mitgesendet.

## Non-Goals

- Kein Setzen des `forcePasswordChange`-Flags im Bearbeiten-Dialog (separat).
- Keine Passwortrichtlinien über die bestehende Mindestlänge hinaus.

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zum optionalen Ändern des Passworts
  im Bearbeiten-Dialog.

## Impact

- Backend: `UserUpdateRequest`, `UserService.updateUser`.
- Frontend: `PortalUsers.jsx` (Edit-Dialog Passwortfelder + Payload).
- Bezug: bestehende Passwort-Logik in `AuthController#changePassword`.

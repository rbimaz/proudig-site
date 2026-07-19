## Why

Das Anlegen eines Benutzers über `/admin/portal/users` schlägt fehl:

```
null value in column "password" of relation "users" violates not-null constraint
```

Ursache: Das Formular (`PortalUsers.jsx`) sendet nur `email`, `firstName`,
`lastName`, `roles` — kein Passwort. `User.password` ist `nullable = false`, und
`UserService.createUser` speichert `passwordEncoder.encode(null)`, was zur
DB-Constraint-Verletzung führt.

Design-Entscheidung (mit Nutzer abgestimmt): Der Administrator vergibt beim
Anlegen selbst ein Initialpasswort über ein Passwortfeld im Formular.

## What Changes

- Frontend: Pflicht-Passwortfeld im "Neuen Benutzer erstellen"-Formular; das
  Passwort wird im Payload mitgesendet und nach dem Anlegen zurückgesetzt.
- Backend: `UserService.createUser` weist ein leeres/fehlendes Passwort mit einem
  klaren Validierungsfehler (HTTP 400) ab, statt eine Constraint-Verletzung
  auszulösen.

## Capabilities

### New Capabilities
- `user-management`: Administrative Benutzerverwaltung. Diese Change führt die
  Requirement zum Anlegen von Benutzern ein (weitere `USER-*`-Requirements folgen
  im regulären Baseline-Backfill).

## Impact

- Betroffener Code: `UserService.createUser`, `UserController` (POST /api/users),
  `PortalUsers.jsx`.
- Bezug: `USER-001`, `USER-FIELD-*` in `docs/REQUIREMENTS.md`.

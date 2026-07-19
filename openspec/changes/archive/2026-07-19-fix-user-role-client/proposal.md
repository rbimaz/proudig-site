## Why

Das Zuweisen der Rolle »Benutzer« schlägt mit HTTP 500 fehl
(`NoSuchElementException: Role not found: USER`). Ursache: Die Datenbank kennt
nur die Rollen `ADMIN`, `CONSULTANT`, `CLIENT` (Liquibase-Seed
`001-users-roles.xml`), die Benutzerverwaltungs-UI verwendet aber fälschlich
`USER`. Der etablierte Rollenname (Seed, `config.yaml`, bestehende Tests) ist
`CLIENT`; nur die neuere User-Management-UI ist abgedriftet.

## What Changes

- **Frontend:** In `PortalUserForm` (Rollen-Auswahl beim Anlegen, Default) und
  `PortalUsers` (Rollen-Badges) den Rollenwert `USER` → `CLIENT` ändern. Das
  angezeigte Label »Benutzer« bleibt unverändert.
- Betrifft Anlegen, Bearbeiten (Mehrfachrollen) und den Badge-Toggle gleichermaßen
  — alle drei nutzten bisher den nicht existierenden Wert `USER`.

## Non-Goals

- Keine DB-Migration und keine neue Rolle (die Rolle `CLIENT` existiert bereits).
- Keine Änderung an Autorisierungs-Gates (prüfen nur `ADMIN`/`CONSULTANT`).

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirement „Rollenauswahl beim Anlegen" wird korrigiert:
  »Benutzer« bildet auf `CLIENT` (statt `USER`) ab.

## Impact

- Frontend: `PortalUserForm.jsx`, `PortalUsers.jsx`; Tests
  (`PortalUserForm.test.jsx`, `PortalUsers.test.jsx`) auf `CLIENT` angepasst.
- Bezug: DB-Seed `001-users-roles.xml`, `config.yaml` (Rolle CLIENT).

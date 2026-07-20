## Why

Ein angemeldeter Administrator konnte sein eigenes Konto löschen und sich damit
aussperren (danach verweist der noch gültige JWT auf einen nicht mehr
existierenden Benutzer → Anfragen scheitern). Analog zum bereits vorhandenen
Schutz beim Rollen-Entzug (`updateUser`) fehlt dieser Schutz beim **Löschen**:
- Das **eigene** Konto darf nicht gelöscht werden.
- Der **letzte** Administrator darf nicht gelöscht werden.

## What Changes

- **Backend (autoritativ):** `UserController#deleteUser` reicht den angemeldeten
  Benutzer (`Principal`) an den Service durch. `UserService.deleteUser` lehnt mit
  HTTP 400 ab, wenn
  - der zu löschende Benutzer der angemeldete Benutzer ist, **oder**
  - der Benutzer ADMIN ist und der einzige verbleibende Administrator
    (`countByRoles_Name("ADMIN") <= 1`).
  Diese Prüfungen laufen vor dem bestehenden Eigentums-Guard und der Bereinigung.
- **Frontend:** In der Benutzerliste wird der »Löschen«-Button für das eigene
  Konto und den einzigen Administrator deaktiviert (mit erklärendem Titel);
  serverseitige Ablehnungen werden weiterhin als Meldung angezeigt.

## Non-Goals

- Keine Änderung an der bestehenden Bereinigung/Eigentums-Logik beim Löschen.

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zum Selbst-/Letzter-Admin-Schutz
  beim Löschen.

## Impact

- Backend: `UserController#deleteUser` (Principal), `UserService.deleteUser`
  (zwei Guards). `UserController` mappt `IllegalArgumentException` bereits auf 400.
- Frontend: `PortalUsers.jsx` (Löschen-Button deaktivieren für eigenes/einziges
  Admin-Konto).

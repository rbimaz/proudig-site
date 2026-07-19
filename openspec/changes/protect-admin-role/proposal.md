## Why

Wenn Administratoren im Bearbeiten-Dialog Rollen entziehen können, entsteht das
Risiko, dass sich die Anwendung ohne Administrator wiederfindet oder ein
angemeldeter Administrator sich selbst aussperrt. Zwei Invarianten müssen
serverseitig garantiert (und im UI abgebildet) werden:
1. Die **letzte** Administratorrolle der Anwendung darf nicht entzogen werden.
2. Der **angemeldete** Administrator darf sich seine eigene Admin-Rolle nicht
   entziehen.

## What Changes

- **Backend (autoritativ):** `UserService.updateUser` (bzw. `UserController`)
  erhält den angemeldeten Benutzer (via `Authentication`). Wird bei einem Update
  die ADMIN-Rolle entzogen (Benutzer hatte ADMIN, neue Rollenmenge ohne ADMIN),
  SHALL das System ablehnen (HTTP 400), wenn
  - der betroffene Benutzer der angemeldete Administrator ist, **oder**
  - es der letzte Benutzer mit ADMIN-Rolle ist.
  Neue Repository-Methode zum Zählen der Admins (`countByRoles_Name("ADMIN")`).
- **Frontend (Bequemlichkeit):** Im Bearbeiten-Dialog wird die
  ADMIN-Checkbox deaktiviert (mit Hinweis), wenn der bearbeitete Benutzer der
  angemeldete Administrator oder der einzige Administrator ist. Serverfehler
  werden als Meldung angezeigt (Fallback).

## Non-Goals

- Kein Schutz gegen das **Löschen** des letzten Administrators (separates Thema).
- Keine Änderung an der Rollen-Mehrfachauswahl selbst (siehe
  `user-edit-multiple-roles`).

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zum Schutz der Administratorrolle.

## Impact

- Backend: `UserController#updateUser` (Authentication), `UserService.updateUser`
  (Invarianten), `UserRepository` (Admin-Zählung).
- Frontend: `PortalUsers.jsx` (ADMIN-Checkbox deaktivieren + Hinweis; nutzt die
  Mehrfachauswahl aus `user-edit-multiple-roles`).
- Abhängigkeit: Der Frontend-Teil setzt die Rollen-Checkboxen aus
  `user-edit-multiple-roles` voraus; der Backend-Teil ist unabhängig.

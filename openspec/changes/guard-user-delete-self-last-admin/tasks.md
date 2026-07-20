## 1. Backend

- [x] 1.1 `UserController#deleteUser` reicht `Principal` an den Service durch
- [x] 1.2 `UserService.deleteUser(id, currentUserEmail)`: Selbst-Löschung ablehnen (HTTP 400)
- [x] 1.3 `UserService.deleteUser`: letzter Administrator ablehnen (ADMIN + `countByRoles_Name("ADMIN") <= 1`), vor Eigentums-Guard/Bereinigung

## 2. Frontend

- [x] 2.1 `PortalUsers.jsx`: `currentUser` aus AuthContext + `adminCount`; »Löschen«-Button deaktivieren für eigenes Konto und einzigen Admin (mit Titel-Hinweis)

## 3. Tests & Verifikation

- [x] 3.1 `UserServiceTest`: Selbst-Löschung → 400; letzter Admin → 400; bestehende Delete-Tests auf neue Signatur anpassen
- [x] 3.2 Backend kompiliert + Tests grün; Frontend-Tests/Lint/Build grün
- [x] 3.3 `openspec validate guard-user-delete-self-last-admin --strict` erfolgreich

## 1. Frontend

- [x] 1.1 `PortalUserForm.jsx`: in `ROLE_OPTIONS` den Wert `USER` → `CLIENT` (Label »Benutzer« bleibt); Default `role: 'CLIENT'`
- [x] 1.2 `PortalUsers.jsx`: Rollen-Badge-Liste `['ADMIN','CONSULTANT','USER']` → `['ADMIN','CONSULTANT','CLIENT']`

## 2. Tests

- [x] 2.1 `PortalUserForm.test.jsx`: Erwartung `roles:['USER']` → `['CLIENT']`; Edit-User-Fixtures `roles:['USER',...]` → `['CLIENT',...]`
- [x] 2.2 `PortalUsers.test.jsx`: ggf. `USER`-Rollenwerte in Fixtures/Erwartungen anpassen

## 3. Verifikation

- [x] 3.1 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 3.2 `openspec validate fix-user-role-client --strict` erfolgreich

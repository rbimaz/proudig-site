## 1. Frontend

- [x] 1.1 `PortalUserForm.jsx`: `ROLE_OPTIONS`-Labels auf Customer/Consultant/Admin ändern (Werte CLIENT/CONSULTANT/ADMIN bleiben)
- [x] 1.2 `PortalUsers.jsx`: Rollen-Badges über ein Label-Mapping (`ADMIN→Admin`, `CONSULTANT→Consultant`, `CLIENT→Customer`) anzeigen; Toggle-Wert bleibt der Rollencode

## 2. Tests

- [x] 2.1 `PortalUserForm.test.jsx`: `getByLabelText('Benutzer'|'Bearbeiter'|'Administrator')` → `'Customer'|'Consultant'|'Admin'`
- [x] 2.2 `PortalUsers.test.jsx`: Badge-Text `getByText('ADMIN')` → `'Admin'`

## 3. Verifikation

- [x] 3.1 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 3.2 `openspec validate consistent-role-labels --strict` erfolgreich

## 1. Frontend

- [x] 1.1 In `PortalUserForm.jsx` Passwort- und Bestätigungsfeld in eine `.ucd-row` gruppieren; ist die Bestätigung ausgeblendet (Bearbeiten ohne Passworteingabe), Row auf eine Spalte (`.ucd-row-single`)
- [x] 1.2 CSS `.ucd-row-single { grid-template-columns: 1fr }` in `portal.css`

## 2. Verifikation

- [x] 2.1 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 2.2 `openspec validate user-form-password-row --strict` erfolgreich

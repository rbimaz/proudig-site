## 1. Frontend

- [x] 1.1 In `PortalUserForm.jsx` Vorname- und Nachname-`form-group` in eine gemeinsame Zeile (`ucd-row`, zwei Spalten) gruppieren
- [x] 1.2 In `portal.css` die Formular-Seite (`.portal-user-form .user-form-page`) auf volle Breite setzen (bisherige `max-width: 470px` der Karte aufheben)
- [x] 1.3 CSS `.ucd-row` (zwei gleich breite Spalten, gleicher Feldabstand); auf schmalen Viewports auf eine Spalte umbrechen

## 2. Verifikation

- [x] 2.1 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 2.2 `openspec validate user-form-full-width-compact --strict` erfolgreich

## 1. Umsetzung
- [x] 1.1 `PortalUserForm.jsx`: initialen `forcePasswordChange` von `false` auf `true` setzen

## 2. Tests anpassen
- [x] 2.1 `PortalUserForm.test.jsx`: Default-Test auf `forcePasswordChange === true` (ohne Checkbox-Klick) umstellen
- [x] 2.2 `PortalUserForm.test.jsx`: Abwähl-Test ergänzen/anpassen — Checkbox deaktivieren → `forcePasswordChange === false`

## 3. Verifikation
- [x] 3.1 Frontend-Tests grün (`npm run test`)
- [x] 3.2 Lint/Build grün
- [x] 3.3 `openspec validate new-user-force-password-default --strict` grün
- [x] 3.4 Visuelle Kontrolle: Anlege-Dialog zeigt die Checkbox initial angehakt

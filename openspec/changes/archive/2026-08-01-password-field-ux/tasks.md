## 1. Passwort-Sichtbarkeit

- [x] 1.1 `AdminLogin.jsx`: Show/Hide-Toggle (`bi-eye`/`bi-eye-slash`, `type` password↔text, default verdeckt, `aria-label`) am Passwortfeld — nach Muster `PortalUserForm.jsx`
- [x] 1.2 `ChangePassword.jsx`: unabhängige Show/Hide-Toggles an allen 3 Feldern (aktuelles / neues / Bestätigung), default verdeckt, `aria-label`

## 2. Erfolgsmeldung im ProuDig-Design

- [x] 2.1 `ChangePassword.jsx` Erfolgsansicht: grüne Werte ersetzen — Haken-Icon-Stroke und Fortschrittsbalken `#10b981` → `#E8731A`; Icon-Hintergrund `#ecfdf5` → neutraler/dezent-oranger Ton; keine grünen Elemente mehr
- [x] 2.2 Prüfen, dass keine weiteren grünen Farbwerte in der Erfolgsansicht verbleiben

## 3. Tests & Verifikation

- [x] 3.1 Frontend-Test: Toggle schaltet Feld-`type` von `password` auf `text` und zurück (AdminLogin und/oder ChangePassword)
- [x] 3.2 `npm run test:run` grün, `npm run lint` ohne neue Errors, `npm run build` erfolgreich
- [x] 3.3 Live-Verifikation (Screenshots): `/admin/login` und `/admin/portal/change-password` mit sichtbarem Passwort; Erfolgsmeldung „Passwort erfolgreich geändert" ohne Grün (ProuDig-Orange)

## 1. Frontend

- [x] 1.1 `ChangePassword.jsx`: `user` aus `useAuth()`; E-Mail vor dem Logout festhalten und beim `navigate('/admin/login', { state: { email } })` mitgeben
- [x] 1.2 `AdminLogin.jsx`: `useLocation`; E-Mail-State mit `location.state?.email` initialisieren (Fallback leer)

## 2. Tests & Verifikation

- [x] 2.1 Test: `AdminLogin` mit `location.state.email` befüllt das E-Mail-Feld vor; ohne State bleibt es leer
- [x] 2.2 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 2.3 `openspec validate prefill-email-after-password-change --strict` erfolgreich

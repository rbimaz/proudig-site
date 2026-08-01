## 1. CSS

- [x] 1.1 In `App.css` eine `.page`-Regel ergänzen: `display:flex; flex-direction:column; min-height:100vh`.
- [x] 1.2 `.page .footer { margin-top: auto }` ergänzen, damit der Footer nach unten rutscht.

## 2. Verifikation

- [x] 2.1 Frontend-Testsuite läuft grün (`npm run test:run`).
- [x] 2.2 Manuell prüfen: `/offerings/talks` (wenig/kein Inhalt) → Footer unten; eine lange Content-Seite (z. B. News-Liste) → Footer folgt unter dem Inhalt; HomePage unverändert.

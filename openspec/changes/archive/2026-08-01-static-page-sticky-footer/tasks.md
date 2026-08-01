## 1. Layout-Klasse

- [x] 1.1 In `App.jsx` die Klasse des `.app`-Containers um `static-layout` erweitern, wenn `isStaticPage` zutrifft.

## 2. CSS

- [x] 2.1 In `App.css` `.app.static-layout` als Flex-Spalte (`display:flex; flex-direction:column`) definieren und `.app.static-layout .static-page-content { flex: 1 }` ergänzen.

## 3. Verifikation

- [x] 3.1 Frontend-Testsuite läuft grün (`npm run test:run`).
- [x] 3.2 Manuell prüfen: `/seite/ueber-proudig` (wenig Inhalt) → Footer unten; eine lange STATIC-Seite → Footer folgt unter dem Inhalt; Nicht-STATIC-Seite unverändert.

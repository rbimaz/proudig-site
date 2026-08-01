## 1. CSS-Regel ergänzen

- [x] 1.1 In `src/main/frontend/src/App.css` nach dem `.static-page-inner`-Block
  Regeln `.static-page-inner ul, .static-page-inner ol { margin-bottom: 1rem;
  padding-left: 2rem; }` und `.static-page-inner li { margin-bottom: 0.5rem; }`
  ergänzen (Werte aus `.blog-post-content`) → verify: Regeln vorhanden, Build
  läuft.

## 2. Verifizieren

- [x] 2.1 Veröffentlichte STATIC-Seite mit ungeordneter und geordneter Liste im
  Preview öffnen → verify: Listen eingerückt, Aufzählungszeichen/Nummerierung
  sichtbar, Darstellung wie Blog-Inhalt. (`/seite/ueber-proudig`: `ul
  padding-left=32px`, `list-style-type=disc`, Screenshot bestätigt Einrückung +
  Bullets)
- [x] 2.2 `npm run test:run` ausführen → verify: Test-Suite grün. (16 Dateien,
  115 Tests grün)
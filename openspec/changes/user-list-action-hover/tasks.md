## 1. Frontend

- [x] 1.1 `portal.css`: `.user-actions .btn-sm:hover` → Hintergrund `var(--orange)`, Border `var(--orange)`, Schrift weiß
- [x] 1.2 `portal.css`: `.user-actions .btn-sm.btn-danger:hover` → Hintergrund `#DC2626`, Border `#DC2626`, Schrift weiß (überschreibt den Orange-Hover für Löschen)

## 2. Verifikation

- [x] 2.1 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 2.2 `openspec validate user-list-action-hover --strict` erfolgreich

## 1. Umsetzung

- [x] 1.1 `Settings.jsx`: Handler `runLifecycleNow` (`POST /api/admin/pages/run-lifecycle`), zeigt „Lebenszyklus ausgeführt: N Übergänge" bzw. Fehler; State `running`
- [x] 1.2 Button „Jetzt ausführen" (btn-secondary) neben „Speichern"; Hinweistext

## 2. Verifikation

- [x] 2.1 Frontend Lint/Build grün
- [x] 2.2 `openspec validate lifecycle-run-now-button --strict` grün
- [x] 2.3 Visuelle Kontrolle des Buttons

## 1. Umsetzung

- [x] 1.1 `NewsList`: `ConfirmDialog` importieren; State `confirmTarget`
- [x] 1.2 „Löschen"-Button öffnet den Dialog (kein natives `confirm()` mehr); `onConfirm` löscht via `DELETE /api/admin/pages/{id}`, aktualisiert Liste und schließt Dialog; `onCancel` schließt
- [x] 1.3 Backend: `PageService.deletePage` — `DRAFT`-only-Guard entfernen, damit auch veröffentlichte News/Seiten gelöscht werden können (Bestätigung erfolgt im UI-Dialog)

## 2. Verifikation

- [x] 2.1 Frontend Lint/Build grün
- [x] 2.2 `openspec validate news-delete-confirm-dialog --strict` grün
- [x] 2.3 Visuelle Kontrolle des Dialogs

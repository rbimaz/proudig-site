# Design — News-Löschen mit ConfirmDialog

## Komponente wiederverwenden
`ConfirmDialog` (bestehend) mit Props: `open`, `title`, `message`, `confirmText`, `cancelText`,
`danger`, `onConfirm`, `onCancel`.

## `NewsList`
- Neuer State `confirmTarget` (die zu löschende News oder `null`).
- Der „Löschen"-Button setzt `confirmTarget = post` (kein `confirm()` mehr).
- `ConfirmDialog` wird gerendert:
  - `open={!!confirmTarget}`, `danger`, `title="News löschen"`,
    `message={\`„${confirmTarget?.title}" wirklich löschen?\`}`, `confirmText="Löschen"`.
  - `onCancel` → `setConfirmTarget(null)`.
  - `onConfirm` → tatsächliches Löschen (`DELETE /api/admin/pages/{id}`), danach Liste
    aktualisieren und Dialog schließen. Bestehendes `deleting`-Feedback bleibt erhalten.
- Die bisherige `handleDelete(id)` wird in „Dialog öffnen" + „performDelete(post)" aufgeteilt.

Keine neuen Styles nötig (`portal.css` liefert `.confirm-dialog*`).

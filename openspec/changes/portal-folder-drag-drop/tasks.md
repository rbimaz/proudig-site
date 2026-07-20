## 1. Backend

- [x] 1.1 `FolderService.moveFolder(folderId, newParentId, user)`: Eigentum von Ordner und Ziel prüfen; `newParentId = null` → Wurzel
- [x] 1.2 Zyklus-Schutz: Ziel darf nicht der Ordner selbst oder ein Nachfahre sein (Eltern-Kette hochlaufen) → sonst `IllegalArgumentException` (HTTP 400)
- [x] 1.3 `parentFolder` setzen, `updatedAt` aktualisieren, speichern, DTO zurückgeben
- [x] 1.4 `FolderController`: `PUT /api/folders/{folderId}/move` mit Body `{ parentFolderId }`

## 2. Frontend

- [x] 2.1 `FolderTree.jsx` `TreeNode`: `draggable`, `onDragStart` (Ordner-ID setzen), `onDragOver`/`onDragLeave` (gültiges Drop-Ziel markieren), `onDrop` (Move aufrufen)
- [x] 2.2 Wurzelbereich des Baums als Drop-Ziel (Verschieben auf die Wurzel)
- [x] 2.3 Ungültige/No-op-Drops (auf sich selbst/aktuelles Elternverzeichnis) im UI ignorieren; nach Move Baum-Refresh (`refreshCounter`)
- [x] 2.4 CSS: Drop-Ziel-Hervorhebung, Drag-Zustand

## 3. Tests & Verifikation

- [x] 3.1 Backend-Test (`FolderServiceTest`): Verschieben ok; Zyklus/Selbst → 400; Fremdzugriff → abgelehnt
- [x] 3.2 Frontend-Test: Drop ruft `PUT /api/folders/{id}/move` mit korrektem `parentFolderId`
- [x] 3.3 Backend kompiliert + Tests grün; Frontend-Tests/Lint/Build grün
- [x] 3.4 `openspec validate portal-folder-drag-drop --strict` erfolgreich

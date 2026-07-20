## Why

Im Dokumentenportal lässt sich die Ordnerstruktur nur über Anlegen, Umbenennen
und Löschen ändern — ein **Verschieben** von Ordnern (Umhängen an ein anderes
Elternverzeichnis) ist nicht möglich. Nutzer sollen ihre Ordnerstruktur innerhalb
ihres Stammverzeichnisses per **Drag & Drop** im Ordnerbaum umorganisieren
können.

## What Changes

- **Backend:** Neuer Vorgang „Ordner verschieben" — das Elternverzeichnis
  (`parentFolder`) eines Ordners kann geändert werden (inkl. auf die Wurzel).
  Validierung:
  - Nur eigene Ordner; Ziel muss ein eigener Ordner oder die Wurzel sein.
  - Ein Ordner darf **nicht in sich selbst oder einen seiner Nachfahren**
    verschoben werden (Zyklus-Schutz).
- **Frontend:** Die Knoten im `FolderTree` werden ziehbar; per Drop auf einen
  Zielordner (oder den Wurzelbereich) wird der Ordner dorthin verschoben. Visuelles
  Drop-Feedback; der Baum aktualisiert sich nach dem Verschieben.
- **Scope:** nur Ordner (keine Dokumente), ausschließlich innerhalb des eigenen
  Baums. Native HTML5-Drag-and-Drop (keine neue Abhängigkeit).

## Capabilities

### Modified Capabilities
- `portal-folders`: Ergänzt die Requirement zum Verschieben von Ordnern per
  Drag & Drop.

## Impact

- Backend: `FolderController` (Move-Endpoint), `FolderService` (`moveFolder` +
  Zyklus-/Eigentums-Validierung).
- Frontend: `FolderTree.jsx` (Drag-and-Drop), `FolderTreeContext` (Refresh nach
  Move).

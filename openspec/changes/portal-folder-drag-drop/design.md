## Context

`Folder` besitzt `parentFolder` (self-`@ManyToOne`) und `owner`. Der bestehende
`PUT /api/folders/{id}` (`updateFolder`) ändert nur den Namen. Es gibt keinen Weg,
das Elternverzeichnis zu ändern. Das Frontend rendert den Baum rekursiv in
`FolderTree.jsx` (`TreeNode`), lädt Kinder lazy über
`GET /api/folders/{id}/children` und hält Navigations-/Refresh-State in
`FolderTreeContext`.

## Goals / Non-Goals

**Goals:**
- Ordner per Drag & Drop im Baum verschieben (Elternwechsel, inkl. auf Wurzel).
- Serverseitig valide (Eigentum, kein Zyklus).

**Non-Goals:**
- Kein Verschieben von Dokumenten (nur Ordner).
- Keine Sortierung/Reihenfolge innerhalb eines Verzeichnisses.
- Keine externe DnD-Bibliothek.

## Decisions

- **Dedizierter Move-Endpoint** `PUT /api/folders/{id}/move` mit Body
  `{ "parentFolderId": <id|null> }`. Alternative (verworfen): `parentFolderId` in
  das bestehende `updateFolder` aufnehmen — vermischt Umbenennen und Verschieben
  und macht die Validierung unübersichtlich.
- **Zyklus-Schutz im Service:** Zielordner darf nicht der Ordner selbst und kein
  Nachfahre sein. Prüfung durch Hochlaufen der `parentFolder`-Kette vom Ziel bis
  zur Wurzel; trifft man auf den zu verschiebenden Ordner, wird abgelehnt
  (`IllegalArgumentException` → HTTP 400).
- **Eigentum:** verschobener Ordner und Zielordner müssen dem Benutzer gehören;
  `parentFolderId = null` bedeutet Wurzel des eigenen Baums.
- **Native HTML5-DnD:** `TreeNode` erhält `draggable`; `onDragStart` setzt die
  Ordner-ID, `onDragOver` markiert gültige Ziele, `onDrop` ruft den Move-Endpoint
  und löst einen Baum-Refresh (über `FolderTreeContext.refreshCounter`) aus. Der
  Wurzelbereich des Baums ist ebenfalls Drop-Ziel (Verschieben auf die Wurzel).
- **No-op/ungültige Drops** (auf sich selbst, aktuelles Elternverzeichnis,
  Nachfahre) werden im UI ignoriert bzw. serverseitig abgewiesen.

## Risks / Trade-offs

- [Namenskollision im Zielverzeichnis] → aktuell nicht strikt verhindert (wie
  beim Anlegen); ggf. später ergänzen. Kein Datenverlust.
- [Lazy geladene Kinder/Stale-Baum nach Move] → durch expliziten Refresh des
  betroffenen Teilbaums bzw. `refreshCounter` abgedeckt.

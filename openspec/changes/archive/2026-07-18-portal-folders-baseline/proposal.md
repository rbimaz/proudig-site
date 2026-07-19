## Why

Fortsetzung der OpenSpec-Baseline für das Portal (nach `portal-documents`). Die
Ordnerverwaltung (`FOLD-*` in `docs/REQUIREMENTS.md`) wird als tatsächlich
gebauter Ist-Zustand nach `openspec/specs/` überführt, abgeleitet aus
`FolderController` und `FolderService`.

Der Code-Abgleich deckt zwei Abweichungen zur bisherigen Doku auf, die in den
Requirements als Hinweis festgehalten werden:
- `FOLD-003` fordert "Löschen nur wenn leer" — tatsächlich löscht der Code
  Unterordner und Dokumente **rekursiv**.
- Beim rekursiven Löschen werden die **physischen Dateien nicht** aus dem
  Dateisystem entfernt (verwaiste Dateien).

## What Changes

- Neue Capability `portal-folders` mit Requirements für Anlegen, Auflisten,
  Navigieren, Umbenennen und (rekursives) Löschen von Ordnern.
- Keine Code-Änderung: reine Nachdokumentation.

## Capabilities

### New Capabilities
- `portal-folders`: Hierarchische Ordnerstruktur des Portals inkl.
  eigentümer-basierter Zugriffskontrolle und rekursivem Löschen.

## Impact

- Referenzierter Code (unverändert): `FolderController`, `FolderService`,
  `FolderDto`.
- Löst `FOLD-*` in `docs/REQUIREMENTS.md` ab. `FOLD-006` (Verschieben) ist
  **nicht** implementiert und wird als Nicht-Ziel dokumentiert.

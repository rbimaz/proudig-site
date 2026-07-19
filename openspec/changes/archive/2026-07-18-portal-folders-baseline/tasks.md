## 1. Baseline-Verifikation gegen Code

- [x] 1.1 Endpunkte in `FolderController` mit den Requirements abgeglichen
- [x] 1.2 Zugriffskontrolle bestätigt: Lesen/Anlegen owner-only, Umbenennen/Löschen owner ODER ADMIN (`canAccess`)
- [x] 1.3 Rekursives Löschen (`deleteFolderRecursive`) bestätigt; Abweichung zu FOLD-003 dokumentiert
- [x] 1.4 Verwaiste Dateien (kein `fileStorageService.delete` beim Ordnerlöschen) als Hinweis dokumentiert

## 2. Spec-Übernahme

- [x] 2.1 Delta-Spec `portal-folders` erstellt
- [x] 2.2 `openspec validate portal-folders-baseline --strict` erfolgreich
- [ ] 2.3 Change archivieren → Main-Spec erzeugen

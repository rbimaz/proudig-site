## 1. Baseline-Verifikation gegen Code

- [x] 1.1 Endpunkte in `DocumentShareController` mit den Requirements abgeglichen
- [x] 1.2 `DocumentPermission` = nur VIEW/EDIT bestätigt; Abweichung zu SHARE-002 dokumentiert
- [x] 1.3 Ablauf-Filterung (`expiresAt`) in `getSharedWithMe`/`canAccessDocument` bestätigt
- [x] 1.4 Latenter Fehler in `getSharedDocument` (owner-only `getDocument` nach Freigabe-Check) dokumentiert
- [x] 1.5 Aktivitätsprotokoll SHARE/UNSHARE bestätigt

## 2. Spec-Übernahme

- [x] 2.1 Delta-Spec `portal-sharing` erstellt
- [x] 2.2 `openspec validate portal-sharing-baseline --strict` erfolgreich
- [ ] 2.3 Change archivieren → Main-Spec erzeugen

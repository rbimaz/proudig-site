## 1. Baseline-Verifikation gegen Code

- [x] 1.1 Protokollierte Portal-Aktionen ermittelt: UPLOAD, DELETE, SHARE, UNSHARE
- [x] 1.2 Download-Pfad geprüft: kein Log-Aufruf → Abweichung zu LOG-002 dokumentiert
- [x] 1.3 Abruf `/api/admin/activity` als ADMIN-only mit Paging/Filter bestätigt

## 2. Spec-Übernahme

- [x] 2.1 Delta-Spec `portal-activity-log` erstellt
- [x] 2.2 `openspec validate portal-activity-log-baseline --strict` erfolgreich
- [ ] 2.3 Change archivieren → Main-Spec erzeugen

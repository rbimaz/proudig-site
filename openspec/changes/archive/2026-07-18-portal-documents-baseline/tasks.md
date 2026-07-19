## 1. Baseline-Verifikation gegen Code

- [x] 1.1 Endpunkte in `DocumentController` mit den Requirements abgeglichen
- [x] 1.2 Eigentümer-Zugriffskontrolle in `DocumentService` (`findByIdAndUploadedBy`) bestätigt
- [x] 1.3 Download-Sonderfall (`canAccessDocument`: Eigentümer ODER Freigabe) bestätigt
- [x] 1.4 Abweichungen zu `docs/REQUIREMENTS.md` dokumentiert (keine für DOC-*; siehe FOLD-003/SHARE-002 in Folge-Changes)

## 2. Spec-Übernahme

- [x] 2.1 Delta-Spec `portal-documents` erstellt
- [x] 2.2 `openspec validate portal-documents-baseline --strict` erfolgreich
- [ ] 2.3 Change archivieren → Main-Spec `openspec/specs/portal-documents/spec.md` erzeugen

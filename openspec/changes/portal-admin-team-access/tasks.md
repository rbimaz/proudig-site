## 1. Backend – Helper & Repository

- [x] 1.1 Privaten Helper `isStaff(User)` (Rolle ADMIN oder CONSULTANT) und `isAdmin(User)` (Rolle ADMIN) in `DocumentService` ergänzen (Muster wie `FolderService.canAccess`)
- [x] 1.2 `isStaff(User)` in `FolderService` ergänzen (Admin-Check `canAccess` bleibt für Verwaltung)
- [x] 1.3 `isStaff(User)` / `isAdmin(User)` in `DocumentShareService` ergänzen
- [x] 1.4 `FolderRepository.findByParentFolderIsNull()` ergänzen

## 2. Backend – Dokumente lesen (Personal = ADMIN|CONSULTANT)

- [x] 2.1 `getDocumentsByUser`: bei `isStaff` `findAll()`, sonst `findByUploadedBy`
- [x] 2.2 `getDocumentsInFolder`: Zugriff wenn Ordner-Eigentümer ODER `isStaff`
- [x] 2.3 `getDocument`: bei `isStaff` `findById`, sonst `findByIdAndUploadedBy`
- [x] 2.4 `DocumentShareService.canAccessDocument`: `true` auch für `isStaff` (Download-Gate)

## 3. Backend – Dokumente verwalten (nur ADMIN)

- [x] 3.1 `updateDocument`: Eigentümer ODER `isAdmin`
- [x] 3.2 `deleteDocument`: Eigentümer ODER `isAdmin`
- [x] 3.3 `uploadDocument`: Upload in fremden Ordner wenn `isAdmin`

## 4. Backend – Ordner (lesen = Personal, anlegen-unter-fremd = Admin)

- [x] 4.1 `getRootFolders`: bei `isStaff` `findByParentFolderIsNull()`, sonst nur eigene
- [x] 4.2 `getSubFolders`: Kinder wenn Ordner-Eigentümer ODER `isStaff` (Staff via `findByParentFolder`)
- [x] 4.3 `getFolderById`: bei `isStaff` `findById`, sonst `findByIdAndOwner`
- [x] 4.4 `createFolder`: Anlegen unter fremdem Parent wenn `canAccess` (Eigentümer ODER Admin)

## 5. Backend – Freigaben (nur ADMIN zusätzlich)

- [x] 5.1 `shareDocument`: Eigentümer ODER `isAdmin`
- [x] 5.2 `getDocumentShares`: Eigentümer ODER `isAdmin`
- [x] 5.3 `removeShare`: Eigentümer ODER Empfänger ODER `isAdmin`

## 6. Frontend

- [x] 6.1 `PortalDocuments.jsx`: Uploader (`uploadedByName`) in der Dokumentliste anzeigen

## 7. Tests & Verifikation

- [x] 7.1 Service-Tests: Personal (Admin & Consultant) sieht fremde Dokumente/Ordner; Client bleibt isoliert
- [x] 7.2 Service-Tests: Consultant darf fremdes Dokument NICHT löschen/ändern; Admin darf es
- [x] 7.3 Backend-Tests grün
- [x] 7.4 Frontend Lint/Build grün
- [x] 7.5 `openspec validate portal-admin-team-access --strict` grün
- [x] 7.6 Manuelle Kontrolle: zweiter Admin/Consultant sieht Dokumente/Ordner des ersten unter `/admin/portal/documents`

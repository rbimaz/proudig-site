## 1. Repository-Methoden

- [x] 1.1 `FolderRepository.existsByOwner(User)`, `DocumentRepository.existsByUploadedBy(User)`, `MediaRepository.existsByUploadedBy(User)`, `PageRepository.existsByAuthor(User)`
- [x] 1.2 `ActivityLogRepository.deleteByUser(User)`; `DocumentShareRepository.deleteBySharedBy(User)` + `deleteBySharedWith(User)`
- [x] 1.3 `ContentBlockRepository`: `@Modifying`-Query zum Setzen von `updated_by = NULL` für den Benutzer (`clearUpdatedBy(User)`)

## 2. Service

- [x] 2.1 `UserService.deleteUser` `@Transactional`; neue Repositories injizieren
- [x] 2.2 Guard: bei Eigentum (Ordner/Dokumente/Medien/Seiten) `IllegalArgumentException` (→ HTTP 400), nichts löschen
- [x] 2.3 Sonst abhängige Daten bereinigen (refresh_tokens, activity_log, document_shares by/with, content_blocks.updated_by→NULL) und Benutzer löschen

## 3. Frontend

- [x] 3.1 `PortalUsers.jsx` `handleDeleteUser`: bei nicht-`ok` die Server-Fehlermeldung anzeigen

## 4. Tests & Verifikation

- [x] 4.1 `UserServiceTest`: Löschen blockiert bei Eigentum (400); Löschen räumt auf und löscht, wenn kein Eigentum
- [x] 4.2 Backend kompiliert + `UserServiceTest` grün; Frontend-Tests/Lint/Build grün
- [x] 4.3 `openspec validate user-delete-cleanup-guard --strict` erfolgreich

## Why

Das Löschen eines Benutzers schlägt mit einer Fremdschlüssel-Verletzung fehl
(`fk_refresh_tokens_user_id` u. a.), weil `UserService.deleteUser` nur die
`users`-Zeile löscht, ohne abhängige Datensätze zu behandeln. Mehrere Tabellen
referenzieren `users` ohne `ON DELETE CASCADE`.

## What Changes (Option C)

- **Abhängige Daten bereinigen** (im selben Transaktionskontext, vor dem Löschen):
  - `refresh_tokens` des Benutzers löschen
  - `activity_log`-Einträge des Benutzers löschen
  - `document_shares`, die der Benutzer erstellt (`shared_by`) oder erhalten
    (`shared_with`) hat, löschen
  - `content_blocks.updated_by` des Benutzers auf `NULL` setzen (Spalte ist
    nullable — Inhalt bleibt erhalten, nur die Bearbeiter-Zuordnung entfällt)
- **Eigentum schützen:** Besitzt der Benutzer noch **Ordner, Dokumente, Medien
  oder CMS-Seiten** (`folders.owner`, `documents.uploaded_by`,
  `media.uploaded_by`, `pages.author` — alle NOT NULL), SHALL das Löschen mit
  HTTP 400 und einer klaren Meldung abgelehnt werden; es wird nichts gelöscht.
- **Frontend:** Die Liste zeigt bei abgelehntem Löschen (nicht-`ok`) die
  Server-Fehlermeldung an.

## Non-Goals

- Kein Kaskaden-Löschen von Inhalten (Dokumente/Seiten/Medien bleiben erhalten).
- Keine Schema-Migration (keine neuen `ON DELETE`-Regeln; Aufräumen erfolgt in
  der Anwendung). `content_blocks.updated_by` ist bereits nullable.
- Kein Umhängen/Übertragen von Eigentum (kann später ergänzt werden).

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zum Löschverhalten (Bereinigung
  abhängiger Daten und Eigentumsschutz).

## Impact

- Backend: `UserService.deleteUser` (Bereinigung + Guard, `@Transactional`),
  neue Repository-Methoden (`FolderRepository.existsByOwner`,
  `DocumentRepository.existsByUploadedBy`, `MediaRepository.existsByUploadedBy`,
  `PageRepository.existsByAuthor`, `ActivityLogRepository.deleteByUser`,
  `DocumentShareRepository.deleteBySharedBy/deleteBySharedWith`,
  `ContentBlockRepository.clearUpdatedBy`). `UserController` mappt
  `IllegalArgumentException` bereits auf HTTP 400.
- Frontend: `PortalUsers.jsx` (Fehlermeldung bei abgelehntem Löschen).

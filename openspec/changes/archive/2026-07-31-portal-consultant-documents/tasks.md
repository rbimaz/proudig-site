## 1. Datenmodell & Migration

- [x] 1.1 Entität `DocumentShare` (`document`, `user` (grantee), `grantedBy`, `createdAt`) + Repository (`findByUser`, `existsByDocumentAndUser`, `findByDocument`, `deleteByDocument`)
- [x] 1.2 Liquibase-Changeset: Tabelle `document_shares` mit FKs und Unique(`document_id`,`user_id`)

## 2. Zugriffslogik zentralisieren

- [x] 2.1 `DocumentService.canAccess(user, doc)` = `isAdmin || Eigentümer || geteilt`; Helfer `isAdmin(user)`
- [x] 2.2 Sichtbarkeit umstellen: „sieht alles" nur für ADMIN (CONSULTANT owner-scoped) in `DocumentService`/`FolderService`-Listungen
- [x] 2.3 Liste = eigene (`uploadedBy`) ∪ geteilte (`DocumentShare`) für Nicht-Admins
- [x] 2.4 `canAccess` in `getById`, **Download**, `updateDescription`, `move`, `delete` erzwingen; schreibende Aktionen zusätzlich `isAdmin || Eigentümer` (Freigabe = read-only)
- [x] 2.5 Download-Endpoint auf `canAccess` umstellen (ungeprüftes `getDocumentById` ersetzen) → schließt das Leck

## 3. Freigabe- & Ansicht-Endpunkte

- [x] 3.1 `POST /api/documents/{id}/share` (Body `userId`) und `DELETE /api/documents/{id}/share/{userId}` — `@PreAuthorize("hasRole('ADMIN')")`, Activity-Log `SHARE`/`UNSHARE`
- [x] 3.2 `GET /api/documents/shared-with-me` → mit dem Nutzer geteilte Dokumente
- [x] 3.3 Beim Löschen eines Dokuments zugehörige `DocumentShare` mit entfernen

## 4. Security-Öffnung

- [x] 4.1 `SecurityConfig`: `/api/documents/**`, `/api/folders/**` → `hasAnyRole('ADMIN','CONSULTANT')`; `/api/portal/**`, `/api/shares/**`, `/api/users/**` bleiben ADMIN
- [x] 4.2 Controller-`@PreAuthorize` (`DocumentController`, `FolderController`) auf ADMIN+CONSULTANT; Share-Methoden ADMIN-only

## 5. Frontend

- [x] 5.1 Portal-Route für Dokumente auf `ADMIN,CONSULTANT` (Users/Settings bleiben ADMIN-only)
- [x] 5.2 Consultant-Ansicht: Upload + eigene Liste/Ordner + Sektion „Mit mir geteilt" (`/api/documents/shared-with-me`)
- [x] 5.3 Admin-Aktion „Mit Nutzer teilen" (Nutzerauswahl) + Freigaben-Widerruf am Dokument

## 6. Tests & Verifikation

- [x] 6.1 Backend-Tests: CONSULTANT sieht nur eigene; geteiltes sichtbar/downloadbar; **Download fremd ohne Freigabe → 403** (Regression fürs Leck); Teilen nur ADMIN; Freigabe = read-only (kein Rename/Move/Delete)
- [x] 6.2 Frontend-Tests: Consultant-Portal (eigene + „Mit mir geteilt"), Admin-Teilen-Aktion
- [x] 6.3 `npm run test:run` grün, `npm run lint` ok, Frontend-Build ok; Backend-Build + Tests grün (Liquibase migriert)
- [x] 6.4 Live-Verifikation (Screenshot): als Consultant einloggen → nur eigene Docs; Admin teilt ein Doc → erscheint beim Consultant unter „Mit mir geteilt" und ist ladbar; fremdes Doc ohne Freigabe nicht erreichbar

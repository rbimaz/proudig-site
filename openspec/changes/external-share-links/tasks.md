## 1. Datenmodell & Migration
- [x] 1.1 Entität `ExternalShareLink` (Ziel `document_id` **oder** `folder_id`, genau eines) + Repository
- [x] 1.2 Liquibase `018-external-share-links.xml`: Tabelle `external_share_links` (beide FKs nullable) anlegen; im `master.xml` nach `017-…` einbinden
- [x] 1.3 Alte Tabelle `document_shares` im selben Changeset droppen (0 Zeilen)

## 2. Backend — Admin-Endpunkte (ADMIN-only)
- [x] 2.1 Service: Link erstellen für Dokument **oder** Ordner (genau ein Ziel; SecureRandom-Token URL-safe, Passwort→BCrypt), auflisten, widerrufen
- [x] 2.2 Controller unter `/api/shares`: `POST` (documentId **oder** folderId), `GET` (Links je Ziel/Liste, mit Ziel-Typ), `DELETE /{id}` (widerrufen)
- [x] 2.3 Audit: `SHARE_LINK_CREATED` / `SHARE_LINK_REVOKED` (entityType DOCUMENT|FOLDER) via `ActivityLogService`

## 3. Backend — öffentliche Endpunkte (permitAll)
- [x] 3.1 `GET /api/public/shares/{token}` → Metadaten `{ targetType, name, requiresPassword, valid }`
- [x] 3.2 `GET /api/public/shares/{token}/files?password=` (nur Ordner) → rekursive Dateiliste `[{ documentId, fileName, relativePath, fileSize }]` über `folders.parent_folder_id`-Teilbaum
- [x] 3.3 `GET /api/public/shares/{token}/download?documentId=&password=` → Validierung (revoked/expired/Passwort); bei Ordner-Link Teilbaum-Zugehörigkeit von `documentId` prüfen (sonst 403) + Datei-Stream; `access_count`/`last_accessed_at`; Audit `SHARE_LINK_ACCESSED`
- [x] 3.4 Rate-Limit auf Passwortversuche pro Token (Brute-Force-Schutz)
- [x] 3.5 `SecurityConfig`: `/api/public/**` → `permitAll`

## 4. Ablösung altes DocumentShare
- [x] 4.1 `DocumentController.download` von `documentShareService.canAccessDocument` entkoppeln (Feld + Prüfung entfernen; ADMIN-Gate genügt)
- [x] 4.2 Entfernen: `DocumentShareController`, `DocumentShareService`, `DocumentShare`, `DocumentShareDto`, `DocumentShareRepository`

## 5. Frontend — externe Links
- [x] 5.1 Öffentliche Seite `PublicShareView` unter Route `/s/:token`: bei Dokument Download-Button, bei Ordner rekursive Dateiliste (relativer Pfad) mit Download je Datei; optionale Passwort-Eingabe
- [x] 5.2 `App.jsx`: `/s/:token`-Route + Bypass des Coming-Soon-Gates für `pathname.startsWith('/s/')`
- [x] 5.3 `PortalDocuments`: Aktion „Extern teilen" **auf Dokumenten und Ordnern** (Dialog: Ablauf/Passwort/E-Mail optional) → Link erzeugen + URL kopieren; Liste bestehender Links (mit Ziel-Typ) mit „Widerrufen"

## 6. Frontend — altes Sharing entfernen
- [x] 6.1 `PortalShared.jsx` + Route `/admin/portal/shared` + Nav-Eintrag „Geteilt mit mir" in `PortalLayout` entfernen; alten User-zu-User-Share-Dialog entfernen

## 7. Verifikation
- [x] 7.1 Backend kompiliert; Frontend `npm run test:run` + lint + build grün
- [x] 7.2 E2E (headless): Admin erzeugt Dokument- **und** Ordner-Link → öffentlicher Download ohne Login; Ordner-Link listet Dateien rekursiv; mit Passwort; nach Widerruf/Ablauf kein Download; Datei außerhalb des Ordner-Teilbaums → 403
- [x] 7.3 Regression: Nicht-Admin hat weiterhin keinen Portal-Zugang; `/s/{token}` trotz Coming-Soon erreichbar
- [x] 7.4 `openspec validate external-share-links --strict` grün

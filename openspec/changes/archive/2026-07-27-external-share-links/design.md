# Design — Externe Freigabe-Links

## Datenmodell — `ExternalShareLink` (neue Entität + Liquibase `018-external-share-links.xml`)
| Spalte | Typ | Anmerkung |
|---|---|---|
| id | VARCHAR(36) | UUID |
| token | VARCHAR(64), unique, not null | kryptografisch zufällig (≥ 32 Byte, URL-safe Base64) |
| document_id | VARCHAR(36), FK → documents, **nullable** | gesetzt bei Dokument-Link |
| folder_id | VARCHAR(36), FK → folders, **nullable** | gesetzt bei Ordner-Link |
| permission | VARCHAR(20), default `DOWNLOAD` | v1 nur DOWNLOAD |
| password_hash | VARCHAR(100), nullable | BCrypt, wenn Passwortschutz |
| expires_at | TIMESTAMP, nullable | null = kein Ablauf |
| recipient_email | VARCHAR(255), nullable | Label/Audit |
| revoked | BOOLEAN, not null, default false | |
| created_by | VARCHAR(36), FK → users, not null | erzeugender Admin |
| created_at | TIMESTAMP, not null | |
| last_accessed_at | TIMESTAMP, nullable | |
| access_count | INT, not null, default 0 | |

**Invariante:** genau **eines** von `document_id` / `folder_id` ist gesetzt (Ziel-Typ = Dokument
oder Ordner). Durchsetzung in der Service-Schicht (und optional CHECK-Constraint).

Migration legt zusätzlich die alte Tabelle `document_shares` still (DROP, 0 Zeilen) — siehe Ablösung.

## Backend
**Admin (ADMIN-only, bestehender `/api/shares`-Prefix, bereits `hasRole('ADMIN')`):**
- `POST /api/shares` — Body `{ documentId? | folderId?, password?, expiresAt?, recipientEmail? }`
  (genau eines von documentId/folderId) → erzeugt Link, gibt Token/URL zurück. Token per
  `SecureRandom` (URL-safe). Passwort → BCrypt.
- `GET /api/shares?documentId=` / `?folderId=` bzw. Liste aller aktiven Links (mit Status/Ziel-Typ).
- `DELETE /api/shares/{id}` — Widerruf (`revoked=true`).
- Audit: `ActivityLogService.log(admin, "SHARE_LINK_CREATED"|"SHARE_LINK_REVOKED", "DOCUMENT"|"FOLDER", targetId, details)`.

**Öffentlich (`/api/public/shares/**`, in SecurityConfig `permitAll`):**
- `GET /api/public/shares/{token}` → `{ targetType (DOCUMENT|FOLDER), name, requiresPassword, valid }`
  (kein Datei-Inhalt).
- `GET /api/public/shares/{token}/files?password=` — **nur Ordner-Links:** rekursive Dateiliste des
  Ordners und aller Unterordner: `[{ documentId, fileName, relativePath, fileSize }]`.
- `GET /api/public/shares/{token}/download?documentId=&password=` → validiert (nicht revoked, nicht
  abgelaufen, Passwort-Match) und streamt die Datei (Muster wie `DocumentController.download`).
  - **Dokument-Link:** `documentId` optional/ignoriert — es wird das verknüpfte Dokument geliefert.
  - **Ordner-Link:** `documentId` erforderlich; Server prüft, dass das Dokument **innerhalb des
    freigegebenen Ordner-Teilbaums** liegt (sonst 403) — verhindert Zugriff auf fremde Dateien.
  - Bei ungültig → 404/403/410. `access_count`/`last_accessed_at` erhöhen; Audit `SHARE_LINK_ACCESSED`.
- **Ordner-Teilbaum:** rekursive Traversierung über `folders.parent_folder_id`; Dokumente per
  `documents.folder_id` innerhalb dieser Ordnermenge.
- **Brute-Force-Schutz:** einfache Rate-Limit-Zählung pro Token (z.B. In-Memory-Counter / Bucket).

**Refactor:** `DocumentController.download` entkoppeln von `documentShareService.canAccessDocument`.
Da Portal ADMIN-only ist, genügt die Klassen-`@PreAuthorize("hasRole('ADMIN')")`; die
`canAccessDocument`-Prüfung + das Feld `documentShareService` entfallen dort.

## Frontend
**Neu:**
- Öffentliche Seite `/s/:token` (`PublicShareView`): lädt Metadaten (Ziel-Typ), ggf. Passwort-Eingabe.
  - **Dokument-Link:** Dateiname + Download-Button.
  - **Ordner-Link:** Ordnername + rekursive **Dateiliste** (mit relativem Pfad) und Download je Datei.
- **Coming-Soon-Gate ausnehmen:** in `App.jsx` vor `if (!unlocked) return <ComingSoon/>` einen
  Bypass für `location.pathname.startsWith('/s/')` ergänzen (die Share-Seite ist bewusst öffentlich).
- In `PortalDocuments`: Aktion „Extern teilen" **pro Dokument und pro Ordner** → Dialog
  (Ablauf/Passwort/E-Mail optional) → erzeugt Link, zeigt/kopiert URL; plus Ansicht der bestehenden
  Links (mit Ziel-Typ) und „Widerrufen".

**Abgelöst:**
- `PortalShared.jsx` (Seite „Geteilt mit mir") + Nav-Eintrag in `PortalLayout` + Route
  `/admin/portal/shared` in `App.jsx` entfernen. Alten Share-Dialog (User-zu-User) entfernen.

## Ablösung altes DocumentShare (Backend)
Entfernen: `DocumentShareController`, `DocumentShareService`, `DocumentShare` (Entity),
`DocumentShareDto`, `DocumentShareRepository`. `DocumentController` von `DocumentShareService`
entkoppeln. `document_shares`-Tabelle in `018-...xml` droppen (0 Zeilen).

## Sicherheits-Checkliste
- Token unerratbar (kein Enumerations-Risiko); Vergleich konstantzeit-unkritisch (Lookup per token).
- Passwort nur als BCrypt gespeichert; Rate-Limit auf `/download`-Passwortversuche.
- Ablauf + Widerruf serverseitig geprüft; Datei ausschließlich per `document_id`-Lookup.
- **Ordner-Link:** Download nur für Dokumente im freigegebenen Teilbaum (Server prüft Zugehörigkeit);
  öffentliche Liste enthält ausschließlich Dateien dieses Ordners/der Unterordner — keine fremden.
- Öffentliche Endpunkte liefern nur Metadaten/Dateien des referenzierten Ziels — keine globalen Listen.

## Verifikation
- Backend-Tests/Kompilierung grün; Frontend `npm run test:run` + lint + build grün.
- E2E manuell (headless): Admin erzeugt Link → öffentlicher Abruf ohne Login lädt Datei; mit Passwort;
  nach Widerruf/Ablauf → kein Download; Nicht-Admin hat weiterhin keinen Portal-Zugang.
- `openspec validate external-share-links --strict` grün.

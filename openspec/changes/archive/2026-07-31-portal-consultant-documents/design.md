## Context

Rollen: ADMIN, CONSULTANT, CLIENT. Portal heute ADMIN-only
(`SecurityConfig`: `/api/documents/**`, `/api/folders/**`, `/api/portal/**`,
`/api/shares/**` = `hasRole('ADMIN')`; Controller-`@PreAuthorize` analog).

Bestehendes Fundament (wiederverwendbar):
- `Folder.owner` (nullable=false); `FolderService` scoped nicht-Staff per
  `findByOwner…`.
- `Document.uploadedBy` = Eigentümer; `Document.folder` nullable.
- `DocumentService.isStaff(user)` = ADMIN **oder** CONSULTANT → steuert die
  „sieht alles"-Zweige.
- Externe Freigabe existiert als `ExternalShareLink` (Token-Links) — internes
  Teilen ist neu und getrennt.
- Fehlerkonvention: `IllegalAccessError` bei Zugriffsverletzung,
  `NoSuchElementException` wenn Entität fehlt/als „nicht vorhanden" behandelt wird.

## Goals / Non-Goals

**Goals:**
- CONSULTANT: eigene Dokumente/Ordner anlegen & nur eigene sehen.
- ADMIN teilt einzelne Dokumente lesend mit einem Nutzer.
- Download-Zugriffsleck schließen; Zugriffslogik zentralisieren.

**Non-Goals:**
- Kein Schreibrecht über Freigaben, keine Ordner-Freigabe, keine Gruppen (v1).
- Keine Änderung an externen `ExternalShareLink`.
- Kein Portalzugriff für CLIENT; Nutzerverwaltung/Einstellungen bleiben ADMIN.

## Decisions

**1. „Sieht alles" = nur ADMIN.**
Für die Sichtbarkeits-Scopes wird die Staff-Prüfung auf `isAdmin(user)`
umgestellt (CONSULTANT fällt in den Owner-Zweig). Umsetzung: separate
`isAdmin`-Prüfung statt `isStaff` in `DocumentService`/`FolderService`-
Listungen. Bestehende owner-basierte Queries werden dadurch für CONSULTANT aktiv.

**2. Neue Entität `DocumentShare` + Liquibase-Migration.**
Tabelle `document_shares` (`id`, `document_id` FK, `user_id` FK (grantee),
`granted_by` FK, `created_at`), Unique auf (`document_id`,`user_id`). Repository
mit `findByUser`, `existsByDocumentAndUser`, `findByDocument`. Kaskade: beim
Löschen eines Dokuments werden zugehörige Shares entfernt.

**3. Zentrale `canAccess(user, doc)`.**
Eine Methode in `DocumentService`: `isAdmin || doc.uploadedBy == user ||
shareRepo.existsByDocumentAndUser(doc, user)`. Wird in `getById`, `download`,
`updateDescription`, `move`, `delete` erzwungen; Liste = eigene ∪ geteilte.
Schreibende Aktionen verlangen zusätzlich `isAdmin || Eigentümer` (Freigabe ist
read-only). Der Download nutzt künftig `canAccess` statt des ungeprüften
`getDocumentById`.

**4. Endpunkte für internes Teilen (ADMIN-only).**
`POST /api/documents/{id}/share` (Body `userId`), `DELETE …/share/{userId}` bzw.
`…/share?userId=`. `@PreAuthorize("hasRole('ADMIN')")` methodenscharf, obwohl der
Controller künftig ADMIN+CONSULTANT erlaubt. Activity-Log `SHARE`/`UNSHARE`.

**5. „Mit mir geteilt" als eigene Liste.**
`GET /api/documents/shared-with-me` → `shareRepo.findByUser(user)` → DTOs. Frontend
zeigt sie als separate Sektion; die fremde Ordnerstruktur wird NICHT offengelegt
(geteilte Docs erscheinen flach, nicht im Ordnerbaum des Eigentümers).

**6. Zugriffsöffnung im Security-Layer.**
`SecurityConfig` und `DocumentController`/`FolderController`-`@PreAuthorize`:
`/api/documents/**`, `/api/folders/**` → `hasAnyRole('ADMIN','CONSULTANT')`.
`/api/portal/**` bleibt ADMIN (Nutzerverwaltung); `/api/shares/**` bleibt ADMIN.
Frontend: Portal-Dokumentroute auf ADMIN,CONSULTANT; Users/Settings ADMIN-only.

## Risks / Trade-offs

- [Zugriffsprüfung an vielen Stellen — eine Lücke = Leak] → genau EINE
  `canAccess`-Methode, an allen Pfaden aufgerufen; Backend-Tests je Pfad
  (insb. Download-Regression).
- [CONSULTANT bekam bisher Team-Sicht (sieht alles) — Verhaltensänderung] →
  bewusst; bestehende Consultant-Nutzung im Portal ist faktisch nicht existent
  (Portal war ADMIN-only). In der Spec als MODIFIED dokumentiert.
- [Ordner-Sicht für geteilte Dokumente] → v1 zeigt geteilte Docs flach („Mit mir
  geteilt"), nicht im Ordnerkontext; vermeidet Offenlegung fremder Ordnerbäume.
- [DB-Migration] → additive Tabelle, kein Backfill; unkritisch.

## Open Questions

- Sollen Consultants ihre eigenen Dokumente auch extern freigeben dürfen
  (`ExternalShareLink`)? v1: nein (ADMIN-only), als möglicher Folge-Change.

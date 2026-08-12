## 1. Datenmodell & Migration

- [x] 1.1 Liquibase-Changelog `020-groups-folder-shares.xml`: `user_groups`, `user_group_members` (PK), `folder_shares` (zwei nullable FKs `shared_with_user`/`shared_with_group` statt polymorphem principal; Unique je Ordner/Nutzer bzw. Ordner/Gruppe); in master.xml eingebunden.
- [x] 1.2 Domain: `UserGroup` (+ `@ManyToMany` Mitglieder), `FolderShare` (`SharePermission` READ|WRITE), Enum `SharePermission`. Ersteller-Felder unverändert genutzt.
- [x] 1.3 Repositories: `UserGroupRepository` (existsByName, findByName, findByMembersContains), `FolderShareRepository` (findByFolder, findByFolderAndSharedWith*, deleteByFolder/Group).

## 2. Zentrale Autorisierung (zuerst, mit Tests)

- [x] 2.1 `PortalAccessService.effectivePermission(user, folder)` via Vorfahren-Walk: FULL (ADMIN/Eigentum an Ordner/Vorfahr), sonst Union aus Nutzer-/Gruppen-`FolderShare` auf Ordner **oder** Vorfahr.
- [x] 2.2 Abgeleitete Regeln: `canRead`, `canWrite`, `canDeleteFolder` (== FULL; „eigene erstellte" ⇒ Owner ⇒ FULL), `canMoveFolder`, `canReadDocument`, `canUpdateDocumentContent`, `canModifyDocument` (FULL oder uploadedBy==user).
- [~] 2.3 Gruppen je `effectivePermission`-Aufruf einmal geladen. Request-Cache + rekursive CTE als Performance-Optimierung **bewusst zurückgestellt** (Design-Trade-off).
- [x] 2.4 **Unit-Test-Matrix** `PortalAccessServiceTest` (16 Tests, grün): ADMIN/Eigentum/Vorfahr-Eigentum/User-Share/Gruppen-Share/Union/Vererbung/Löschen-Wurzel-vs-eigen/Move/Dokument update-vs-delete.

## 3. Gruppen (Backend)

- [x] 3.1 `GroupService` + `GroupController` (`/api/groups`): CRUD (ADMIN-only), Name nicht-leer/eindeutig.
- [x] 3.2 Mitglieder: hinzufügen/entfernen/auflisten (`/api/groups/{id}/members`), nur ADMIN/CONSULTANT als Mitglied (kein CLIENT).
- [x] 3.3 Gruppe löschen entfernt Mitgliedschaften **und** an die Gruppe gebundene `folder_shares`.

## 4. Ordner-Freigaben (Backend)

- [x] 4.1 `FolderShareController` + `FolderShareService` (`/api/folders/{id}/shares`): anlegen (Ziel userId|groupId, permission READ|WRITE), auflisten, widerrufen — ADMIN-only; Upsert je (Ordner, Ziel); Activity-Log SHARE/UNSHARE FOLDER.
- [x] 4.2 Widerruf/Ordner-Löschen räumt zugehörige `folder_shares` ab (deleteByFolder in Rekursion; FK-Cascade in DB).

## 5. Services/Controller auf zentrale Prüfung umstellen

- [x] 5.1 `FolderService`: `canWrite` für Unterordner-Anlage; `canDeleteFolder`/`canMoveFolder` für Löschen/Umbenennen/Verschieben; Listing = eigene Roots **plus** geteilte virtuelle Roots; Unterordner/getFolderById über `canRead`.
- [x] 5.2 `DocumentService`: Upload über `canWrite`; Sichtbarkeit/Download über `canReadDocument` (folder-vererbt, inkl. `DocumentShare`); Löschen über `canModifyDocument`.
- [x] 5.3 `PUT /api/documents/{id}/content` (Inhalt ersetzen) mit `canUpdateDocumentContent`; `fileSize`/`contentType`/`updatedAt` aktualisiert, Activity-Log UPDATE.
- [x] 5.4 Verstreute `canAccess`-Prüfungen durch `PortalAccessService` ersetzt (Folder-/DocumentService); bestehende Service-Tests darauf umgestellt (grün).
- [x] 5.5 `FolderDto.shared`-Flag (Ordner hat Freigaben) — Detail-Freigaben über `GET /api/folders/{id}/shares`.
- [x] 5.6 Aktivitätsprotokoll: Ordner-Operationen (CREATE/RENAME/MOVE/DELETE, Typ `FOLDER`) + Datei-Aktualisierung (UPDATE/DOCUMENT). Verwaiste Dateien bleiben außen vor.

## 6. Frontend

- [ ] 6.1 Freigabe-Dialog erweitern: Ziel Nutzer **oder** Gruppe wählbar, Berechtigung READ/WRITE; bestehende Freigaben anzeigen/widerrufen (ADMIN).
- [ ] 6.2 Gruppen-Verwaltungs-UI (ADMIN): Gruppen CRUD + Mitglieder.
- [ ] 6.3 Ordneransicht: geteilte Ordner als virtuelle Roots anzeigen und navigieren; Datei-Sichtbarkeit folgt dem Ordner; geteilte Ordner **auch im realen Pfad** als „geteilt" markieren (Badge/Icon + Freigabe-Info).
- [ ] 6.4 „Datei aktualisieren"-Aktion (Inhalt ersetzen) für berechtigte Nutzer; Upload/Anlegen in geteilten WRITE-Ordnern; Lösch-/Umbenennen-Aktionen nur für eigene Elemente einblenden.
- [ ] 6.5 `npm --prefix src/main/frontend run test:run` + `build` grün.

## 7. Verifikation

- [ ] 7.1 `./mvnw test` grün (inkl. Autorisierungs-Matrix aus 2.4).
- [ ] 7.2 End-to-End (Dev): Ordner an Gruppe WRITE teilen; Mitglied hinzufügen → sofortiger Zugriff; hochladen/aktualisieren/Unterordner anlegen; fremde Datei/Ordner löschen wird verweigert; eigene löschen erlaubt; Widerruf entzieht den Teilbaum.
- [ ] 7.3 READ-Freigabe: nur lesen/download, keine Schreibaktion.
- [ ] 7.4 Regression: Owner/ADMIN behalten volle Kontrolle; CLIENT weiterhin kein Portalzugriff.

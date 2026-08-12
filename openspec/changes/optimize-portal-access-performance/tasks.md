## 1. Zugriffs-Kontext im PortalAccessService

- [x] 1.1 `AccessContext` (intern) mit `admin`, `userId`, `groupIds`, `Map<String, AccessLevel> shareByFolderId`.
- [x] 1.2 `contextFor(User)`: Gruppen einmal (`findByMembersContains`), Freigaben einmal (`findBySharedWithUserOrSharedWithGroupIn(user, groups)`) → `shareByFolderId` (max READ/WRITE je Ordner-ID).
- [x] 1.3 `effectivePermission(AccessContext, Folder)`: Vorfahren-Walk gegen `shareByFolderId` (FULL bei ADMIN/Eigentum, sonst Union) — **keine** Freigabe-/Gruppen-Queries.
- [x] 1.4 Bestehende Einzel-Methoden (`effectivePermission(user,folder)`, `canRead/canWrite/canDeleteFolder/canMoveFolder/canReadDocument/canUpdateDocumentContent/canModifyDocument`) bauen intern `contextFor(user)` und delegieren — Verhalten unverändert.

## 2. FolderService auf Kontext umstellen

- [x] 2.1 `getRootFolders`/`getSubFolders`: einen `AccessContext` je Aufruf bauen; `mapToDto(folder, ctx)` durchreichen; `canWrite` über den Kontext bestimmen.
- [x] 2.2 `shared`-Flag ohne `findByFolder` je Ordner: gebündelte Repo-Abfrage `findByFolderIn(folders)` (Set der geteilten Ordner-IDs), Flag daraus setzen.

## 3. Tests

- [x] 3.1 Verhaltens-Invarianz: für die volle Matrix (Eigentum/ADMIN/User-Share/Gruppen-Share/Union/Vererbung) liefert die Kontext-Auswertung dasselbe wie die Einzelprüfung. Bestehende `PortalAccessServiceTest` bleibt grün.
- [x] 3.2 Query-Count-Guard: `PortalAccessServiceTest` „Batching" — ein Kontext, drei Ordner-Bewertungen; `verify(times(1))` auf `findByMembersContains`/`findBySharedWithUserOrSharedWithGroupIn` + `verifyNoMoreInteractions` beweist, dass Freigaben/Gruppen je Anfrage **einmal** geladen werden (Service-Ebene statt Hibernate-Statistics — einfacher, gleiche Invariante).

## 4. Verifikation

- [x] 4.1 `./mvnw test` grün (inkl. neuer Tests).
- [x] 4.2 Kurz-Check: Ordnerlisten-Endpunkte liefern unveränderte Ergebnisse (`canWrite`/`shared`) — ggf. per API-Stichprobe gegen die laufende App.

## Context

`PortalAccessService.effectivePermission(user, folder)` (aktuell):
1. `isAdmin` → FULL.
2. `userGroupRepository.findByMembersContains(user)` — **1 Query pro Aufruf**.
3. Vorfahren-Walk: pro Ordner `folderShareRepository.findByFolder(cursor)` — **D Queries** — plus Lazy-Load von `getParentFolder()`.

`FolderService.mapToDto` ruft `access.canWrite` (→ `effectivePermission`) **je Ordner** und zusätzlich `findByFolder` für das `shared`-Flag. In einer Liste von M Ordnern: **O(M × (1 + D))** Queries. Verhalten ist korrekt und durch die 16er-Matrix abgedeckt — nur die Query-Zahl ist das Problem.

## Goals / Non-Goals

**Goals:**
- Gruppen und Freigaben des Nutzers je Anfrage **einmal** laden.
- Ordner-Bewertung ohne weitere Freigabe-/Gruppen-Queries.
- **Bit-für-Bit identisches** Berechtigungsergebnis (Regression-safe).

**Non-Goals:**
- Keine Änderung der Berechtigungssemantik, API oder des Schemas.
- Kein Frontend-Change.
- CTE gegen Vorfahren-Lazy-Loads bleibt optional (separat).

## Decisions

- **`AccessContext` je Anfrage.** `PortalAccessService.contextFor(user)` baut einmalig:
  - `admin` (Rollencheck),
  - `groupIds` (aus `findByMembersContains`),
  - `shareByFolderId`: `Map<String, AccessLevel>` aus **einer** Abfrage
    `folderShareRepository.findBySharedWithUserOrSharedWithGroupIn(user, groups)`
    (Query existiert bereits), reduziert je Ordner auf max(READ/WRITE).
  `effectivePermission(ctx, folder)` walkt die Vorfahren: FULL bei ADMIN/Eigentum,
  sonst Union aus `ctx.shareByFolderId.get(ancestorId)`. **Null** Freigabe-/Gruppen-Queries.
- **Bestehende Einzel-API bleibt.** `canRead/canWrite/canDeleteFolder/…(user, folder)`
  bauen intern `contextFor(user)` und delegieren — unverändertes Verhalten,
  minimaler Overhead für Einzelprüfungen (Dokument-Checks im `DocumentService`).
- **`FolderService` nutzt einen gemeinsamen Kontext** pro Listen-Aufruf
  (`getRootFolders`/`getSubFolders`), an `mapToDto(folder, ctx)` durchgereicht;
  auch das `shared`-Flag kann über die vorhandenen Share-Daten bzw. eine gebündelte
  Abfrage bestimmt werden statt `findByFolder` je Ordner.
- **`DocumentService`** bleibt bei den Einzel-Methoden (ein Dokument je Aufruf) —
  hier ist der Kontext-Overhead vernachlässigbar.

## Risks / Trade-offs

- **Verhaltensabweichung durch Refactor** → Regressionstest „Kontext == Einzelprüfung"
  über die volle Matrix; bestehende `PortalAccessServiceTest` bleibt maßgeblich.
- **Vorfahren-Lazy-Loads bleiben** (Walk über `getParentFolder`) → für tiefe Bäume
  weiterhin D Loads je Ordner; dominanter Kostenfaktor (Freigabe/Gruppen-Queries)
  ist aber eliminiert. CTE als Folgeoption dokumentiert.
- **`shared`-Flag-Bündelung** darf keine Freigaben übersehen (auch fremde Ziele) →
  eigene gebündelte Abfrage „hat Ordner X Freigaben?" statt der nutzerbezogenen Map.

## Migration Plan

1. `AccessContext` + `contextFor(user)` + `effectivePermission(ctx, folder)` einführen; Einzel-Methoden darauf umstellen.
2. `FolderService` auf gemeinsamen Kontext je Liste umstellen; `shared`-Flag gebündelt.
3. Tests: Verhaltens-Invarianz + Query-Count-Guard (Hibernate `Statistics`), bestehende Matrix grün.
4. `./mvnw test` grün.

## Open Questions

- Query-Count-Guard: Hibernate-`Statistics` im Test aktivieren (session-factory) vs. ein leichter Datasource-Proxy — Hibernate-Statistics bevorzugt (kein Zusatz-Dependency).
- `shared`-Flag: eine `findByFolderIn(folders)`-Sammelabfrage ergänzen (Repo-Methode) für die Listen-Kennzeichnung.

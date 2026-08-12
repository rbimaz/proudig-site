## Why

Der Datenaustausch im Portal kann heute nur **einzelne Dateien read-only** intern teilen (`DocumentShare`). Gefordert ist: **ganze Ordner** an **mehrere Personen** mit **READ oder WRITE** freigeben, wirkend auf den gesamten Teilbaum — und um nicht 10 Einzelfreigaben zu pflegen, **Gruppen**. Umsetzung als Eigenbau im bestehenden Portal (bewusstes Interim; NextCloud ist geparkt und würde das später ablösen).

## What Changes

- **Interne Ordner-Freigabe** (`READ` | `WRITE`) an **einzelne Nutzer und an Gruppen**, ADMIN-only. Wirkt auf den **gesamten Teilbaum** (inkl. später hinzugefügter Inhalte); Widerruf entzieht den ganzen Teilbaum.
- **Gruppen** (neues Konzept): ADMIN legt benannte Gruppen an und weist Portal-Nutzer (ADMIN/CONSULTANT) zu; eine Freigabe an die Gruppe wirkt für alle Mitglieder, Mitgliederänderung wirkt sofort.
- **WRITE-Semantik (max = Schreiben, nicht „Owner")**: browsen/download + neue Dateien hochladen + Unterordner anlegen + **vorhandene Dateien aktualisieren (auch fremde)**. **Löschen/Umbenennen/Verschieben nur für selbst erstellte** Elemente und **nur innerhalb** des geteilten Teilbaums. Der geteilte Wurzelordner und fremde/vorhandene Ordner sind **geschützt**.
- **Zentrale, rekursive Autorisierung** `canRead`/`canWrite` über den Ordner-Teilbaum (Vererbung), **Union** (großzügigste Berechtigung gewinnt) über Ownership/ADMIN/Gruppen-/Nutzer-Freigaben. Sicherheitskritisch → in einem einzigen, getesteten Modul gebündelt.
- **Datei-Sichtbarkeit folgt dem Ordner**: geteilte Ordner erscheinen beim Empfänger als **virtuelle Roots** und sind navigierbar; enthaltene Dateien werden über den Ordner sichtbar.
- **Neue Operation „Datei aktualisieren"** (Inhalt einer vorhandenen Datei ersetzen).
- **BREAKING (Verhalten)**: Eine WRITE-Ordner-Freigabe berechtigt jetzt zu Schreibaktionen — die bisherige Regel „eine Freigabe berechtigt NICHT zum Ändern" gilt nur noch für reine READ-Freigaben.

## Capabilities

### New Capabilities
- `portal-groups`: Verwaltung benannter Nutzergruppen (ADMIN-only): anlegen, umbenennen, löschen, Mitglieder zuordnen/entfernen.
- `portal-folder-sharing`: Interne Ordner-Freigaben mit READ/WRITE an Nutzer/Gruppen, Vererbung auf den Teilbaum, zentrale rekursive Zugriffsprüfung (Union), virtuelle Roots, WRITE-Operationsregeln, Widerruf.

### Modified Capabilities
- `portal-folders`: Unterordner anlegen / eigene Elemente löschen/verschieben auch als WRITE-Empfänger (nicht nur Owner/ADMIN); Navigation zeigt geteilte Teilbäume.
- `portal-documents`: Upload in per-WRITE geteilte Ordner; zentrale Zugriffsprüfung berücksichtigt Ordner-Freigaben (READ/WRITE); neue Datei-Aktualisieren-Operation.

## Impact

- **Backend (`de.proudig.site`):**
  - Neu: `domain/UserGroup` (+ Mitgliedschaft), `domain/FolderShare` (folder ↔ Nutzer|Gruppe, `permission` READ|WRITE); Repos; `service/GroupService`; **zentrales `service/PortalAccessService`** (rekursives `canRead`/`canWrite`/`effectivePermission` über Ordner-Vorfahren + Nutzer/Gruppen-Shares, Union); Controller `GroupController`, `FolderShareController`.
  - Geändert: `FolderService`/`DocumentService` (Enforcement über `PortalAccessService`; Unterordner/Upload/Update/Delete-own), `FolderController`/`DocumentController` (Freigabe-fähige Endpunkte, virtuelle Roots, Datei-Update), `DocumentService.canAccess` erweitert.
  - Liquibase: neue Tabellen `user_groups`, `user_group_members`, `folder_shares`.
- **Frontend (`src/main/frontend/src/pages/portal`):** neuer/erweiterter Freigabe-Dialog (Ziel: Nutzer **oder** Gruppe, READ/WRITE), Gruppen-Verwaltungs-UI (ADMIN), Anzeige geteilter Ordner (virtuelle Roots), „Datei aktualisieren"-Aktion. `PortalDocuments.jsx`, `InternalShareDialog.jsx`, `FolderTreeContext.jsx`.
- **Nicht-Ziele:** Kein Portal-Zugriff für `CLIENT` (Kunden kommen über NextCloud, spätere Phase) — kein Umbau des Portal-Zugriffsmodells. Keine externen Link-Freigaben-Änderungen. Kein NextCloud. Keine Versionierung/History der Datei-Aktualisierung (nur Ersetzen).
- **Interim-Hinweis:** Bei späterer NextCloud-Einführung (P2) wird dieses Modul abgelöst (P5-Rückbau).

## Context

Ist-Zustand (kartiert): Ordner (`Folder`, `owner`, `parentFolder`) und Dokumente
(`Document`, `uploadedBy`, `folder`) mit **eigentümer-basierter** Zugriffskontrolle;
Personal (ADMIN/CONSULTANT) sieht alle Ordner (Team-Baum), CLIENT ist vom Portal
ausgeschlossen. Internes Teilen nur **pro Datei, read-only** (`DocumentShare`).
Keine Ordner-Freigaben (intern), keine Vererbung, kein Gruppen-Konzept. Zugriff
wird verstreut in `FolderService`/`DocumentService` geprüft.

Ziel: interne **Ordner-Freigaben READ/WRITE an Nutzer und Gruppen** mit Vererbung
auf den Teilbaum. Entscheidungen (bestätigt): Eigenbau (Interim), Gruppen +
Einzelnutzer, WRITE kollaborativ (vorhandene auch fremde aktualisieren; löschen/
umbenennen/verschieben nur eigene), ADMIN-only Freigabe, nur interne Nutzer.

## Goals / Non-Goals

**Goals:**
- Ordner-ACL mit Vererbung + Gruppen; eine **zentrale, getestete** Autorisierung.
- Additive Freigaben (Union) ohne das bestehende Owner/Personal-Modell zu brechen.
- Präzise WRITE-Semantik (max = Schreiben, kein Löschen der Struktur/fremder Elemente).

**Non-Goals:**
- Kein CLIENT/Portal-Zugriffsumbau (Kunden → NextCloud, später).
- Keine Versionierung/History beim Datei-Aktualisieren (nur Ersetzen).
- Kein NextCloud; keine Änderung an externen Link-Freigaben.
- **Keine Bereinigung verwaister physischer Dateien** (bestehende Lücke bleibt).

## Decisions

- **Datenmodell.** Neu: `UserGroup(id, name unique, createdBy, createdAt)` +
  `user_group_members(group_id, user_id)`; `FolderShare(id, folder_id,
  permission READ|WRITE, principal_type USER|GROUP, principal_id, sharedBy,
  createdAt)` mit Unique `(folder_id, principal_type, principal_id)`. Ersteller
  sind bereits vorhanden (`Document.uploadedBy`, `Folder.owner`) → „eigene löschen"
  ist ohne Modelländerung prüfbar.
- **Zentrales `PortalAccessService`.** Einzige Quelle der Wahrheit:
  `effectivePermission(user, folder) → {NONE, READ, WRITE, FULL}` via **Walk der
  Vorfahrenkette**: FULL bei ADMIN/Eigentum; sonst Max (Union) aus READ (Personal-
  Team-Sicht) und allen Nutzer-/Gruppen-`FolderShare` auf dem Ordner **oder einem
  Vorfahren**. Abgeleitet: `canRead`, `canWrite` (upload/create/update),
  `canDeleteFolder(user, folder)` = FULL **oder** (WRITE-im-Teilbaum **und**
  `folder.owner == user`), analog `canDeleteDocument` = FULL **oder** (WRITE
  **und** `doc.uploadedBy == user`). Alle Services rufen nur dieses Modul.
- **Sichtbarkeit folder-vererbt.** Datei-Sichtbarkeit folgt dem Ordner (nicht
  `uploadedBy`). Listing: eigene/Personal-Roots **plus** freigegebene Ordner als
  **virtuelle Roots**; Kinder/Dokumente werden über `canRead` gefiltert.
- **Precedence = Union.** Großzügigste gewinnt; READ + WRITE ⇒ WRITE; Eigentum/
  ADMIN ⇒ FULL. Widerruf/Gruppenaustritt entzieht nur die betroffene Quelle.
- **Koexistenz.** Bestehende `DocumentShare` (pro-Datei READ) bleibt und fließt in
  `canRead` ein; keine Migration nötig.
- **Datei aktualisieren** als eigener Endpunkt (`PUT …/content`), getrennt vom
  bestehenden Beschreibungs-`PUT` (das nur Metadaten ändert).

## Risks / Trade-offs

- **Autorisierung ist sicherheitskritisch** (rekursiver Vorfahren-Walk, Union,
  eigene-vs-fremde) → in **einem** Modul bündeln, mit umfangreichen Unit-Tests
  (Matrix: Rolle × Quelle × Aktion × eigen/fremd × Wurzel/Teil). Kein Enforcement
  in Controllern duplizieren.
- **Performance des Vorfahren-Walks** (N Queries pro Prüfung, Listing vieler
  Ordner) → Vorfahrenkette effizient laden (ein Query je Ordner-Pfad bzw.
  rekursive CTE) und Gruppen-Mitgliedschaft des Nutzers je Request einmal cachen.
- **„Verschieben" über Berechtigungsgrenzen** kann Sichtbarkeit unerwartet ändern
  → Move nur innerhalb desselben Berechtigungsbereichs (eigener Baum bzw. derselbe
  WRITE-Teilbaum), Zyklus-Schutz bleibt.
- **Verwaiste Dateien** beim rekursiven Löschen (bestehendes Verhalten) → unverändert
  übernehmen; separat adressierbar.
- **Interim**: Wird bei NextCloud (P2) abgelöst → Modul klein und gekapselt halten,
  damit der spätere Rückbau (P5) einfach ist.

## Migration Plan

1. Liquibase: `user_groups`, `user_group_members`, `folder_shares`.
2. `PortalAccessService` + Tests zuerst (autoritatives Modell), dann Services/
   Controller darauf umstellen; bestehende `canAccess`-Prüfungen ersetzen.
3. Frontend: Freigabe-Dialog (Nutzer/Gruppe + READ/WRITE), Gruppen-UI, virtuelle
   Roots, „Datei aktualisieren".
4. `./mvnw test` + `npm --prefix src/main/frontend run test:run` grün.

## Resolved (vormals offene Fragen)

- **Verwaiste physische Dateien:** bleiben **außen vor** (bestehende Lücke wird in
  diesem Change nicht adressiert) → siehe Non-Goals.
- **Sichtbarkeit geteilter Ordner:** geteilte Ordner erscheinen als virtuelle
  Roots **und** werden **zusätzlich innerhalb ihres realen Pfads als „geteilt"
  markiert** (Kennzeichnung im DTO/UI, wo der Ordner ohnehin sichtbar ist).
- **Aktivitätsprotokoll:** **Ordner-Operationen** (anlegen/umbenennen/löschen/
  verschieben) **und Datei-Aktualisierungen** werden protokolliert (zusätzlich zu
  den bereits geloggten Freigabe-Erstellungen/-Widerrufen).

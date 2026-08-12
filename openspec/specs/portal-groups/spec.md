# portal-groups Specification

## Purpose
TBD - created by archiving change portal-folder-sharing-groups. Update Purpose after archive.
## Requirements
### Requirement: Gruppen verwalten (ADMIN)

Das Portal SHALL einem `ADMIN` erlauben, benannte Nutzergruppen zu verwalten:
anlegen (`POST /api/groups`, `{name}`), umbenennen (`PUT /api/groups/{id}`),
löschen (`DELETE /api/groups/{id}`) und auflisten (`GET /api/groups`). Der
Gruppenname MUSS nicht-leer und innerhalb des Portals eindeutig sein. Nur `ADMIN`
SHALL Gruppen verwalten dürfen; andere Rollen erhalten HTTP 403.

#### Scenario: Gruppe anlegen
- **WHEN** ein `ADMIN` eine Gruppe mit nicht-leerem, eindeutigem Namen anlegt
- **THEN** wird die Gruppe erstellt und zurückgegeben

#### Scenario: Leerer oder doppelter Name abgelehnt
- **WHEN** ein `ADMIN` eine Gruppe ohne Namen oder mit bereits vergebenem Namen anlegt
- **THEN** wird die Anlage mit einem Validierungsfehler (HTTP 400) abgelehnt

#### Scenario: Nur ADMIN
- **WHEN** ein `CONSULTANT` einen Gruppen-Endpunkt aufruft
- **THEN** wird der Zugriff mit HTTP 403 abgewiesen

### Requirement: Gruppenmitglieder verwalten (ADMIN)

Das Portal SHALL einem `ADMIN` erlauben, Portal-Nutzer (Rolle `ADMIN` oder
`CONSULTANT`) einer Gruppe zuzuordnen und zu entfernen
(`POST`/`DELETE /api/groups/{id}/members`, Ziel-`userId`) sowie die Mitglieder
aufzulisten (`GET /api/groups/{id}/members`). Änderungen der Mitgliedschaft SHALL
**sofort** auf alle Freigaben wirken, die an die Gruppe vergeben sind. Ein Nutzer
mit Rolle `CLIENT` SHALL nicht Mitglied werden können.

#### Scenario: Mitglied hinzufügen wirkt auf Freigaben
- **WHEN** ein `ADMIN` einen Nutzer einer Gruppe hinzufügt, der ein Ordner freigegeben ist
- **THEN** erhält der Nutzer denselben Zugriff auf den Ordner-Teilbaum wie die Gruppe (ohne dass die Freigabe geändert wird)

#### Scenario: Mitglied entfernen entzieht Zugriff
- **WHEN** ein `ADMIN` einen Nutzer aus einer Gruppe entfernt
- **THEN** verliert der Nutzer den ausschließlich über diese Gruppe gewährten Zugriff

#### Scenario: CLIENT nicht als Mitglied
- **WHEN** ein `ADMIN` einen `CLIENT` einer Gruppe hinzufügen will
- **THEN** wird dies abgelehnt (HTTP 400)

### Requirement: Gruppe löschen räumt Freigaben ab

Beim Löschen einer Gruppe SHALL das Portal die Gruppen-Mitgliedschaften und alle
**Freigaben, die an diese Gruppe** vergeben wurden, entfernen. Zugriffe, die
Mitglieder über andere Wege (Ownership, Einzel-Freigabe, andere Gruppe) haben,
SHALL unberührt bleiben.

#### Scenario: Löschen entfernt Gruppen-Freigaben
- **WHEN** ein `ADMIN` eine Gruppe löscht, der Ordner freigegeben waren
- **THEN** werden die an die Gruppe gebundenen Freigaben entfernt und die Mitglieder verlieren den nur darüber gewährten Zugriff

#### Scenario: Anderweitiger Zugriff bleibt
- **WHEN** ein Mitglied denselben Ordner zusätzlich als Einzel-Freigabe erhalten hat
- **THEN** bleibt dieser Einzel-Zugriff nach dem Löschen der Gruppe erhalten


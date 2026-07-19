# portal-activity-log Specification

## Purpose
Serverseitige Protokollierung sicherheitsrelevanter Portal-Aktionen (Upload,
Löschen, Freigabe, Widerruf) und administrativer, paginierter und filterbarer
Abruf des Protokolls über einen ADMIN-only-Endpoint.

## Requirements
### Requirement: Portal-Aktionen protokollieren
Das Portal SHALL sicherheitsrelevante Aktionen serverseitig protokollieren. Ein
Eintrag enthält Benutzer, Aktion, Entitätstyp, Entitäts-ID, Details und
Zeitstempel. Protokolliert werden im Portal: Dokument-Upload (`UPLOAD`),
Dokument-Löschung (`DELETE`), Freigabe (`SHARE`) und Freigabe-Widerruf
(`UNSHARE`), jeweils mit Entitätstyp `DOCUMENT`. Ersetzt `LOG-001`, `LOG-003`.

Hinweis (Ist-Zustand): Ein **Download wird nicht protokolliert** (anders als
`LOG-002`). Das Löschen eines Ordners erzeugt ebenfalls keinen Eintrag.

#### Scenario: Upload wird protokolliert
- **WHEN** ein Benutzer ein Dokument hochlädt
- **THEN** wird ein Aktivitätseintrag mit Aktion `UPLOAD` und Entitätstyp `DOCUMENT` gespeichert

#### Scenario: Download wird nicht protokolliert
- **WHEN** ein Benutzer ein Dokument herunterlädt
- **THEN** wird kein Aktivitätseintrag erzeugt

### Requirement: Administrativer Abruf des Aktivitätsprotokolls
Das Portal SHALL den Abruf des Aktivitätsprotokolls über
`GET /api/admin/activity` ausschließlich Benutzern mit der Rolle `ADMIN`
erlauben. Die Ergebnisse sind seitenweise (`Pageable`) und nach Erstellzeitpunkt
absteigend sortiert. Optional kann nach `userId` oder Entitätstyp (`type`)
gefiltert werden. Ersetzt `LOG-004`.

#### Scenario: Administrator ruft Protokoll ab
- **WHEN** ein Administrator `GET /api/admin/activity` ohne Filter aufruft
- **THEN** wird eine paginierte, absteigend nach Zeit sortierte Liste zurückgegeben

#### Scenario: Nicht-Administrator wird abgewiesen
- **WHEN** ein Benutzer ohne ADMIN-Rolle den Endpoint aufruft
- **THEN** wird der Zugriff durch die Rollenprüfung (`hasRole('ADMIN')`) verweigert

#### Scenario: Filter nach Entitätstyp
- **WHEN** ein Administrator den Parameter `type=DOCUMENT` übergibt
- **THEN** enthält die Antwort nur Einträge dieses Entitätstyps


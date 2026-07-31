## RENAMED Requirements

- FROM: `### Requirement: Dokumentenportal nur für ADMIN`
- TO: `### Requirement: Portalzugriff — Dokumente/Ordner für ADMIN und CONSULTANT`

## MODIFIED Requirements

### Requirement: Portalzugriff — Dokumente/Ordner für ADMIN und CONSULTANT

Der Zugriff auf die Dokument- und Ordner-Endpunkte des Portals (`/api/documents`,
`/api/folders`) SHALL Benutzern mit Rolle `ADMIN` **oder** `CONSULTANT` gestattet
sein. Nutzerverwaltung (`/api/users`, `/api/portal/users`), Einstellungen und
externe Freigaben (`/api/shares`) SHALL weiterhin ausschließlich `ADMIN`
vorbehalten sein. Benutzer mit Rolle `CLIENT` SHALL keinen Portalzugriff erhalten.
Die Passwort-ändern-Funktion SHALL für jeden authentifizierten Benutzer erreichbar
bleiben.

#### Scenario: Consultant öffnet den Dokumentbereich

- **WHEN** ein Benutzer mit Rolle `CONSULTANT` das Portal-Dokumentmenü aufruft
- **THEN** werden die Dokument-/Ordner-Endpunkte für ihn beantwortet (gescoped auf
  eigene + geteilte Inhalte)

#### Scenario: Consultant hat keinen Zugriff auf Nutzerverwaltung/Einstellungen

- **WHEN** ein `CONSULTANT` `/api/users`, `/api/portal/users`, Einstellungen oder
  `/api/shares` aufruft
- **THEN** wird der Zugriff mit HTTP 403 abgewiesen

#### Scenario: Client bleibt ausgeschlossen

- **WHEN** ein Benutzer mit Rolle `CLIENT` einen Portal-Endpunkt aufruft
- **THEN** wird der Zugriff mit HTTP 403 abgewiesen

### Requirement: Eigene Dokumente auflisten

Das Portal SHALL Dokumente rollenabhängig auflisten. Ein `ADMIN` sieht als
Team-Sicht **alle** Dokumente, unabhängig vom Uploader. Ein `CONSULTANT` sieht
**ausschließlich die von ihm selbst hochgeladenen** Dokumente (nicht die anderer
Consultants oder Admins). Endpoints: `GET /api/documents` und
`GET /api/documents/folder/{folderId}` (ADMIN darf jeden Ordner öffnen, ein
CONSULTANT nur eigene). Mit einem CONSULTANT geteilte Dokumente werden separat
ausgewiesen (siehe „Mit mir geteilte Dokumente").

#### Scenario: Consultant sieht nur eigene Dokumente

- **WHEN** ein `CONSULTANT` die Dokumentenliste abruft
- **THEN** enthält die Antwort ausschließlich Dokumente, deren Eigentümer er ist
  (keine der anderer Benutzer)

#### Scenario: Admin sieht alle Dokumente

- **WHEN** ein `ADMIN` die Dokumentenliste abruft
- **THEN** enthält die Antwort alle Dokumente des Portals

#### Scenario: Consultant kann fremden Ordner nicht öffnen

- **WHEN** ein `CONSULTANT` `GET /api/documents/folder/{folderId}` für einen
  fremden Ordner abruft
- **THEN** wird der Zugriff mit `IllegalAccessError` abgewiesen

### Requirement: Dokument-Metadaten abrufen

Das Portal SHALL die Metadaten eines Dokuments über
`GET /api/documents/{documentId}` nur zurückgeben, wenn der Benutzer `ADMIN` ist,
**Eigentümer** ist oder das Dokument **mit ihm geteilt** wurde. Für einen
Benutzer ohne Zugriff verhält sich das Dokument als nicht vorhanden
(`NoSuchElementException`).

#### Scenario: Fremdes, nicht geteiltes Dokument nicht abrufbar

- **WHEN** ein `CONSULTANT` die Metadaten eines Dokuments abruft, das ihm weder
  gehört noch mit ihm geteilt wurde
- **THEN** wird „Document not found" gemeldet, selbst wenn das Dokument existiert

#### Scenario: Geteiltes Dokument abrufbar

- **WHEN** ein `CONSULTANT` die Metadaten eines mit ihm geteilten Dokuments abruft
- **THEN** werden die Metadaten zurückgegeben

### Requirement: Dokument herunterladen

Das Portal SHALL den Download über `GET /api/documents/{documentId}/download` nur
erlauben, wenn der Benutzer `ADMIN` ist, **Eigentümer** ist, das Dokument **mit
ihm geteilt** wurde ODER eine gültige externe Freigabe besitzt (siehe
`portal-sharing`). Andernfalls antwortet das Portal mit HTTP 403. Die
Zugriffsprüfung SHALL auch beim Download tatsächlich erzwungen werden (kein
ungeprüfter Abruf per ID).

#### Scenario: Eigentümer lädt herunter

- **WHEN** der Eigentümer den Download-Endpoint aufruft
- **THEN** wird die Datei als Resource zurückgegeben

#### Scenario: Consultant lädt geteiltes Dokument herunter

- **WHEN** ein `CONSULTANT` ein mit ihm geteiltes Dokument herunterlädt
- **THEN** wird die Datei als Resource zurückgegeben

#### Scenario: Kein Zugriff ohne Eigentum/Freigabe

- **WHEN** ein `CONSULTANT` ohne Eigentum und ohne Freigabe den Download eines
  fremden Dokuments aufruft
- **THEN** antwortet das Portal mit HTTP 403 (Forbidden)

## ADDED Requirements

### Requirement: Interne Dokument-Freigabe an einen Nutzer

Das Portal SHALL einem `ADMIN` erlauben, ein einzelnes Dokument lesend mit einem
Benutzer zu teilen bzw. die Freigabe zu widerrufen (`POST` bzw.
`DELETE /api/documents/{documentId}/share`, Body/Param: Ziel-`userId`). Die
Freigabe SHALL als Zuordnung Dokument ↔ Nutzer gespeichert werden (mit
`grantedBy`) und ist getrennt von externen Freigabe-Links. Nur `ADMIN` SHALL
teilen/widerrufen dürfen. Beide Aktionen SHALL im Aktivitätsprotokoll erfasst
werden.

#### Scenario: Admin teilt ein Dokument mit einem Consultant

- **WHEN** ein `ADMIN` `POST /api/documents/{id}/share` mit der `userId` eines
  Consultants aufruft
- **THEN** wird eine interne Freigabe angelegt und protokolliert; der Consultant
  kann das Dokument fortan sehen und herunterladen

#### Scenario: Widerruf entzieht den Zugriff

- **WHEN** ein `ADMIN` die Freigabe widerruft (`DELETE …/share`)
- **THEN** verliert der Consultant Sicht und Download des Dokuments

#### Scenario: Nur Admin darf teilen

- **WHEN** ein `CONSULTANT` versucht, ein Dokument zu teilen
- **THEN** wird die Anfrage mit HTTP 403 abgewiesen

### Requirement: „Mit mir geteilte" Dokumente

Das Portal SHALL einem Benutzer die mit ihm geteilten Dokumente in einer eigenen
Ansicht ausweisen, getrennt von seinen eigenen und unabhängig davon, in welchem
(fremden) Ordner sie physisch liegen.

#### Scenario: Consultant sieht geteilte Dokumente

- **WHEN** ein `CONSULTANT`, mit dem Dokumente geteilt wurden, die Ansicht „Mit
  mir geteilt" öffnet
- **THEN** werden genau diese Dokumente aufgelistet, ohne die fremde Ordner-
  struktur offenzulegen

### Requirement: Zentrale Zugriffsprüfung für Dokumente

Das Portal SHALL Dokument-Zugriffe über eine einzige Regel prüfen:
`canAccess(user, doc)` ist wahr, wenn der Benutzer `ADMIN` ist, Eigentümer ist
oder das Dokument mit ihm geteilt wurde. Diese Regel SHALL für Auflistung,
Metadaten, Download, Umbenennen, Verschieben und Löschen einheitlich angewandt
werden; schreibende Aktionen (Umbenennen/Verschieben/Löschen) SHALL zusätzlich
Eigentum bzw. `ADMIN` verlangen (eine reine Freigabe berechtigt NICHT zum Ändern).

#### Scenario: Geteiltes Dokument ist nur lesbar

- **WHEN** ein `CONSULTANT` versucht, ein nur mit ihm geteiltes (nicht eigenes)
  Dokument umzubenennen, zu verschieben oder zu löschen
- **THEN** wird die Aktion abgewiesen (kein Schreibzugriff durch Freigabe)

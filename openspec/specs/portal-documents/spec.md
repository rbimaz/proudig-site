# portal-documents Specification

## Purpose
Verwaltung von Dokumenten im Portal: Upload in das Dateisystem mit Metadaten in
der Datenbank, Auflistung, Metadaten-Abruf, Umbenennen (Beschreibung), Download
und Löschen — jeweils mit eigentümer-basierter Zugriffskontrolle. Freigaben an
andere Benutzer sind in `portal-sharing` spezifiziert.

## Requirements
### Requirement: Dokument hochladen
Das Portal SHALL authentifizierten Benutzern erlauben, eine Datei hochzuladen.
Die Datei wird im Dateisystem unter `data/files/documents/` abgelegt, die
Metadaten (Dateiname, Größe, Content-Type, optionaler Ordner, optionale
Beschreibung) werden in der Datenbank gespeichert. Der hochladende Benutzer wird
als Eigentümer (`uploadedBy`) hinterlegt. Endpoint: `POST /api/documents`
(multipart). Ersetzt `DOC-001`, `DOC-005`, `DOC-006`, `DOC-007`.

#### Scenario: Erfolgreicher Upload in Root-Ebene
- **WHEN** ein authentifizierter Benutzer eine Datei ohne `folderId` hochlädt
- **THEN** wird die Datei gespeichert und ein Dokument mit `folder = NULL` und dem Benutzer als Eigentümer angelegt

#### Scenario: Upload in fremden Ordner wird abgelehnt
- **WHEN** ein Benutzer eine Datei mit einer `folderId` hochlädt, deren Ordner einem anderen Benutzer gehört
- **THEN** wird der Upload mit einem Zugriffsfehler (`IllegalAccessError`) abgewiesen

### Requirement: Eigene Dokumente auflisten
Das Portal SHALL einem Benutzer nur die von ihm selbst hochgeladenen Dokumente
auflisten. Endpoints: `GET /api/documents` (alle eigenen) und
`GET /api/documents/folder/{folderId}` (eigene je Ordner). Ersetzt `DOC-005`,
`PORT-PERM-002` (eigener Anteil; freigegebene Dokumente siehe `portal-sharing`).

#### Scenario: Nur eigene Dokumente sichtbar
- **WHEN** ein Benutzer die Dokumentenliste abruft
- **THEN** enthält die Antwort ausschließlich Dokumente, deren Eigentümer er ist

### Requirement: Dokument-Metadaten abrufen
Das Portal SHALL nur dem Eigentümer erlauben, die Metadaten eines einzelnen
Dokuments über `GET /api/documents/{documentId}` abzurufen. Für Nicht-Eigentümer
verhält sich das Dokument als nicht vorhanden (`NoSuchElementException`).

#### Scenario: Fremdes Dokument nicht abrufbar
- **WHEN** ein Benutzer die Metadaten eines Dokuments abruft, das ihm nicht gehört
- **THEN** wird "Document not found" gemeldet, selbst wenn das Dokument existiert

### Requirement: Dokument-Beschreibung ändern
Das Portal SHALL nur dem Eigentümer erlauben, die Beschreibung eines Dokuments
über `PUT /api/documents/{documentId}` zu ändern. Dateiname und Datei-Inhalt
bleiben unverändert. Ersetzt `DOC-004`.

#### Scenario: Eigentümer ändert Beschreibung
- **WHEN** der Eigentümer eine neue Beschreibung sendet
- **THEN** wird die Beschreibung und `updatedAt` aktualisiert, der Dateiname bleibt gleich

### Requirement: Dokument herunterladen
Das Portal SHALL den Download eines Dokuments über
`GET /api/documents/{documentId}/download` erlauben, wenn der Benutzer entweder
Eigentümer ist ODER eine gültige (nicht abgelaufene) Freigabe besitzt. Andernfalls
antwortet das Portal mit HTTP 403. Der Parameter `inline` steuert
Inline-Anzeige vs. Download. Ersetzt `DOC-002`.

Hinweis: Anders als der Metadaten-Abruf (eigentümer-only) berücksichtigt der
Download geteilte Dokumente (siehe `portal-sharing`).

#### Scenario: Eigentümer lädt herunter
- **WHEN** der Eigentümer den Download-Endpoint aufruft
- **THEN** wird die Datei als Resource zurückgegeben

#### Scenario: Kein Zugriff ohne Eigentum oder Freigabe
- **WHEN** ein Benutzer ohne Eigentum und ohne gültige Freigabe den Download aufruft
- **THEN** antwortet das Portal mit HTTP 403 (Forbidden)

### Requirement: Eigenes Dokument löschen
Das Portal SHALL nur dem Eigentümer erlauben, ein Dokument über
`DELETE /api/documents/{documentId}` zu löschen. Dabei werden die Datei aus dem
Dateisystem entfernt, ein Aktivitätseintrag (`DELETE`/`DOCUMENT`) protokolliert
und der Metadatensatz gelöscht. Ersetzt `DOC-003`, `PORT-PERM-003` (eigener
Anteil), `LOG-003`.

#### Scenario: Eigentümer löscht Dokument
- **WHEN** der Eigentümer ein Dokument löscht
- **THEN** werden Datei und Metadaten entfernt und ein Aktivitätsprotokoll-Eintrag geschrieben

#### Scenario: Fremdes Dokument nicht löschbar
- **WHEN** ein Benutzer versucht, ein fremdes Dokument zu löschen
- **THEN** wird "Document not found" gemeldet und nichts gelöscht


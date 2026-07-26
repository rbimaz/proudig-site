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
als Eigentümer (`uploadedBy`) hinterlegt. Wird ein `folderId` angegeben, MUSS der
Zielordner dem Benutzer gehören ODER der Benutzer die Rolle `ADMIN` haben;
andernfalls wird mit `IllegalAccessError` abgewiesen. Endpoint: `POST /api/documents`
(multipart).

#### Scenario: Erfolgreicher Upload in Root-Ebene
- **WHEN** ein authentifizierter Benutzer eine Datei ohne `folderId` hochlädt
- **THEN** wird die Datei gespeichert und ein Dokument mit `folder = NULL` und dem Benutzer als Eigentümer angelegt

#### Scenario: Upload in fremden Ordner wird abgelehnt
- **WHEN** ein Benutzer ohne `ADMIN`-Rolle (Client oder Consultant) eine Datei mit einer `folderId` hochlädt, deren Ordner einem anderen Benutzer gehört
- **THEN** wird der Upload mit einem Zugriffsfehler (`IllegalAccessError`) abgewiesen

#### Scenario: Admin lädt in fremden Ordner hoch
- **WHEN** ein `ADMIN` eine Datei mit einer `folderId` hochlädt, deren Ordner einem anderen Benutzer gehört
- **THEN** wird der Upload akzeptiert und das Dokument in diesem Ordner abgelegt

### Requirement: Eigene Dokumente auflisten
Das Portal SHALL Dokumente rollenabhängig auflisten. **Personal** (Benutzer mit
Rolle `ADMIN` oder `CONSULTANT`) sieht als Team-Sicht **alle** Dokumente,
unabhängig vom Uploader. Ein **Client** sieht ausschließlich die von ihm selbst
hochgeladenen Dokumente. Endpoints: `GET /api/documents` (alle bzw. eigene) und
`GET /api/documents/folder/{folderId}` (Dokumente je Ordner; Personal darf jeden
Ordner öffnen, ein Client nur eigene). Freigegebene Dokumente für Clients siehe
`portal-sharing`.

#### Scenario: Nur eigene Dokumente sichtbar
- **WHEN** ein Client die Dokumentenliste abruft
- **THEN** enthält die Antwort ausschließlich Dokumente, deren Eigentümer er ist

#### Scenario: Personal sieht alle Dokumente
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` die Dokumentenliste abruft
- **THEN** enthält die Antwort alle Dokumente des Portals, auch die anderer Benutzer

#### Scenario: Personal öffnet fremden Ordner
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` `GET /api/documents/folder/{folderId}` für einen fremden Ordner abruft
- **THEN** werden die Dokumente dieses Ordners zurückgegeben

#### Scenario: Client kann fremden Ordner nicht öffnen
- **WHEN** ein Client `GET /api/documents/folder/{folderId}` für einen fremden Ordner abruft
- **THEN** wird der Zugriff mit `IllegalAccessError` abgewiesen

### Requirement: Dokument-Metadaten abrufen
Das Portal SHALL dem Eigentümer sowie **Personal** (Rolle `ADMIN` oder
`CONSULTANT`) erlauben, die Metadaten eines einzelnen Dokuments über
`GET /api/documents/{documentId}` abzurufen. Für einen Client, der nicht
Eigentümer ist, verhält sich das Dokument als nicht vorhanden
(`NoSuchElementException`).

#### Scenario: Fremdes Dokument nicht abrufbar
- **WHEN** ein Client die Metadaten eines Dokuments abruft, das ihm nicht gehört
- **THEN** wird "Document not found" gemeldet, selbst wenn das Dokument existiert

#### Scenario: Personal ruft fremde Metadaten ab
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` die Metadaten eines fremden Dokuments abruft
- **THEN** werden die Metadaten zurückgegeben

### Requirement: Dokument-Beschreibung ändern
Das Portal SHALL das Ändern der Beschreibung eines Dokuments über
`PUT /api/documents/{documentId}` erlauben, wenn der Benutzer Eigentümer ODER
`ADMIN` ist. Dateiname und Datei-Inhalt bleiben unverändert.

#### Scenario: Eigentümer ändert Beschreibung
- **WHEN** der Eigentümer eine neue Beschreibung sendet
- **THEN** wird die Beschreibung und `updatedAt` aktualisiert, der Dateiname bleibt gleich

#### Scenario: Admin ändert fremde Beschreibung
- **WHEN** ein `ADMIN` die Beschreibung eines fremden Dokuments ändert
- **THEN** wird die Beschreibung aktualisiert

#### Scenario: Consultant darf fremde Beschreibung nicht ändern
- **WHEN** ein `CONSULTANT` (nicht Eigentümer) die Beschreibung eines fremden Dokuments ändern will
- **THEN** wird "Document not found" gemeldet und nichts geändert

### Requirement: Dokument herunterladen
Das Portal SHALL den Download eines Dokuments über
`GET /api/documents/{documentId}/download` erlauben, wenn der Benutzer entweder
Eigentümer ist, eine gültige (nicht abgelaufene) Freigabe besitzt ODER Personal
(Rolle `ADMIN` oder `CONSULTANT`) ist. Andernfalls antwortet das Portal mit
HTTP 403. Der Parameter `inline` steuert Inline-Anzeige vs. Download.

Hinweis: Die Zugriffsprüfung (`canAccessDocument`) berücksichtigt neben Eigentum
und Freigabe (siehe `portal-sharing`) zusätzlich die Personal-Rollen.

#### Scenario: Eigentümer lädt herunter
- **WHEN** der Eigentümer den Download-Endpoint aufruft
- **THEN** wird die Datei als Resource zurückgegeben

#### Scenario: Personal lädt fremdes Dokument herunter
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` den Download eines fremden Dokuments aufruft
- **THEN** wird die Datei als Resource zurückgegeben

#### Scenario: Kein Zugriff ohne Eigentum oder Freigabe
- **WHEN** ein Client ohne Eigentum und ohne gültige Freigabe den Download aufruft
- **THEN** antwortet das Portal mit HTTP 403 (Forbidden)

### Requirement: Eigenes Dokument löschen
Das Portal SHALL das Löschen eines Dokuments über
`DELETE /api/documents/{documentId}` erlauben, wenn der Benutzer Eigentümer ODER
`ADMIN` ist. Dabei werden die Datei aus dem Dateisystem entfernt, ein
Aktivitätseintrag (`DELETE`/`DOCUMENT`) protokolliert und der Metadatensatz
gelöscht.

#### Scenario: Eigentümer löscht Dokument
- **WHEN** der Eigentümer ein Dokument löscht
- **THEN** werden Datei und Metadaten entfernt und ein Aktivitätsprotokoll-Eintrag geschrieben

#### Scenario: Admin löscht fremdes Dokument
- **WHEN** ein `ADMIN` ein fremdes Dokument löscht
- **THEN** werden Datei und Metadaten entfernt und ein Aktivitätsprotokoll-Eintrag geschrieben

#### Scenario: Fremdes Dokument nicht löschbar
- **WHEN** ein Benutzer ohne `ADMIN`-Rolle (Client oder Consultant) versucht, ein fremdes Dokument zu löschen
- **THEN** wird "Document not found" gemeldet und nichts gelöscht

### Requirement: Dokumentenportal nur für ADMIN
Der Zugriff auf das Dokumentenportal und dessen Endpunkte (`/api/documents`, `/api/folders`,
`/api/shares`, `/api/portal`) SHALL ausschließlich Benutzern mit der Rolle ADMIN gestattet sein.
Benutzer mit den Rollen CONSULTANT oder CLIENT SHALL keinen Zugriff auf das Portal oder dessen
Dokument-, Ordner- und Freigabe-Endpunkte erhalten. Die Passwort-ändern-Funktion SHALL für jeden
authentifizierten Benutzer erreichbar bleiben.

#### Scenario: ADMIN öffnet das Portal
- **WHEN** ein Benutzer mit Rolle ADMIN `/admin/portal` aufruft
- **THEN** wird das Dokumentenportal geladen und die Dokument-/Ordner-/Freigabe-Endpunkte antworten normal

#### Scenario: Nicht-Admin wird abgewiesen
- **WHEN** ein Benutzer mit Rolle CONSULTANT oder CLIENT `/admin/portal` aufruft
- **THEN** wird er auf `/admin` umgeleitet und Anfragen an `/api/documents`, `/api/folders`, `/api/shares` werden mit HTTP 403 beantwortet

#### Scenario: Passwortänderung bleibt erreichbar
- **WHEN** ein authentifizierter Nicht-Admin mit gesetztem `forcePasswordChange` sich anmeldet
- **THEN** kann er die Passwort-ändern-Seite (`/admin/portal/change-password`) weiterhin erreichen


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
Metadaten werden in der Datenbank gespeichert. Der hochladende Benutzer wird als
Eigentümer (`uploadedBy`) hinterlegt. Wird ein `folderId` angegeben, MUSS der
Benutzer auf den Zielordner **Schreibzugriff** haben — er ist Eigentümer, `ADMIN`,
**oder** hat auf den Zielordner (bzw. einen Vorfahren) eine **WRITE-Freigabe**
(direkt oder über eine Gruppe); andernfalls wird mit `IllegalAccessError`
abgewiesen. Endpoint: `POST /api/documents` (multipart).

#### Scenario: Erfolgreicher Upload in Root-Ebene
- **WHEN** ein authentifizierter Benutzer eine Datei ohne `folderId` hochlädt
- **THEN** wird die Datei gespeichert und ein Dokument mit `folder = NULL` und dem Benutzer als Eigentümer angelegt

#### Scenario: WRITE-Empfänger lädt in geteilten Ordner hoch
- **WHEN** ein Benutzer mit WRITE-Freigabe auf einen (fremden) Ordner dort eine Datei hochlädt
- **THEN** wird die Datei im Ordner abgelegt (Eigentümer = der hochladende Benutzer)

#### Scenario: Upload in fremden Ordner wird abgelehnt
- **WHEN** ein Benutzer ohne WRITE-Freigabe/ohne ADMIN eine Datei in einen fremden Ordner hochlädt
- **THEN** wird der Upload mit `IllegalAccessError` abgewiesen

#### Scenario: Admin lädt in fremden Ordner hoch
- **WHEN** ein `ADMIN` eine Datei mit einer `folderId` hochlädt, deren Ordner einem anderen Benutzer gehört
- **THEN** wird der Upload akzeptiert und das Dokument in diesem Ordner abgelegt

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
Das Portal SHALL Dokument-Zugriffe über eine einzige, zentrale Regel prüfen, die
auch die Ordner-Vererbung einbezieht. **Lesezugriff** (`canRead`) besteht, wenn
der Benutzer `ADMIN` ist, Eigentümer ist, das Dokument per Einzel-Freigabe mit ihm
geteilt wurde, **oder** er auf den enthaltenden Ordner (bzw. einen Vorfahren) eine
READ- oder WRITE-Freigabe hat (direkt oder über eine Gruppe). **Schreibzugriff**
richtet sich nach der Aktion: Den **Inhalt aktualisieren** darf, wer `ADMIN`/
Eigentümer ist oder auf den Ordner **WRITE** hat (auch bei fremden Dateien);
**Löschen, Umbenennen und Verschieben** darf nur `ADMIN`/Eigentümer oder ein
WRITE-Empfänger **für selbst hochgeladene** Dateien. Eine reine **READ**- oder
Einzel-Datei-Freigabe berechtigt NICHT zum Ändern. Diese Regeln SHALL für
Auflistung, Metadaten, Download, Aktualisieren, Umbenennen, Verschieben und
Löschen einheitlich gelten.

#### Scenario: Lesezugriff über Ordner-Freigabe
- **WHEN** ein Benutzer eine Datei in einem ihm (READ oder WRITE) freigegebenen Ordner-Teilbaum abruft/herunterlädt
- **THEN** wird der Zugriff gewährt

#### Scenario: Geteiltes Dokument ist nur lesbar
- **WHEN** ein Benutzer mit nur READ- (oder Einzel-Datei-) Freigabe eine Datei aktualisieren, umbenennen, verschieben oder löschen will
- **THEN** wird die Aktion abgewiesen

#### Scenario: WRITE-Empfänger darf fremde Datei nicht löschen, aber aktualisieren
- **WHEN** ein WRITE-Empfänger eine fremde Datei im Teilbaum aktualisiert (erlaubt) bzw. löscht (nicht erlaubt)
- **THEN** wird das Aktualisieren durchgeführt und das Löschen mit `IllegalAccessError` abgewiesen

### Requirement: Portal-Navigation für Consultants

Beim Öffnen des Dokumenten-Portals SHALL ein Benutzer mit Rolle `CONSULTANT`
direkt zur Dokumentenansicht („Meine Dokumente") gelangen und NICHT auf das
Admin-Dashboard. Die Portal-Navigation SHALL für einen `CONSULTANT` die ADMIN-only
Bereiche (Dashboard-Statistiken, Benutzerverwaltung) NICHT anzeigen. Für einen
`ADMIN` bleibt die Navigation unverändert (Dashboard, Meine Dokumente, Benutzer).

#### Scenario: Consultant öffnet das Portal

- **WHEN** ein `CONSULTANT` das Dokumenten-Portal öffnet
- **THEN** wird direkt „Meine Dokumente" angezeigt (inkl. „Mit mir geteilt"),
  nicht das Admin-Dashboard

#### Scenario: Consultant ruft die Dashboard-Route direkt auf

- **WHEN** ein `CONSULTANT` `/admin/portal` (Dashboard-Route) direkt aufruft
- **THEN** wird er auf `/admin/portal/documents` weitergeleitet

#### Scenario: Portal-Navigation eines Consultants

- **WHEN** ein `CONSULTANT` die Portal-Navigation sieht
- **THEN** enthält sie „Meine Dokumente", aber weder „Dashboard" noch „Benutzer"

#### Scenario: Admin-Navigation unverändert

- **WHEN** ein `ADMIN` das Portal öffnet
- **THEN** sieht er weiterhin Dashboard, Meine Dokumente und Benutzer

### Requirement: Datei-Inhalt aktualisieren

Das Portal SHALL das Ersetzen des Inhalts einer vorhandenen Datei über
`PUT /api/documents/{documentId}/content` (multipart) erlauben, wenn der Benutzer
`ADMIN`/Eigentümer ist oder auf den enthaltenden Ordner **WRITE** hat (auch für
fremde Dateien). Dabei SHALL die Datei im Dateisystem ersetzt, `fileSize`,
`contentType` und `updatedAt` aktualisiert und die Aktion im Aktivitätsprotokoll
erfasst werden. Der Dateiname/das Dokument bleibt dasselbe (keine Versionierung).

#### Scenario: WRITE-Empfänger aktualisiert vorhandene Datei
- **WHEN** ein WRITE-Empfänger eine neue Datei-Version für ein vorhandenes Dokument im geteilten Teilbaum hochlädt
- **THEN** wird der Inhalt ersetzt und Größe/Typ/`updatedAt` aktualisiert

#### Scenario: Ohne Schreibzugriff abgelehnt
- **WHEN** ein Benutzer ohne WRITE/Eigentum/ADMIN den Inhalt einer Datei ersetzen will
- **THEN** wird die Aktion abgewiesen

### Requirement: Darstellung der Aktions-Buttons der Dokumentenliste

Die Aktions-Buttons in der Dokumenten-/Ordnerliste (`/admin/portal/documents`)
SHALL als einheitliche, quadratische **Icon-Buttons** dargestellt werden: **42×42
px**, abgerundet, weißer Hintergrund, dezenter Rahmen und gedämpftes Icon im
Ruhezustand. Beim **Hover/Fokus** SHALL ein Button in der **Primärfarbe (Orange)
gefüllt** werden mit **weißem** Icon; der **Lösch-Button** SHALL stattdessen in der
**Gefahren-Farbe (Rot)** gefüllt werden. Deaktivierte Buttons SHALL abgeschwächt
(reduzierte Deckkraft) und ohne Hover-Füllung dargestellt werden. Jeder Button
SHALL ein zugängliches Label (`title`/`aria-label`) behalten. Es werden keine
Text-Beschriftungen angezeigt (reine Icon-Buttons).

#### Scenario: Ruhezustand

- **WHEN** die Aktionsspalte einer Zeile angezeigt wird
- **THEN** erscheinen die Aktionen als 42×42-Icon-Buttons mit weißem Hintergrund,
  dezentem Rahmen und gedämpftem Icon (kein sichtbarer Text)

#### Scenario: Hover füllt in Primärfarbe

- **WHEN** der Mauszeiger über einem nicht-gefährlichen Aktions-Button liegt (oder er den Fokus hat)
- **THEN** ist der Button in Orange gefüllt und das Icon weiß

#### Scenario: Buttons werden nicht gestaucht

- **WHEN** eine Zeile mehrere Aktionen (bis zu fünf) enthält
- **THEN** behalten die Buttons ihre 42×42-Größe; die Aktionsspalte passt ihre Breite an die Buttons an (kein Zusammenquetschen)

#### Scenario: Lösch-Button füllt in Rot

- **WHEN** der Mauszeiger über dem »Löschen«-Button liegt (oder er den Fokus hat)
- **THEN** ist der Button in Rot gefüllt und das Icon weiß

#### Scenario: Zugängliches Label bleibt erhalten

- **WHEN** eine Aktion als Icon-Button angezeigt wird
- **THEN** trägt sie ein `aria-label`/`title` mit der Aktionsbezeichnung

### Requirement: Breite und rechte Ausrichtung der Dokumente-Seite

Die Dokumente-Seite (`/admin/portal/documents`) SHALL die verfügbare Breite des
Inhaltsbereichs füllen (keine feste Maximalbreite auf Desktop) und ihre Blöcke
(Titel, Toolbar, Liste) horizontal an derselben Basis-Einrückung wie die
Portal-Navbar ausrichten. Der **rechte Abstand** von Toolbar/Liste zum Rand SHALL
demselben Wert entsprechen wie der rechte Abstand des Benutzer-Menüs in der Navbar.

#### Scenario: Tabelle nutzt die volle Breite

- **WHEN** die Dokumente-Seite auf einem breiten Viewport angezeigt wird
- **THEN** füllt die Liste die verfügbare Breite (kein großer leerer Bereich rechts)

#### Scenario: Rechter Rand entspricht der Navbar

- **WHEN** Toolbar/Liste und das Navbar-Benutzermenü angezeigt werden
- **THEN** liegt ihr rechter Rand auf derselben vertikalen Kante


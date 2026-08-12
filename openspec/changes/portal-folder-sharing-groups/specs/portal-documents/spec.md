## MODIFIED Requirements

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

#### Scenario: Upload in fremden Ordner ohne Schreibzugriff wird abgelehnt
- **WHEN** ein Benutzer ohne WRITE-Freigabe/ohne ADMIN eine Datei in einen fremden Ordner hochlädt
- **THEN** wird der Upload mit `IllegalAccessError` abgewiesen

#### Scenario: Admin lädt in fremden Ordner hoch
- **WHEN** ein `ADMIN` eine Datei mit einer `folderId` hochlädt, deren Ordner einem anderen Benutzer gehört
- **THEN** wird der Upload akzeptiert und das Dokument in diesem Ordner abgelegt

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

#### Scenario: Reine READ- oder Einzel-Freigabe erlaubt kein Ändern
- **WHEN** ein Benutzer mit nur READ- (oder Einzel-Datei-) Freigabe eine Datei aktualisieren, umbenennen, verschieben oder löschen will
- **THEN** wird die Aktion abgewiesen

#### Scenario: WRITE-Empfänger darf fremde Datei nicht löschen, aber aktualisieren
- **WHEN** ein WRITE-Empfänger eine fremde Datei im Teilbaum aktualisiert (erlaubt) bzw. löscht (nicht erlaubt)
- **THEN** wird das Aktualisieren durchgeführt und das Löschen mit `IllegalAccessError` abgewiesen

## ADDED Requirements

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

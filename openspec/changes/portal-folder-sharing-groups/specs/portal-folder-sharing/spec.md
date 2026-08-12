## ADDED Requirements

### Requirement: Ordner intern freigeben (READ/WRITE) an Nutzer oder Gruppe

Das Portal SHALL einem `ADMIN` erlauben, einen Ordner intern freizugeben:
`POST /api/folders/{id}/shares` mit Ziel (`userId` **oder** `groupId`) und
Berechtigung (`READ` | `WRITE`). Bestehende Freigaben SHALL auflistbar
(`GET /api/folders/{id}/shares`) und widerrufbar
(`DELETE /api/folders/{id}/shares/{shareId}`) sein. Je (Ordner, Ziel) SHALL höchstens
eine Freigabe existieren (erneutes Teilen aktualisiert die Berechtigung). Nur
`ADMIN` SHALL freigeben/widerrufen dürfen. Erstellen und Widerruf SHALL im
Aktivitätsprotokoll erfasst werden.

#### Scenario: Ordner an Gruppe mit WRITE freigeben
- **WHEN** ein `ADMIN` einen Ordner mit `groupId` und `WRITE` freigibt
- **THEN** wird eine Freigabe Ordner↔Gruppe mit Berechtigung WRITE angelegt

#### Scenario: Ordner an Einzelnutzer mit READ freigeben
- **WHEN** ein `ADMIN` einen Ordner mit `userId` und `READ` freigibt
- **THEN** wird eine Freigabe Ordner↔Nutzer mit Berechtigung READ angelegt

#### Scenario: Erneutes Teilen aktualisiert die Berechtigung
- **WHEN** ein `ADMIN` einen bereits (READ) geteilten Ordner an dasselbe Ziel mit WRITE teilt
- **THEN** wird die bestehende Freigabe auf WRITE aktualisiert (keine zweite Freigabe)

#### Scenario: Nur ADMIN darf freigeben
- **WHEN** ein `CONSULTANT` einen Ordner freizugeben versucht
- **THEN** wird die Anfrage mit HTTP 403 abgewiesen

### Requirement: Freigabe wirkt auf den gesamten Teilbaum

Eine Ordner-Freigabe SHALL auf den **gesamten Teilbaum** wirken: den Ordner
selbst, alle vorhandenen und **später hinzugefügten** Unterordner und Dateien.
Eine Freigabe auf einen tiefer liegenden Ordner SHALL nur dessen Teilbaum betreffen.
Der Widerruf einer Freigabe SHALL den Zugriff auf den gesamten Teilbaum entziehen.

#### Scenario: Später hinzugefügte Inhalte sind erfasst
- **WHEN** in einem freigegebenen Ordner nachträglich eine Datei oder ein Unterordner angelegt wird
- **THEN** ist dieser Inhalt für die Empfänger der Freigabe gemäß ihrer Berechtigung zugänglich, ohne erneutes Teilen

#### Scenario: Widerruf entzieht den Teilbaum
- **WHEN** ein `ADMIN` eine Ordner-Freigabe widerruft
- **THEN** verlieren die Empfänger den Zugriff auf den Ordner und seinen gesamten Teilbaum

### Requirement: Zentrale rekursive Zugriffsprüfung mit Union

Das Portal SHALL Ordner- und Datei-Zugriffe über eine einzige, zentrale Regel
prüfen, die den Ordner-Teilbaum über die **Vorfahrenkette** auswertet. Die
**effektive Berechtigung** eines Nutzers auf einen Ordner/eine Datei SHALL das
Maximum (Union, „großzügigste gewinnt") aus allen zutreffenden Quellen sein:
`ADMIN` (voll), Eigentum an einem Vorfahr-/dem Ordner (voll), Personal-Team-Sicht
(bestehende READ-Sicht für ADMIN/CONSULTANT), sowie Freigaben (READ/WRITE) an den
Nutzer **oder** an eine seiner Gruppen — jeweils auf dem Ordner selbst oder einem
Vorfahren. Diese Prüfung SHALL für Auflistung, Navigation, Metadaten, Download,
Upload, Aktualisieren, Anlegen, Umbenennen, Verschieben und Löschen einheitlich
angewandt werden.

#### Scenario: WRITE gewinnt über READ (Union)
- **WHEN** ein Nutzer denselben Ordner-Teilbaum über eine Einzel-Freigabe READ und über eine Gruppen-Freigabe WRITE erhält
- **THEN** ist seine effektive Berechtigung WRITE

#### Scenario: Zugriff über einen Vorfahren
- **WHEN** einem Nutzer ein Ordner freigegeben ist und er eine Datei in einem tiefer liegenden Unterordner anfragt
- **THEN** wird der Zugriff anhand der vom Vorfahren geerbten Berechtigung gewährt

#### Scenario: Kein Zugriff ohne Quelle
- **WHEN** ein Nutzer ohne Eigentum, Personal-Sicht oder Freigabe einen fremden Ordner/eine fremde Datei anfragt
- **THEN** verhält sich das Ziel als nicht vorhanden bzw. der Zugriff wird verweigert

### Requirement: WRITE-Operationsregeln (max = Schreiben)

Ein WRITE-Empfänger SHALL innerhalb des freigegebenen Teilbaums: Ordner/Dateien
browsen und herunterladen, **neue Dateien hochladen**, **neue Unterordner anlegen**
und **vorhandene Dateien aktualisieren** (Inhalt ersetzen) — auch solche, die von
anderen stammen. Ein WRITE-Empfänger SHALL **Löschen, Umbenennen und Verschieben
ausschließlich für von ihm selbst erstellte Elemente** dürfen (Datei mit
`uploadedBy = er`, Ordner mit `owner = er`), und ein Verschieben SHALL nur
**innerhalb** eines Teilbaums erfolgen, auf den er WRITE hat. Ein WRITE-Empfänger
SHALL **niemals** den geteilten Wurzelordner oder fremde/vorhandene Ordner löschen,
umbenennen oder verschieben, und keine fremden Dateien löschen. Verstöße SHALL mit
`IllegalAccessError` abgewiesen werden.

#### Scenario: Neue Datei hochladen und Unterordner anlegen
- **WHEN** ein WRITE-Empfänger in den geteilten Ordner eine Datei hochlädt und einen Unterordner anlegt
- **THEN** werden Datei (Eigentümer = er) und Unterordner (Owner = er) erstellt

#### Scenario: Vorhandene fremde Datei aktualisieren
- **WHEN** ein WRITE-Empfänger den Inhalt einer vorhandenen, von jemand anderem hochgeladenen Datei im Teilbaum ersetzt
- **THEN** wird der Datei-Inhalt aktualisiert

#### Scenario: Eigene Elemente löschen erlaubt
- **WHEN** ein WRITE-Empfänger eine von ihm selbst hochgeladene Datei oder einen von ihm angelegten Unterordner löscht
- **THEN** wird das Element entfernt

#### Scenario: Fremde Datei löschen verweigert
- **WHEN** ein WRITE-Empfänger eine fremde Datei zu löschen versucht
- **THEN** wird die Aktion mit `IllegalAccessError` abgewiesen

#### Scenario: Geteilten oder fremden Ordner löschen verweigert
- **WHEN** ein WRITE-Empfänger den geteilten Wurzelordner oder einen fremden Unterordner zu löschen versucht
- **THEN** wird die Aktion mit `IllegalAccessError` abgewiesen

#### Scenario: READ erlaubt keine Schreibaktion
- **WHEN** ein READ-Empfänger hochzuladen, zu aktualisieren, anzulegen oder zu löschen versucht
- **THEN** wird die Aktion abgewiesen

### Requirement: Geteilte Ordner als virtuelle Roots und Navigation

Das Portal SHALL einem Empfänger die ihm (direkt oder über eine Gruppe)
freigegebenen Ordner als **virtuelle Wurzelordner** in seiner Ordneransicht
anzeigen und die Navigation in deren Teilbaum erlauben — auch wenn die Ordner
einem anderen Nutzer gehören. Die Sichtbarkeit enthaltener Dateien SHALL dem
Ordner folgen (nicht dem Uploader). Es SHALL kein Zugriff außerhalb des
freigegebenen Teilbaums entstehen.

Zusätzlich SHALL ein geteilter Ordner **auch dort, wo er innerhalb seines realen
Pfads sichtbar ist** (z. B. für Eigentümer/ADMIN), als **„geteilt" gekennzeichnet**
werden. Die Kennzeichnung (inkl. Berechtigung/Ziel) SHALL in den Ordner-Daten
(DTO) verfügbar sein.

#### Scenario: Geteilter Ordner ist im realen Pfad markiert
- **WHEN** der Eigentümer oder ein `ADMIN` einen Ordner in dessen realem Pfad sieht, der freigegeben ist
- **THEN** ist der Ordner dort als „geteilt" gekennzeichnet (mit Angabe der Freigaben)

#### Scenario: Geteilter Ordner erscheint als Root
- **WHEN** ein `CONSULTANT` seine Ordneransicht öffnet und ihm ein fremder Ordner freigegeben ist
- **THEN** erscheint dieser Ordner als (virtueller) Wurzelordner und ist navigierbar

#### Scenario: Dateien folgen dem Ordner
- **WHEN** ein Empfänger in einem geteilten Ordner die Dateiliste öffnet
- **THEN** sieht er die Dateien des Ordners unabhängig davon, wer sie hochgeladen hat

#### Scenario: Kein Zugriff außerhalb des Teilbaums
- **WHEN** ein Empfänger eine Datei/einen Ordner außerhalb des freigegebenen Teilbaums anfragt
- **THEN** wird der Zugriff verweigert

### Requirement: Eigentümer und ADMIN behalten volle Kontrolle

Die WRITE-Beschränkungen (kein Löschen des Wurzel-/fremder Ordner, nur eigene
löschen) SHALL **nur für Freigabe-Empfänger** gelten. Der **Eigentümer** eines
Ordners und ein **ADMIN** SHALL weiterhin die volle Kontrolle über den jeweiligen
Teilbaum behalten (inkl. Löschen von Ordnern und fremden Dateien darin).

#### Scenario: Eigentümer löscht eigenen geteilten Ordner
- **WHEN** der Eigentümer einen Ordner löscht, den er mit anderen geteilt hat
- **THEN** wird der Ordner (rekursiv) gelöscht und die zugehörigen Freigaben entfernt

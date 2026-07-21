# media Specification

## Purpose
TBD - created by archiving change fix-media-module. Update Purpose after archive.
## Requirements
### Requirement: Funktionsfähige Mediathek-Verwaltung
Die Admin-Mediathek SHALL Dateien korrekt hochladen, auflisten und löschen. Der Upload SHALL den
tatsächlichen Endpunkt `POST /api/admin/media` verwenden. Die Auflistung SHALL die realen
`MediaDto`-Felder nutzen (Bild-Vorschau über `/api/media/{id}`, Name über `name`, Typ über
`contentType`) und darf bei vorhandenen Dateien nicht abstürzen.

#### Scenario: Datei hochladen
- **WHEN** eine Administratorin eine Datei in der Mediathek hochlädt
- **THEN** wird sie über `POST /api/admin/media` gespeichert und erscheint in der Liste

#### Scenario: Mediathek mit vorhandenen Dateien anzeigen
- **WHEN** die Mediathek Dateien enthält
- **THEN** werden Vorschau (`/api/media/{id}`), Name und Aktionen ohne Fehler dargestellt

### Requirement: Titelbild aus der Mediathek wählen
Der Seiten-Editor SHALL das Titelbild über einen Auswahl-Dialog aus der Mediathek setzen können
(statt manueller Eingabe einer ID). Der Editor SHALL das gewählte Titelbild als Vorschau zeigen
und ein Entfernen erlauben.

#### Scenario: Titelbild per Picker setzen
- **WHEN** ein Redakteur im Editor „Aus Mediathek wählen" nutzt und ein Bild anklickt
- **THEN** wird dessen ID als Titelbild übernommen und als Vorschau angezeigt

### Requirement: Mediathek als Galerie mit Detail-Panel
Die Mediathek SHALL ein zweispaltiges Layout mit einer Vorschau-Galerie (links) und einem
Detail-Panel (rechts) für die ausgewählte Datei darstellen. Vorschaukacheln SHALL das
tatsächliche Bild (`cover`) zeigen; die ausgewählte Kachel SHALL hervorgehoben sein. Statt einer
großen Dropzone SHALL eine kompakte Upload-Kachel im Raster stehen.

#### Scenario: Datei auswählen
- **WHEN** eine Nutzerin auf eine Galerie-Kachel klickt
- **THEN** wird die Kachel hervorgehoben und das Detail-Panel zeigt diese Datei

#### Scenario: Detail-Panel mit Metadaten und Aktionen
- **WHEN** eine Datei ausgewählt ist
- **THEN** zeigt das Panel Vorschau, Name, Typ, Metadaten (Größe, ggf. Abmessungen, Hochgeladen), URL zum Kopieren sowie die Aktionen „Umbenennen" und „Löschen"

#### Scenario: Umbenennen im Panel
- **WHEN** eine Nutzerin im Panel „Umbenennen" wählt und einen neuen Namen speichert
- **THEN** wird der Name über `PUT /api/admin/media/{id}` aktualisiert und in Galerie und Panel angezeigt

#### Scenario: Hochladen über Upload-Kachel oder Drag&Drop
- **WHEN** eine Datei über die Upload-Kachel oder per Drag&Drop hinzugefügt wird
- **THEN** wird sie hochgeladen und erscheint in der Galerie

#### Scenario: Leerer Zustand
- **WHEN** keine Dateien vorhanden sind
- **THEN** zeigt die Galerie nur die Upload-Kachel und das Panel einen Platzhalter

### Requirement: Titelbild ist optional
Das System SHALL Seiten (News, Blog, Seminare, CMS) auch ohne Titelbild anlegen und speichern
können. Ein leerer oder fehlender `coverImageId` SHALL als „kein Titelbild" behandelt werden und
darf keinen Fehler auslösen.

#### Scenario: Anlegen ohne Titelbild
- **WHEN** ein Beitrag ohne ausgewähltes Titelbild gespeichert wird
- **THEN** wird er ohne Titelbild angelegt (kein „Cover image not found")

#### Scenario: Anlegen mit Titelbild
- **WHEN** ein Beitrag mit gültigem Titelbild gespeichert wird
- **THEN** wird das Titelbild verknüpft

### Requirement: Mediathek-Dateien werden korrekt ausgeliefert
Das System SHALL unter `/api/media/{id}` die zugehörige Datei aus dem Media-Speicher
(`<location>/media/…`) korrekt ausliefern.

#### Scenario: Bild abrufen
- **WHEN** ein vorhandenes Bild über `/api/media/{id}` abgerufen wird
- **THEN** liefert das System die Bilddatei mit passendem Content-Type (HTTP 200)

#### Scenario: Fehlende Datei
- **WHEN** zu einer ID keine Datei existiert
- **THEN** antwortet das System mit HTTP 404

### Requirement: Mediathek unterstützt alle CRUD-Operationen
Die Admin-Mediathek SHALL das Hochladen (Create), Auflisten (Read), Umbenennen (Update) und
Löschen (Delete) von Dateien ermöglichen. Für das Umbenennen SHALL ein Endpunkt
`PUT /api/admin/media/{id}` bereitstehen, der den Anzeigenamen der Datei aktualisiert.

#### Scenario: Datei umbenennen
- **WHEN** eine Administratorin in der Mediathek eine Datei umbenennt
- **THEN** wird der neue Name über `PUT /api/admin/media/{id}` gespeichert und in der Liste angezeigt

#### Scenario: Datei löschen
- **WHEN** eine Administratorin eine Datei löscht
- **THEN** wird sie entfernt und verschwindet aus der Liste

### Requirement: Mediathek ist bedienbar dargestellt
Die Mediathek SHALL Vorschauen in einem gleichmäßigen Raster mit auf feste Größe beschnittenen
Bildern darstellen. Die Aktionen (Umbenennen, URL, Löschen) SHALL für jeden Eintrag sichtbar und
bedienbar sein.

#### Scenario: Übersicht mit sichtbaren Aktionen
- **WHEN** die Mediathek mit Dateien angezeigt wird
- **THEN** erscheinen die Vorschauen in normierter Größe und die Aktionen sind je Eintrag sichtbar


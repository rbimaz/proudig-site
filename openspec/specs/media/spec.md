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


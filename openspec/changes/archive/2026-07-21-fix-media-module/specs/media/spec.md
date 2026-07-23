## ADDED Requirements

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

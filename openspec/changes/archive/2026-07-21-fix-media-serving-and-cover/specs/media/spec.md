## ADDED Requirements

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

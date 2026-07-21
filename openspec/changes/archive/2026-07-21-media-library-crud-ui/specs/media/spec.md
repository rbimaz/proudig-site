## ADDED Requirements

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

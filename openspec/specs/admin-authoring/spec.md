# admin-authoring Specification

## Purpose
TBD - created by archiving change fix-admin-editors. Update Purpose after archive.
## Requirements
### Requirement: Blog- und Seminar-Beiträge lassen sich anlegen und bearbeiten
Das Admin-CMS SHALL das Anlegen und Bearbeiten von Blog- und Seminar-Beiträgen ermöglichen.
Die Navigation aus den Verwaltungslisten und die Weiterleitung nach dem Speichern SHALL auf die
tatsächlich registrierten Editor-Routen unter `/admin/cms/…` zeigen (kein leerer Screen).

#### Scenario: Neuen Blog-Beitrag anlegen
- **WHEN** eine Redakteurin in der Blog-Verwaltung „Neu" wählt
- **THEN** öffnet sich der Editor unter `/admin/cms/blog/new`

#### Scenario: Neues Seminar anlegen
- **WHEN** eine Redakteurin in der Seminar-Verwaltung „Neu" wählt
- **THEN** öffnet sich der Editor unter `/admin/cms/seminare/new`

#### Scenario: Nach Speichern zum Editor der Seite
- **WHEN** ein neuer Beitrag gespeichert oder veröffentlicht wird
- **THEN** wird auf `/admin/cms/<segment>/<id>` weitergeleitet (Segment `seminare` für Seminare), nicht auf eine unbekannte Route

#### Scenario: Speichern ohne oder mit Tags funktioniert
- **WHEN** ein Beitrag (mit leerem oder gefülltem Tag-Feld) gespeichert wird
- **THEN** werden die Tags als Array (`List<String>`) übertragen und das Speichern gelingt ohne Deserialisierungsfehler

### Requirement: Mediathek-Inhalte in Seiteninhalte einfügen
Der Editor SHALL das Einfügen von Bildern aus der Mediathek in den Inhalt von News, Seminaren,
Blog und CMS-Seiten ermöglichen. Ausgewählte Medien SHALL über `/api/media/{id}` referenziert werden.

#### Scenario: Bild in Markdown-Inhalt einfügen
- **WHEN** ein Redakteur im Seiten-Editor „Bild aus Mediathek einfügen" nutzt und ein Bild wählt
- **THEN** wird eine Bild-Referenz (`![…](/api/media/{id})`) in den Inhalt eingefügt

#### Scenario: Bild in CMS-Seite einfügen
- **WHEN** ein Redakteur im CMS-Seiten-Editor ein Mediathek-Bild einfügt
- **THEN** wird ein `<img src="/api/media/{id}">` in den HTML-Inhalt eingefügt

### Requirement: News löschen mit Bestätigungsdialog
Das Admin-CMS SHALL das Löschen einer News über einen gestylten In-App-Bestätigungsdialog
(`ConfirmDialog`) absichern — nicht über den nativen Browser-`confirm`. Der Dialog SHALL
Abbrechen und Bestätigen anbieten; nur bei Bestätigung SHALL die News gelöscht werden.

#### Scenario: Löschen bestätigen
- **WHEN** eine Redakteurin bei einer News „Löschen" wählt
- **THEN** erscheint ein Bestätigungsdialog; bei Bestätigung wird die News gelöscht und verschwindet aus der Liste

#### Scenario: Löschen abbrechen
- **WHEN** die Redakteurin den Dialog abbricht (Abbrechen, ESC oder Klick auf den Hintergrund)
- **THEN** wird nichts gelöscht und die Liste bleibt unverändert

#### Scenario: Veröffentlichte News löschen
- **WHEN** eine veröffentlichte (oder archivierte) News gelöscht wird
- **THEN** gelingt das Löschen (kein „Only draft pages can be deleted"-Fehler) — der Status verhindert das Löschen nicht mehr


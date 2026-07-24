## ADDED Requirements

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

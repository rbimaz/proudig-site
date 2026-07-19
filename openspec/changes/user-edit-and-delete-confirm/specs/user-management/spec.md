## ADDED Requirements

### Requirement: Bestehenden Benutzer bearbeiten
Das System SHALL Administratoren erlauben, einen bestehenden Benutzer über eine
Aktion »Bearbeiten« je Tabellenzeile in einem Modal-Dialog zu bearbeiten. Der
Dialog SHALL Vorname und Nachname als editierbare Felder sowie ein
Rollen-Auswahlfeld (Einzelauswahl mit den Optionen Benutzer, Bearbeiter,
Administrator) enthalten und die E-Mail schreibgeschützt anzeigen. Beim Öffnen
SHALL die aktuell höchste Rolle des Benutzers (Priorität Administrator vor
Bearbeiter vor Benutzer) vorausgewählt sein. Beim Speichern SHALL das System
`PUT /api/users/{id}` mit `firstName`, `lastName` und der gewählten Rolle als
`roles`-Array aufrufen und die Benutzerliste aktualisieren. Der Dialog SHALL per
Escape, Backdrop-Klick und »Abbrechen« ohne Speichern schließbar sein.

#### Scenario: Benutzer bearbeiten und speichern
- **WHEN** der Administrator »Bearbeiten« wählt, Vor-/Nachname ändert und speichert
- **THEN** wird `PUT /api/users/{id}` mit den geänderten Feldern und der gewählten Rolle aufgerufen und die Liste zeigt die Änderung

#### Scenario: Rolle wird vorausgewählt
- **WHEN** der Bearbeiten-Dialog für einen Benutzer geöffnet wird
- **THEN** ist dessen höchste vorhandene Rolle im Auswahlfeld vorausgewählt

#### Scenario: Bearbeiten abbrechen
- **WHEN** der Administrator den Dialog über Escape, Backdrop-Klick oder »Abbrechen« schließt
- **THEN** wird nichts gespeichert und der Benutzer bleibt unverändert

### Requirement: Benutzer löschen mit Bestätigungsdialog
Das System SHALL Administratoren erlauben, einen Benutzer über eine Aktion
»Löschen« zu entfernen. Vor dem Löschen SHALL ein gestylter Bestätigungsdialog
(keine Browser-`alert()`/`confirm()`-Meldung) angezeigt werden. Erst nach
Bestätigung SHALL `DELETE /api/users/{id}` ausgeführt und der Benutzer aus der
Liste entfernt werden; bei Abbruch SHALL keine Aktion erfolgen.

#### Scenario: Löschen bestätigen
- **WHEN** der Administrator »Löschen« wählt und im Bestätigungsdialog bestätigt
- **THEN** wird `DELETE /api/users/{id}` aufgerufen und der Benutzer verschwindet aus der Liste

#### Scenario: Löschen abbrechen
- **WHEN** der Administrator im Bestätigungsdialog abbricht
- **THEN** wird kein `DELETE` aufgerufen und der Benutzer bleibt in der Liste

#### Scenario: Kein Browser-Dialog
- **WHEN** der Administrator »Löschen« wählt
- **THEN** erscheint der anwendungseigene Bestätigungsdialog statt eines Browser-`confirm()`

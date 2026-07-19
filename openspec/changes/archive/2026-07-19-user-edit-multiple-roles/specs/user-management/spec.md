## MODIFIED Requirements

### Requirement: Bestehenden Benutzer bearbeiten
Das System SHALL Administratoren erlauben, einen bestehenden Benutzer über eine
Aktion »Bearbeiten« je Tabellenzeile in einem Modal-Dialog zu bearbeiten. Der
Dialog SHALL Vorname und Nachname als editierbare Felder sowie eine
Rollen-Mehrfachauswahl (Checkboxen mit den Optionen Benutzer, Bearbeiter,
Administrator) enthalten und die E-Mail schreibgeschützt anzeigen. Beim Öffnen
SHALL alle aktuell vergebenen Rollen des Benutzers vorausgewählt sein. Es MUSS
mindestens eine Rolle gewählt sein. Beim Speichern SHALL das System
`PUT /api/users/{id}` mit `firstName`, `lastName` und der vollständigen
gewählten Rollenmenge als `roles`-Array aufrufen und die Benutzerliste
aktualisieren. Der Dialog SHALL per Escape, Backdrop-Klick und »Abbrechen« ohne
Speichern schließbar sein.

#### Scenario: Benutzer bearbeiten und speichern
- **WHEN** der Administrator »Bearbeiten« wählt, Vor-/Nachname ändert und speichert
- **THEN** wird `PUT /api/users/{id}` mit den geänderten Feldern und der gewählten Rollenmenge aufgerufen und die Liste zeigt die Änderung

#### Scenario: Rolle wird vorausgewählt
- **WHEN** der Bearbeiten-Dialog für einen Benutzer geöffnet wird
- **THEN** sind alle aktuell vergebenen Rollen des Benutzers angehakt

#### Scenario: Mehrere Rollen vergeben oder entziehen
- **WHEN** der Administrator Rollen an- oder abwählt und speichert
- **THEN** enthält der Payload genau die angehakten Rollen und der Benutzer erhält diese Rollenmenge

#### Scenario: Mindestens eine Rolle erforderlich
- **WHEN** der Administrator alle Rollen abwählt
- **THEN** ist das Speichern nicht möglich und es erfolgt kein `PUT`

#### Scenario: Bearbeiten abbrechen
- **WHEN** der Administrator den Dialog über Escape, Backdrop-Klick oder »Abbrechen« schließt
- **THEN** wird nichts gespeichert und der Benutzer bleibt unverändert

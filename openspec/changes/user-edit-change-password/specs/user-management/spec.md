## ADDED Requirements

### Requirement: Passwort im Bearbeiten-Dialog ändern
Das System SHALL Administratoren erlauben, im Bearbeiten-Dialog eines Benutzers
optional ein neues Passwort zu setzen. Das Passwortfeld SHALL leer bleiben können;
in diesem Fall bleibt das bisherige Passwort unverändert. Wird ein Passwort
eingegeben, SHALL eine Bestätigung mit Live-Übereinstimmungshinweis verlangt und
das neue Passwort erst bei Übereinstimmung über `PUT /api/users/{id}`
mitgesendet werden. Das Backend SHALL ein nicht-leeres Passwort mit Mindestlänge
prüfen (min. 3 Zeichen), es BCrypt-verschlüsselt speichern und ein zu kurzes
Passwort mit einem Validierungsfehler (HTTP 400) abweisen.

#### Scenario: Passwort im Bearbeiten-Dialog setzen
- **WHEN** der Administrator ein gültiges neues Passwort und dessen Bestätigung eingibt und speichert
- **THEN** wird `PUT /api/users/{id}` mit dem neuen Passwort aufgerufen und das Passwort BCrypt-verschlüsselt gespeichert

#### Scenario: Leeres Passwortfeld lässt Passwort unverändert
- **WHEN** der Administrator speichert, ohne ein Passwort einzugeben
- **THEN** enthält der Payload kein Passwort und das bisherige Passwort bleibt bestehen

#### Scenario: Abweichende Bestätigung blockiert das Speichern
- **WHEN** Passwort und Bestätigung sich unterscheiden
- **THEN** wird ein Hinweis angezeigt und das Passwort wird nicht gesendet

## MODIFIED Requirements

### Requirement: Benutzer anlegen
Das System SHALL Administratoren erlauben, über `POST /api/users` einen neuen
Benutzer mit E-Mail, Vorname, Nachname, optionaler Firma, Rollen und einem
**Initialpasswort** anzulegen. Das Passwort MUSS beim Anlegen angegeben werden
und wird BCrypt-verschlüsselt gespeichert. Die E-Mail MUSS eindeutig sein.
Zusätzlich SHALL der Administrator beim Anlegen optional festlegen können, dass
der Benutzer beim ersten Login sein Passwort ändern muss (`forcePasswordChange`,
Default `false`). Ersetzt `USER-001`.

#### Scenario: Benutzer mit Initialpasswort anlegen
- **WHEN** ein Administrator E-Mail, Vorname, Nachname und ein nicht-leeres Passwort absendet
- **THEN** wird der Benutzer mit BCrypt-verschlüsseltem Passwort angelegt und zurückgegeben

#### Scenario: Fehlendes Passwort wird abgewiesen
- **WHEN** die Anlage ohne Passwort (null oder leer) erfolgt
- **THEN** antwortet das System mit einem Validierungsfehler (HTTP 400) und legt keinen Benutzer an

#### Scenario: Doppelte E-Mail wird abgewiesen
- **WHEN** die angegebene E-Mail bereits einem Benutzer gehört
- **THEN** wird die Anlage mit einem Fehler ("Email already exists") abgewiesen

#### Scenario: Passwortänderung beim ersten Login festlegen
- **WHEN** der Administrator die Anlage mit `forcePasswordChange = true` absendet
- **THEN** wird der Benutzer mit gesetztem Flag angelegt

#### Scenario: Ohne Angabe kein Zwang
- **WHEN** die Anlage ohne das Feld `forcePasswordChange` erfolgt
- **THEN** wird der Benutzer ohne Zwang zur Passwortänderung angelegt (Flag `false`)

## ADDED Requirements

### Requirement: Erzwungene Passwortänderung beim ersten Login
Ist bei einem Benutzer das Flag zur erzwungenen Passwortänderung gesetzt, SHALL
das System nach erfolgreicher Anmeldung diesen Zustand an den Client übermitteln
und den Benutzer auf die Seite zur Passwortänderung leiten — unabhängig davon,
ob die Anmeldung über den Admin- oder den Portal-Login erfolgt. Nach
erfolgreicher Passwortänderung über `POST /api/auth/change-password` SHALL das
Flag zurückgesetzt werden.

#### Scenario: Weiterleitung bei erzwungener Änderung
- **WHEN** sich ein Benutzer mit gesetztem Flag anmeldet
- **THEN** enthält die Login-Antwort `forcePasswordChange = true` und der Benutzer wird zur Passwort-ändern-Seite geleitet

#### Scenario: Flag wird nach Änderung zurückgesetzt
- **WHEN** der Benutzer sein Passwort erfolgreich ändert
- **THEN** wird das Flag entfernt und bei der nächsten Anmeldung erfolgt keine erneute Weiterleitung

#### Scenario: Ohne Flag keine Weiterleitung
- **WHEN** sich ein Benutzer ohne gesetztes Flag anmeldet
- **THEN** erfolgt keine Weiterleitung zur Passwort-ändern-Seite

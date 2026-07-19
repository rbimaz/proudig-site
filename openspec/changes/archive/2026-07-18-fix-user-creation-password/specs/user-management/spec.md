## ADDED Requirements

### Requirement: Benutzer anlegen
Das System SHALL Administratoren erlauben, über `POST /api/users` einen neuen
Benutzer mit E-Mail, Vorname, Nachname, optionaler Firma, Rollen und einem
**Initialpasswort** anzulegen. Das Passwort MUSS beim Anlegen angegeben werden
und wird BCrypt-verschlüsselt gespeichert. Die E-Mail MUSS eindeutig sein.
Ersetzt `USER-001`.

#### Scenario: Benutzer mit Initialpasswort anlegen
- **WHEN** ein Administrator E-Mail, Vorname, Nachname und ein nicht-leeres Passwort absendet
- **THEN** wird der Benutzer mit BCrypt-verschlüsseltem Passwort angelegt und zurückgegeben

#### Scenario: Fehlendes Passwort wird abgewiesen
- **WHEN** die Anlage ohne Passwort (null oder leer) erfolgt
- **THEN** antwortet das System mit einem Validierungsfehler (HTTP 400) und legt keinen Benutzer an

#### Scenario: Doppelte E-Mail wird abgewiesen
- **WHEN** die angegebene E-Mail bereits einem Benutzer gehört
- **THEN** wird die Anlage mit einem Fehler ("Email already exists") abgewiesen

## ADDED Requirements

### Requirement: Eigenes Profil anzeigen und bearbeiten
Das Portal SHALL angemeldeten Benutzern eine eigene Profil-Seite unter `/admin/portal/profil`
bereitstellen, die die eigenen Kontodaten zeigt: Vorname, Nachname und Firma als **editierbare**
Felder sowie E-Mail und Rolle als **schreibgeschützte** Anzeige. Die Daten SHALL über
`GET /api/auth/me` geladen und Änderungen über `PUT /api/auth/me` (Felder `firstName`, `lastName`,
`company`) gespeichert werden. Der Endpoint SHALL immer nur das **angemeldete** Konto betreffen
(unabhängig von der Rolle) und E-Mail sowie Rollen NICHT verändern. Vor- und Nachname MÜSSEN
nicht-leer sein; ein leerer Wert SHALL mit einem Validierungsfehler (HTTP 400) abgewiesen werden.

#### Scenario: Eigenes Profil laden
- **WHEN** ein angemeldeter Benutzer die Profil-Seite öffnet
- **THEN** liefert `GET /api/auth/me` seine eigenen Daten (E-Mail, Vorname, Nachname, Firma, Rolle) und die Seite zeigt E-Mail und Rolle schreibgeschützt

#### Scenario: Name und Firma ändern
- **WHEN** der Benutzer Vorname, Nachname oder Firma ändert und speichert
- **THEN** aktualisiert `PUT /api/auth/me` diese Felder seines eigenen Kontos und die Seite zeigt die neuen Werte

#### Scenario: E-Mail und Rolle sind nicht änderbar
- **WHEN** ein Profil-Update abgesendet wird
- **THEN** bleiben E-Mail und Rollen des Kontos unverändert, auch wenn abweichende Werte mitgesendet würden

#### Scenario: Leerer Name wird abgewiesen
- **WHEN** der Benutzer Vor- oder Nachname leert und speichert
- **THEN** antwortet das System mit HTTP 400 und das Profil bleibt unverändert

### Requirement: Passwort auf der Profil-Seite ändern
Die Profil-Seite SHALL einen Abschnitt „Sicherheit" enthalten, über den der angemeldete Benutzer sein
Passwort ändern kann (aktuelles Passwort, neues Passwort, Bestätigung), unter Verwendung von
`POST /api/auth/change-password`. Die bestehende separate Passwort-ändern-Seite
(`/admin/portal/change-password`) SHALL für den erzwungenen Erst-Login-Wechsel erhalten bleiben.

#### Scenario: Passwort auf der Profil-Seite ändern
- **WHEN** der Benutzer im Abschnitt „Sicherheit" gültiges aktuelles und neues Passwort (mit Bestätigung) eingibt und absendet
- **THEN** wird `POST /api/auth/change-password` aufgerufen und das Passwort geändert

#### Scenario: Erst-Login-Zwang nutzt weiterhin die separate Seite
- **WHEN** ein Benutzer mit gesetztem `forcePasswordChange`-Flag sich anmeldet
- **THEN** wird er weiterhin auf `/admin/portal/change-password` geleitet (unverändert)

### Requirement: Profil aus dem User-Menü erreichbar
Der Dropdown-Eintrag „Profil" im Header-User-Menü SHALL auf die Profil-Seite
(`/admin/portal/profil`) verweisen statt direkt auf die Passwort-ändern-Seite.

#### Scenario: Profil über das Menü öffnen
- **WHEN** die Nutzerin im Header-User-Menü „Profil" anklickt
- **THEN** wird die Profil-Seite `/admin/portal/profil` geöffnet

## MODIFIED Requirements

### Requirement: Darstellung der Benutzerverwaltung
Die Benutzerverwaltungsseite (`/admin/portal/users`) SHALL die Benutzerliste als
Hauptinhalt zeigen und das Anlegen neuer Benutzer von der Liste trennen. Das
Erstellungs-Formular SHALL auf einer **eigenen Route** `/admin/portal/users/new`
(nur für ADMIN) dargestellt werden — nicht als Modal-Dialog —, erreichbar über
einen Button »+ Neuer Benutzer«, der dorthin navigiert.

Das Formular SHALL die Eingabefelder einspaltig (untereinander gestapelt) in der
Reihenfolge E-Mail, Vorname, Nachname, Rolle(n), Passwort, Passwort bestätigen
anzeigen, jeweils mit einem führenden Feld-Icon und einem als Pflichtfeld
gekennzeichneten Label, und im Kopfbereich eine Live-Vorschau zeigen. »Abbrechen«
SHALL ohne Anlegen zur Liste zurückführen; nach erfolgreicher Anlage SHALL zur
Liste zurücknavigiert werden, wo der neue Benutzer erscheint.

#### Scenario: Liste ohne offenes Formular
- **WHEN** `/admin/portal/users` geladen wird
- **THEN** wird die Benutzerliste angezeigt und kein Erstellungs-Formular ist eingebettet

#### Scenario: Formular über Button öffnen
- **WHEN** der Administrator »+ Neuer Benutzer« anklickt
- **THEN** wird zu `/admin/portal/users/new` navigiert und das Erstellungs-Formular als eigene Seite angezeigt

#### Scenario: Kompakter Abstand zwischen Titel und Inhalt
- **WHEN** das Erstellungs-Formular angezeigt wird
- **THEN** ist der Abstand zwischen dem Titelbereich und dem ersten Eingabefeld kompakt gehalten

#### Scenario: Dialog abbrechen
- **WHEN** der Administrator im Formular »Abbrechen« wählt
- **THEN** wird zur Liste zurücknavigiert und kein Benutzer angelegt

#### Scenario: Erfolgreiche Anlage schließt den Dialog
- **WHEN** ein Benutzer erfolgreich angelegt wird
- **THEN** wird zur Liste zurücknavigiert und der neue Benutzer erscheint dort

### Requirement: Bestehenden Benutzer bearbeiten
Das System SHALL Administratoren erlauben, einen bestehenden Benutzer über eine
Aktion »Bearbeiten« je Tabellenzeile auf einer **eigenen Route**
`/admin/portal/users/:id` (nur für ADMIN) zu bearbeiten — nicht in einem
Modal-Dialog. Die Seite SHALL Vorname und Nachname als editierbare Felder sowie
eine Rollen-Mehrfachauswahl (Checkboxen mit den Optionen Benutzer, Bearbeiter,
Administrator) enthalten und die E-Mail schreibgeschützt anzeigen. Beim Laden
SHALL der Benutzer über `GET /api/users/{id}` geladen und alle aktuell
vergebenen Rollen vorausgewählt sein. Es MUSS mindestens eine Rolle gewählt sein.
Beim Speichern SHALL das System `PUT /api/users/{id}` mit `firstName`,
`lastName` und der vollständigen gewählten Rollenmenge als `roles`-Array
aufrufen und danach zur Liste zurücknavigieren. »Abbrechen« SHALL ohne Speichern
zur Liste zurückführen.

#### Scenario: Bearbeiten öffnet eigene Route
- **WHEN** der Administrator in einer Zeile »Bearbeiten« wählt
- **THEN** wird zu `/admin/portal/users/:id` navigiert und das Bearbeiten-Formular als eigene Seite angezeigt

#### Scenario: Benutzer bearbeiten und speichern
- **WHEN** der Administrator Vor-/Nachname ändert und speichert
- **THEN** wird `PUT /api/users/{id}` mit den geänderten Feldern und der gewählten Rollenmenge aufgerufen und zur Liste zurücknavigiert

#### Scenario: Rolle wird vorausgewählt
- **WHEN** das Bearbeiten-Formular für einen Benutzer geladen wird
- **THEN** sind alle aktuell vergebenen Rollen des Benutzers angehakt

#### Scenario: Mehrere Rollen vergeben oder entziehen
- **WHEN** der Administrator Rollen an- oder abwählt und speichert
- **THEN** enthält der Payload genau die angehakten Rollen und der Benutzer erhält diese Rollenmenge

#### Scenario: Mindestens eine Rolle erforderlich
- **WHEN** der Administrator alle Rollen abwählt
- **THEN** ist das Speichern nicht möglich und es erfolgt kein `PUT`

#### Scenario: Bearbeiten abbrechen
- **WHEN** der Administrator »Abbrechen« wählt
- **THEN** wird ohne Speichern zur Liste zurücknavigiert und der Benutzer bleibt unverändert

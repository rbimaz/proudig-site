## ADDED Requirements

### Requirement: Einheitliche Rollenbezeichnungen
Die Benutzerverwaltung SHALL für die drei Systemrollen durchgängig dieselben
Anzeigebezeichnungen verwenden — sowohl im Erstellungs-/Bearbeiten-Formular als
auch in den Rollen-Badges der Benutzerliste: `ADMIN` → »Admin«, `CONSULTANT` →
»Consultant«, `CLIENT` → »Customer«. Die zugrunde liegenden Rollenwerte und
Payloads SHALL unverändert bleiben; nur die Anzeige ändert sich.

#### Scenario: Gleiche Bezeichnungen in Formular und Liste
- **WHEN** die Rollen im Formular oder in der Benutzerliste angezeigt werden
- **THEN** erscheinen sie als »Admin«, »Consultant« bzw. »Customer«

#### Scenario: Rollenwerte unverändert
- **WHEN** eine Rolle zugewiesen wird
- **THEN** enthält der Payload weiterhin die Werte `ADMIN`, `CONSULTANT` bzw. `CLIENT`

## MODIFIED Requirements

### Requirement: Rollenauswahl beim Anlegen
Der Erstellungs-Dialog SHALL ein Pflicht-Auswahlfeld für die Rolle enthalten mit
den Optionen »Customer«, »Consultant« und »Admin«, die auf die Systemrollen
`CLIENT`, `CONSULTANT` bzw. `ADMIN` abgebildet werden. Die gewählte Rolle SHALL
beim Absenden als einelementiges `roles`-Array im Payload von `POST /api/users`
mitgesendet werden. Die Vorauswahl SHALL »Customer« (`CLIENT`) sein.

#### Scenario: Gewählte Rolle wird gesendet
- **WHEN** der Administrator die Rolle »Admin« wählt und den Benutzer anlegt
- **THEN** enthält der POST-Payload `roles: ["ADMIN"]`

#### Scenario: Standardrolle
- **WHEN** der Dialog geöffnet wird, ohne die Rolle zu ändern
- **THEN** ist »Customer« ausgewählt und der Payload enthält `roles: ["CLIENT"]`

### Requirement: Bestehenden Benutzer bearbeiten
Das System SHALL Administratoren erlauben, einen bestehenden Benutzer über eine
Aktion »Bearbeiten« je Tabellenzeile auf einer **eigenen Route**
`/admin/portal/users/:id` (nur für ADMIN) zu bearbeiten — nicht in einem
Modal-Dialog. Die Seite SHALL Vorname und Nachname als editierbare Felder sowie
eine Rollen-Mehrfachauswahl (Checkboxen mit den Optionen Customer, Consultant,
Admin) enthalten und die E-Mail schreibgeschützt anzeigen. Beim Laden SHALL der
Benutzer über `GET /api/users/{id}` geladen und alle aktuell vergebenen Rollen
vorausgewählt sein. Es MUSS mindestens eine Rolle gewählt sein. Beim Speichern
SHALL das System `PUT /api/users/{id}` mit `firstName`, `lastName` und der
vollständigen gewählten Rollenmenge als `roles`-Array aufrufen und danach zur
Liste zurücknavigieren. »Abbrechen« SHALL ohne Speichern zur Liste zurückführen.

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

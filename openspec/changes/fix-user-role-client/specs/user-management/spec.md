## MODIFIED Requirements

### Requirement: Rollenauswahl beim Anlegen
Der Erstellungs-Dialog SHALL ein Pflicht-Auswahlfeld für die Rolle enthalten mit
den Optionen »Benutzer«, »Bearbeiter« und »Administrator«, die auf die
Systemrollen `CLIENT`, `CONSULTANT` bzw. `ADMIN` abgebildet werden. Die gewählte
Rolle SHALL beim Absenden als einelementiges `roles`-Array im Payload von
`POST /api/users` mitgesendet werden. Die Vorauswahl SHALL »Benutzer« (`CLIENT`)
sein.

#### Scenario: Gewählte Rolle wird gesendet
- **WHEN** der Administrator die Rolle »Administrator« wählt und den Benutzer anlegt
- **THEN** enthält der POST-Payload `roles: ["ADMIN"]`

#### Scenario: Standardrolle
- **WHEN** der Dialog geöffnet wird, ohne die Rolle zu ändern
- **THEN** ist »Benutzer« ausgewählt und der Payload enthält `roles: ["CLIENT"]`

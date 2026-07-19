## ADDED Requirements

### Requirement: Darstellung der Benutzerverwaltung
Die Benutzerverwaltungsseite SHALL die Benutzerliste als Hauptinhalt zeigen und
das Anlegen neuer Benutzer von der Liste trennen. Das Erstellungs-Formular SHALL
in einem Modal-Dialog dargestellt werden, der über einen Button »+ Neuer
Benutzer« geöffnet wird und nicht permanent sichtbar ist. Der Dialog SHALL per
Backdrop-Klick, Escape-Taste und »Abbrechen« schließbar sein und während er offen
ist das Scrollen des Seitenhintergrunds sperren.

#### Scenario: Liste ohne offenes Formular
- **WHEN** die Seite geladen wird
- **THEN** wird die Benutzerliste angezeigt und das Erstellungs-Formular ist nicht sichtbar

#### Scenario: Formular über Button öffnen
- **WHEN** der Administrator »+ Neuer Benutzer« anklickt
- **THEN** öffnet sich der Modal-Dialog mit dem Erstellungs-Formular

#### Scenario: Dialog abbrechen
- **WHEN** der Administrator den Dialog über Escape, Backdrop-Klick oder »Abbrechen« schließt
- **THEN** wird der Dialog geschlossen und kein Benutzer angelegt

#### Scenario: Erfolgreiche Anlage schließt den Dialog
- **WHEN** ein Benutzer im Dialog erfolgreich angelegt wird
- **THEN** wird der Dialog geschlossen und der neue Benutzer erscheint in der Liste

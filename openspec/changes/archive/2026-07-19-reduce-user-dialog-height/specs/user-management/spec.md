## MODIFIED Requirements

### Requirement: Darstellung der Benutzerverwaltung
Die Benutzerverwaltungsseite SHALL die Benutzerliste als Hauptinhalt zeigen und
das Anlegen neuer Benutzer von der Liste trennen. Das Erstellungs-Formular SHALL
in einem Modal-Dialog dargestellt werden, der über einen Button »+ Neuer
Benutzer« geöffnet wird und nicht permanent sichtbar ist. Der Dialog SHALL per
Backdrop-Klick, Escape-Taste und »Abbrechen« schließbar sein und während er offen
ist das Scrollen des Seitenhintergrunds sperren.

Der Dialog SHALL die Eingabefelder einspaltig (untereinander gestapelt) in der
Reihenfolge E-Mail, Vorname, Nachname, Rolle, Passwort, Passwort bestätigen
anzeigen, jeweils mit einem führenden Feld-Icon und einem als Pflichtfeld
gekennzeichneten Label. Der Dialog-Header SHALL eine Live-Vorschau zeigen. Der
vertikale Abstand zwischen dem Titelbereich und dem ersten Eingabefeld SHALL
kompakt gehalten sein, sodass der Dialog nicht unnötig hoch wird.

#### Scenario: Liste ohne offenes Formular
- **WHEN** die Seite geladen wird
- **THEN** wird die Benutzerliste angezeigt und das Erstellungs-Formular ist nicht sichtbar

#### Scenario: Formular über Button öffnen
- **WHEN** der Administrator »+ Neuer Benutzer« anklickt
- **THEN** öffnet sich der Modal-Dialog mit den einspaltig gestapelten Feldern E-Mail, Vorname, Nachname, Rolle, Passwort und Passwort bestätigen

#### Scenario: Kompakter Abstand zwischen Titel und Inhalt
- **WHEN** der Dialog geöffnet ist
- **THEN** ist der Abstand zwischen dem Titelbereich und dem ersten Eingabefeld reduziert (kein großer Leerraum unter dem Header)

#### Scenario: Dialog abbrechen
- **WHEN** der Administrator den Dialog über Escape, Backdrop-Klick oder »Abbrechen« schließt
- **THEN** wird der Dialog geschlossen und kein Benutzer angelegt

#### Scenario: Erfolgreiche Anlage schließt den Dialog
- **WHEN** ein Benutzer im Dialog erfolgreich angelegt wird
- **THEN** wird der Dialog geschlossen und der neue Benutzer erscheint in der Liste

# user-management Specification

## Purpose
Administrative Benutzerverwaltung (ADMIN-only): Anlegen, Bearbeiten, Rollen- und
Passwortverwaltung von Benutzern. Bislang spezifiziert: Anlegen mit
Initialpasswort. Weitere `USER-*`-Requirements folgen im Baseline-Backfill.
## Requirements
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

### Requirement: Live-Vorschau im Dialog-Header
Der Erstellungs-Dialog SHALL im Header einen Avatar und einen Vorschau-Text
anzeigen, die sich bei jeder Eingabe von Vor- und Nachname live aktualisieren.
Der Avatar SHALL die Initialen aus dem ersten Buchstaben von Vor- und Nachname
(in Großbuchstaben) zeigen, sobald mindestens einer der beiden Namen gesetzt ist,
und andernfalls einen Platzhalter (»?«). Der Vorschau-Text SHALL »Vorname
Nachname« lauten bzw. einen Platzhaltertext, solange kein Name eingegeben ist.

#### Scenario: Vorschau aktualisiert sich bei Eingabe
- **WHEN** der Administrator Vorname »Max« und Nachname »Mustermann« eingibt
- **THEN** zeigt der Avatar die Initialen »MM« und der Header »Vorschau: Max Mustermann«

#### Scenario: Platzhalter ohne Namen
- **WHEN** weder Vorname noch Nachname eingegeben sind
- **THEN** zeigt der Avatar den Platzhalter »?« und keinen zusammengesetzten Namen

### Requirement: Rollenauswahl beim Anlegen
Der Erstellungs-Dialog SHALL ein Pflicht-Auswahlfeld für die Rolle enthalten mit
den Optionen »Benutzer«, »Bearbeiter« und »Administrator«, die auf die
Systemrollen `USER`, `CONSULTANT` bzw. `ADMIN` abgebildet werden. Die gewählte
Rolle SHALL beim Absenden als einelementiges `roles`-Array im Payload von
`POST /api/users` mitgesendet werden. Die Vorauswahl SHALL »Benutzer« (`USER`)
sein.

#### Scenario: Gewählte Rolle wird gesendet
- **WHEN** der Administrator die Rolle »Administrator« wählt und den Benutzer anlegt
- **THEN** enthält der POST-Payload `roles: ["ADMIN"]`

#### Scenario: Standardrolle
- **WHEN** der Dialog geöffnet wird, ohne die Rolle zu ändern
- **THEN** ist »Benutzer« ausgewählt und der Payload enthält `roles: ["USER"]`

### Requirement: Passwort-Bestätigung und Sichtbarkeit
Der Erstellungs-Dialog SHALL neben dem Passwortfeld ein Bestätigungsfeld
enthalten. Sobald das Bestätigungsfeld nicht leer ist, SHALL unter dem Feld ein
Live-Hinweis erscheinen, der bei Übereinstimmung als Erfolg (grün) und bei
Abweichung als Fehler (rot) dargestellt wird. Ein Sichtbarkeits-Toggle (Auge)
SHALL beide Passwortfelder gemeinsam zwischen verdeckter und sichtbarer Anzeige
umschalten. Das System SHALL das Anlegen ablehnen, wenn Passwort und Bestätigung
nicht übereinstimmen, und darf in diesem Fall keinen POST-Aufruf auslösen.

#### Scenario: Übereinstimmende Passwörter
- **WHEN** Passwort und Bestätigung identisch sind
- **THEN** wird ein grüner Hinweis »Passwörter stimmen überein« angezeigt und das Anlegen ist möglich

#### Scenario: Abweichende Passwörter blockieren das Anlegen
- **WHEN** Passwort und Bestätigung sich unterscheiden und »Erstellen« geklickt wird
- **THEN** wird ein roter Hinweis angezeigt und es erfolgt kein `POST /api/users`

#### Scenario: Sichtbarkeit umschalten
- **WHEN** der Administrator den Auge-Toggle aktiviert
- **THEN** werden Passwort und Bestätigung im Klartext angezeigt


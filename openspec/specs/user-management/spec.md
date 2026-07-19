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

### Requirement: Bestehenden Benutzer bearbeiten
Das System SHALL Administratoren erlauben, einen bestehenden Benutzer über eine
Aktion »Bearbeiten« je Tabellenzeile in einem Modal-Dialog zu bearbeiten. Der
Dialog SHALL Vorname und Nachname als editierbare Felder sowie ein
Rollen-Auswahlfeld (Einzelauswahl mit den Optionen Benutzer, Bearbeiter,
Administrator) enthalten und die E-Mail schreibgeschützt anzeigen. Beim Öffnen
SHALL die aktuell höchste Rolle des Benutzers (Priorität Administrator vor
Bearbeiter vor Benutzer) vorausgewählt sein. Beim Speichern SHALL das System
`PUT /api/users/{id}` mit `firstName`, `lastName` und der gewählten Rolle als
`roles`-Array aufrufen und die Benutzerliste aktualisieren. Der Dialog SHALL per
Escape, Backdrop-Klick und »Abbrechen« ohne Speichern schließbar sein.

#### Scenario: Benutzer bearbeiten und speichern
- **WHEN** der Administrator »Bearbeiten« wählt, Vor-/Nachname ändert und speichert
- **THEN** wird `PUT /api/users/{id}` mit den geänderten Feldern und der gewählten Rolle aufgerufen und die Liste zeigt die Änderung

#### Scenario: Rolle wird vorausgewählt
- **WHEN** der Bearbeiten-Dialog für einen Benutzer geöffnet wird
- **THEN** ist dessen höchste vorhandene Rolle im Auswahlfeld vorausgewählt

#### Scenario: Bearbeiten abbrechen
- **WHEN** der Administrator den Dialog über Escape, Backdrop-Klick oder »Abbrechen« schließt
- **THEN** wird nichts gespeichert und der Benutzer bleibt unverändert

### Requirement: Benutzer löschen mit Bestätigungsdialog
Das System SHALL Administratoren erlauben, einen Benutzer über eine Aktion
»Löschen« zu entfernen. Vor dem Löschen SHALL ein gestylter Bestätigungsdialog
(keine Browser-`alert()`/`confirm()`-Meldung) angezeigt werden. Erst nach
Bestätigung SHALL `DELETE /api/users/{id}` ausgeführt und der Benutzer aus der
Liste entfernt werden; bei Abbruch SHALL keine Aktion erfolgen.

#### Scenario: Löschen bestätigen
- **WHEN** der Administrator »Löschen« wählt und im Bestätigungsdialog bestätigt
- **THEN** wird `DELETE /api/users/{id}` aufgerufen und der Benutzer verschwindet aus der Liste

#### Scenario: Löschen abbrechen
- **WHEN** der Administrator im Bestätigungsdialog abbricht
- **THEN** wird kein `DELETE` aufgerufen und der Benutzer bleibt in der Liste

#### Scenario: Kein Browser-Dialog
- **WHEN** der Administrator »Löschen« wählt
- **THEN** erscheint der anwendungseigene Bestätigungsdialog statt eines Browser-`confirm()`

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


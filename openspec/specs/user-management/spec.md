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
Die Benutzerverwaltungsseite (`/admin/portal/users`) SHALL die Benutzerliste als
Hauptinhalt zeigen und das Anlegen neuer Benutzer von der Liste trennen. Das
Erstellungs-Formular SHALL auf einer **eigenen Route** `/admin/portal/users/new`
(nur für ADMIN) dargestellt werden — nicht als Modal-Dialog —, erreichbar über
einen Button »+ Neuer Benutzer«, der dorthin navigiert.

Das Formular SHALL die volle verfügbare Breite des Inhaltsbereichs nutzen und die
Eingabefelder in der Reihenfolge E-Mail, Vorname, Nachname, Rolle(n), Passwort,
Passwort bestätigen anzeigen, jeweils mit einem führenden Feld-Icon und einem als
Pflichtfeld gekennzeichneten Label, und im Kopfbereich eine Live-Vorschau zeigen.
Um die Höhe kompakt zu halten (sichtbar ohne Scrollen), SHALL Vorname und
Nachname in einer gemeinsamen Zeile (zwei Spalten) stehen und Passwort und
Passwort bestätigen ebenfalls in einer gemeinsamen Zeile (zwei Spalten); ist im
Bearbeiten-Modus kein Passwort eingegeben und das Bestätigungsfeld ausgeblendet,
SHALL das Passwortfeld die volle Breite behalten. Die übrigen Felder bleiben
einspaltig. »Abbrechen« SHALL ohne Anlegen zur Liste zurückführen; nach
erfolgreicher Anlage SHALL zur Liste zurücknavigiert werden, wo der neue Benutzer
erscheint.

#### Scenario: Liste ohne offenes Formular
- **WHEN** `/admin/portal/users` geladen wird
- **THEN** wird die Benutzerliste angezeigt und kein Erstellungs-Formular ist eingebettet

#### Scenario: Formular über Button öffnen
- **WHEN** der Administrator »+ Neuer Benutzer« anklickt
- **THEN** wird zu `/admin/portal/users/new` navigiert und das Erstellungs-Formular als eigene Seite angezeigt

#### Scenario: Volle Breite und Vorname/Nachname in einer Zeile
- **WHEN** das Formular angezeigt wird
- **THEN** nutzt die Karte die volle verfügbare Breite und Vorname und Nachname stehen nebeneinander in einer Zeile

#### Scenario: Passwort und Bestätigung in einer Zeile
- **WHEN** das Erstellungs-Formular angezeigt wird oder im Bearbeiten-Modus ein Passwort eingegeben wurde
- **THEN** stehen Passwort und Passwort bestätigen nebeneinander in einer Zeile

#### Scenario: Kompakter Abstand zwischen Titel und Inhalt
- **WHEN** das Erstellungs-Formular angezeigt wird
- **THEN** ist der Abstand zwischen dem Titelbereich und dem ersten Eingabefeld kompakt gehalten

#### Scenario: Dialog abbrechen
- **WHEN** der Administrator im Formular »Abbrechen« wählt
- **THEN** wird zur Liste zurücknavigiert und kein Benutzer angelegt

#### Scenario: Erfolgreiche Anlage schließt den Dialog
- **WHEN** ein Benutzer erfolgreich angelegt wird
- **THEN** wird zur Liste zurücknavigiert und der neue Benutzer erscheint dort

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

### Requirement: Schutz der Administratorrolle
Das System SHALL verhindern, dass die Anwendung ohne Administrator zurückbleibt
oder ein Administrator sich selbst die Administratorrechte entzieht. Beim
Aktualisieren eines Benutzers SHALL das System einen Entzug der ADMIN-Rolle
(der Benutzer besitzt ADMIN, die neue Rollenmenge enthält kein ADMIN) mit einem
Validierungsfehler (HTTP 400) ablehnen, wenn der betroffene Benutzer der
angemeldete Administrator ist oder wenn es der einzige verbleibende Benutzer mit
ADMIN-Rolle ist. Diese Prüfung SHALL serverseitig autoritativ erfolgen; das UI
SOLL den Entzug in diesen Fällen zusätzlich unterbinden (deaktivierte
ADMIN-Auswahl mit Hinweis).

#### Scenario: Eigene Admin-Rolle kann nicht entzogen werden
- **WHEN** der angemeldete Administrator bei seinem eigenen Konto die ADMIN-Rolle abwählt und speichert
- **THEN** lehnt das System die Aktualisierung mit HTTP 400 ab und die Rolle bleibt erhalten

#### Scenario: Letzte Admin-Rolle kann nicht entzogen werden
- **WHEN** die ADMIN-Rolle beim einzigen verbleibenden Administrator entzogen werden soll
- **THEN** lehnt das System die Aktualisierung mit HTTP 400 ab

#### Scenario: Entzug bei weiteren Administratoren erlaubt
- **WHEN** die ADMIN-Rolle bei einem von mehreren Administratoren entzogen wird (nicht dem angemeldeten selbst)
- **THEN** wird die Aktualisierung durchgeführt

#### Scenario: UI unterbindet den Entzug
- **WHEN** der Bearbeiten-Dialog für den angemeldeten oder den einzigen Administrator geöffnet wird
- **THEN** ist die ADMIN-Auswahl deaktiviert und ein Hinweis erklärt den Grund

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

### Requirement: E-Mail-Vorbefüllung im Login nach Passwortänderung
Nach einer erfolgreichen Passwortänderung SHALL das System den Benutzer abmelden
und zum Login-Screen leiten, wobei die E-Mail des bisher angemeldeten Benutzers
in das E-Mail-Feld des Login-Formulars vorbefüllt wird. Ruft ein Benutzer den
Login-Screen ohne vorherige Passwortänderung auf, SHALL das E-Mail-Feld leer
bleiben.

#### Scenario: E-Mail ist nach Passwortänderung vorbefüllt
- **WHEN** ein Benutzer sein Passwort erfolgreich ändert und zum Login weitergeleitet wird
- **THEN** ist im Login-Formular seine bisherige E-Mail im E-Mail-Feld vorausgefüllt

#### Scenario: Direktaufruf des Logins ohne Vorbefüllung
- **WHEN** der Login-Screen ohne vorangegangene Passwortänderung geöffnet wird
- **THEN** ist das E-Mail-Feld leer

### Requirement: Benutzer löschen — abhängige Daten und Eigentumsschutz
Beim Löschen eines Benutzers SHALL das System zunächst prüfen, ob der Benutzer
noch Inhalte besitzt (Ordner, Dokumente, Medien oder CMS-Seiten). Ist das der
Fall, SHALL das Löschen mit einem Validierungsfehler (HTTP 400) und einer klaren
Meldung abgelehnt werden, und es SHALL nichts gelöscht werden. Andernfalls SHALL
das System die abhängigen, unkritischen Daten des Benutzers entfernen
(Sessions/`refresh_tokens`, `activity_log`-Einträge, gesendete und empfangene
`document_shares`) sowie die Bearbeiter-Zuordnung in `content_blocks`
(`updated_by`) auf `NULL` setzen und anschließend den Benutzer löschen. Die
Bereinigung und das Löschen SHALL atomar (in einer Transaktion) erfolgen. Das
Frontend SHALL eine abgelehnte Löschung als Fehlermeldung anzeigen.

#### Scenario: Löschen ohne eigene Inhalte
- **WHEN** ein Administrator einen Benutzer ohne eigene Ordner/Dokumente/Medien/Seiten löscht
- **THEN** werden dessen Sessions, Aktivitätsprotokoll und Freigaben entfernt, die Bearbeiter-Zuordnung in Inhaltsblöcken auf `NULL` gesetzt und der Benutzer gelöscht

#### Scenario: Löschen mit eigenen Inhalten wird abgelehnt
- **WHEN** ein Administrator einen Benutzer löscht, der noch Ordner, Dokumente, Medien oder CMS-Seiten besitzt
- **THEN** antwortet das System mit HTTP 400 und einer erklärenden Meldung und der Benutzer bleibt bestehen

#### Scenario: Fehlermeldung im UI
- **WHEN** ein Löschversuch serverseitig abgelehnt wird
- **THEN** zeigt die Benutzerliste die Server-Fehlermeldung an

### Requirement: Schutz vor Selbst- und Letzter-Admin-Löschung
Das System SHALL verhindern, dass ein Administrator sein eigenes Konto oder den
letzten verbleibenden Administrator löscht. Beim Löschen eines Benutzers SHALL
das System mit einem Validierungsfehler (HTTP 400) ablehnen, wenn der zu
löschende Benutzer der angemeldete Benutzer ist oder wenn der Benutzer die
ADMIN-Rolle besitzt und der einzige verbleibende Administrator ist. Diese
Prüfungen SHALL serverseitig autoritativ erfolgen und vor der Bereinigung
abhängiger Daten greifen; das UI SOLL den »Löschen«-Button in diesen Fällen
zusätzlich deaktivieren.

#### Scenario: Eigenes Konto kann nicht gelöscht werden
- **WHEN** der angemeldete Administrator versucht, sein eigenes Konto zu löschen
- **THEN** lehnt das System mit HTTP 400 ab und der Benutzer bleibt bestehen

#### Scenario: Letzter Administrator kann nicht gelöscht werden
- **WHEN** der einzige verbleibende Administrator gelöscht werden soll
- **THEN** lehnt das System mit HTTP 400 ab

#### Scenario: Löschen eines anderen Nicht-letzten Kontos erlaubt
- **WHEN** ein anderes Konto gelöscht wird, das weder das eigene noch der letzte Administrator ist
- **THEN** wird das Löschen (nach den übrigen Prüfungen) durchgeführt

#### Scenario: UI deaktiviert den Löschen-Button
- **WHEN** die Benutzerliste das eigene Konto oder den einzigen Administrator anzeigt
- **THEN** ist dessen »Löschen«-Button deaktiviert


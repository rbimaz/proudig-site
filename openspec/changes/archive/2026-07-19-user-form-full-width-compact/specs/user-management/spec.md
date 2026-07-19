## MODIFIED Requirements

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
Nachname in einer gemeinsamen Zeile (zwei Spalten) stehen; die übrigen Felder
bleiben einspaltig. »Abbrechen« SHALL ohne Anlegen zur Liste zurückführen; nach
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

#### Scenario: Kompakter Abstand zwischen Titel und Inhalt
- **WHEN** das Erstellungs-Formular angezeigt wird
- **THEN** ist der Abstand zwischen dem Titelbereich und dem ersten Eingabefeld kompakt gehalten

#### Scenario: Dialog abbrechen
- **WHEN** der Administrator im Formular »Abbrechen« wählt
- **THEN** wird zur Liste zurücknavigiert und kein Benutzer angelegt

#### Scenario: Erfolgreiche Anlage schließt den Dialog
- **WHEN** ein Benutzer erfolgreich angelegt wird
- **THEN** wird zur Liste zurücknavigiert und der neue Benutzer erscheint dort

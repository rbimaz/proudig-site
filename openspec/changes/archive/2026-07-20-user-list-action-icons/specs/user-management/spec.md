## ADDED Requirements

### Requirement: Darstellung der Aktionsspalte in der Benutzerliste
Die Aktionsspalte der Benutzerliste SHALL rechtsbündig ausgerichtet sein
(Spaltenkopf und Zellen). Die Aktionen »Bearbeiten« und »Löschen« SHALL als
reine Icon-Buttons ohne sichtbaren Text dargestellt werden (Stift- bzw.
Papierkorb-Icon) und jeweils ein zugängliches Label (`aria-label`/`title`)
tragen. Der »Bearbeiten«-Button SHALL keine blaue Schrift verwenden.

#### Scenario: Aktionsspalte rechtsbündig
- **WHEN** die Benutzerliste angezeigt wird
- **THEN** ist die Spalte »Aktionen« (Kopf und Zellen) rechtsbündig ausgerichtet

#### Scenario: Icon-Buttons ohne Text
- **WHEN** die Aktionen einer Zeile angezeigt werden
- **THEN** erscheinen »Bearbeiten« und »Löschen« nur als Icon (ohne sichtbaren Text), mit zugänglichem Label

#### Scenario: Bearbeiten ohne blaue Schrift
- **WHEN** der »Bearbeiten«-Button dargestellt wird
- **THEN** verwendet er keine blaue Schriftfarbe

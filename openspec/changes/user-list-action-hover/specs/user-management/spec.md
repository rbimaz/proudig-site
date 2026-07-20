## ADDED Requirements

### Requirement: Hover-Darstellung der Aktions-Buttons
Die Aktions-Buttons der Benutzerliste SHALL beim Überfahren mit der Maus einen
gefüllten Hintergrund und weiße Schrift zeigen: der »Bearbeiten«-Button in der
Primärfarbe (Orange), der »Löschen«-Button in der Gefahren-Farbe (Rot). Dieses
Hover-Verhalten SHALL auf die Aktions-Buttons der Benutzerliste beschränkt sein
und andere kleine Buttons im Portal nicht verändern.

#### Scenario: Bearbeiten-Hover
- **WHEN** der Mauszeiger über dem »Bearbeiten«-Button liegt
- **THEN** hat der Button einen orangen (primären) Hintergrund und weiße Schrift

#### Scenario: Löschen-Hover
- **WHEN** der Mauszeiger über dem »Löschen«-Button liegt
- **THEN** hat der Button einen roten Hintergrund und weiße Schrift

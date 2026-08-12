## ADDED Requirements

### Requirement: Effiziente, kontextbasierte Zugriffsbewertung

Das Portal SHALL die effektive Berechtigung für eine Ordnerliste über einen je
Anfrage **einmal** aufgebauten Zugriffs-Kontext bewerten: Die Gruppen des Nutzers
und dessen Freigaben (direkt und über Gruppen) SHALL je Anfrage **einmal** geladen
werden; die anschließende Bewertung einzelner Ordner SHALL **keine** zusätzlichen
Freigabe- oder Gruppen-Datenbankabfragen auslösen. Die so ermittelten
Berechtigungen SHALL **identisch** zu einer Einzelprüfung sein.

#### Scenario: Identische Ergebnisse wie die Einzelprüfung

- **WHEN** die effektive Berechtigung eines Nutzers auf einen Ordner über den
  Kontext bestimmt wird
- **THEN** ist das Ergebnis identisch zur Bewertung ohne Kontext (gleiche Stufe
  NONE/READ/WRITE/FULL) für alle Kombinationen aus Eigentum, ADMIN, Nutzer- und
  Gruppen-Freigaben sowie Vererbung

#### Scenario: Konstante Zahl an Freigabe-/Gruppen-Abfragen je Anfrage

- **WHEN** eine Ordnerliste mit mehreren Ordnern bewertet wird
- **THEN** werden die Gruppen des Nutzers und dessen Freigaben je Anfrage nur
  einmal geladen (die Query-Anzahl für Gruppen/Freigaben wächst nicht mit der
  Anzahl der Ordner)

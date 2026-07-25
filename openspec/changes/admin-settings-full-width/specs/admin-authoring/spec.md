## ADDED Requirements

### Requirement: Einstellungsseite in konsistenter Breite
Die Admin-Einstellungsseite SHALL dieselbe volle Content-Breite/rechte Kante wie die Admin-Listen und
die Mediathek nutzen. Das Formular SHALL nicht künstlich (z. B. per fester `max-width`) schmaler als der
Content-Bereich dargestellt werden. Feldeigene Breitenbegrenzungen einzelner Eingaben (z. B. Duration-
Felder) bleiben davon unberührt.

#### Scenario: Einstellungs-Breite
- **WHEN** die Admin-Einstellungsseite angezeigt wird
- **THEN** nutzt das Einstellungsformular dieselbe volle Content-Breite/rechte Kante wie die übrigen Admin-Übersichten
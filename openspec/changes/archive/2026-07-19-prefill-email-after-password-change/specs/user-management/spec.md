## ADDED Requirements

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

## ADDED Requirements

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

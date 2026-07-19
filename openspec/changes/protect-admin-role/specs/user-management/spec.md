## ADDED Requirements

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

## ADDED Requirements

### Requirement: Passwort-Sichtbarkeit umschalten

Passwortfelder auf der Login-Seite (`/admin/login`) und der Passwort-ändern-Seite
(`/admin/portal/change-password`) SHALL eine Umschaltmöglichkeit anbieten, mit der
der eingegebene Text sichtbar oder verdeckt dargestellt wird. Standardmäßig SHALL
das Passwort verdeckt sein (`type=password`); beim Einschalten SHALL es im Klartext
angezeigt werden (`type=text`). Die Umschaltung SHALL je Feld unabhängig wirken.

#### Scenario: Passwort auf der Login-Seite einblenden

- **WHEN** ein Nutzer auf `/admin/login` den Sichtbarkeits-Toggle des Passwortfelds aktiviert
- **THEN** wird das eingegebene Passwort im Klartext angezeigt; erneutes Umschalten verdeckt es wieder

#### Scenario: Felder auf der Passwort-ändern-Seite einzeln umschalten

- **WHEN** ein Nutzer auf `/admin/portal/change-password` den Toggle eines der drei
  Felder (aktuelles / neues / Bestätigung) aktiviert
- **THEN** wird nur dieses Feld sichtbar; die anderen bleiben verdeckt

#### Scenario: Standard verdeckt

- **WHEN** eine der beiden Seiten geladen wird
- **THEN** sind alle Passwortfelder zunächst verdeckt

### Requirement: Passwort-geändert-Meldung im ProuDig-Design

Die Erfolgsansicht „Passwort erfolgreich geändert" SHALL im ProuDig-Design
dargestellt werden (Marken-Orange bzw. neutrale/dunkle Töne). Sie SHALL KEINE
grünen Elemente enthalten (weder grüner Hintergrund, noch grünes Icon oder
grüner Fortschrittsbalken).

#### Scenario: Erfolgsmeldung ohne Grün

- **WHEN** ein Passwort erfolgreich geändert wurde und die Erfolgsansicht erscheint
- **THEN** verwendet sie ausschließlich ProuDig-Markenfarben/neutrale Töne und keine
  grünen Elemente

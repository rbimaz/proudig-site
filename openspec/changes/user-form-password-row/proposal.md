## Why

Passwort und Passwort-Bestätigung liegen im Benutzer-Formular noch untereinander.
Analog zu Vorname/Nachname sollen sie in einer gemeinsamen Zeile nebeneinander
stehen, um die Höhe weiter zu reduzieren.

## What Changes

- **Passwort und Passwort bestätigen** stehen im Formular in **einer Zeile**
  (zwei Spalten). Im Bearbeiten-Modus, solange kein Passwort eingegeben ist und
  das Bestätigungsfeld ausgeblendet bleibt, SHALL das Passwortfeld die volle
  Breite behalten.

## Non-Goals

- Keine weiteren Feldpaare; keine Änderung an Validierung oder Verhalten.

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirement „Darstellung der Benutzerverwaltung" wird um
  die zweispaltige Passwort/Bestätigung-Zeile präzisiert.

## Impact

- Frontend: `PortalUserForm.jsx` (Passwort + Bestätigung in `.ucd-row`),
  `portal.css` (`.ucd-row-single` für Einzelfeld-Fall).

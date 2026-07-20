## Why

Die Aktionsspalte der Benutzerliste (`/admin/portal/users`) ist linksbündig und
die Buttons »Bearbeiten«/»Löschen« zeigen Text; »Bearbeiten« hat zudem blaue
Schrift. Gewünscht ist eine kompaktere, konsistentere Darstellung.

## What Changes

- Die Spalte **Aktionen** (Kopf und Zellen) wird **rechtsbündig** ausgerichtet.
- Die Buttons **Bearbeiten** und **Löschen** zeigen **nur ein Icon**, keinen Text
  (Stift- bzw. Papierkorb-Icon), mit zugänglichem Label (`aria-label`/`title`).
- **Bearbeiten** hat **keine blaue Schrift** mehr (neutrale Darstellung).

## Non-Goals

- Keine Änderung an Funktion, Reihenfolge oder Löschschutz der Aktionen.
- Der rote Farbton des Löschen-Buttons bleibt (Gefahren-Aktion).

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zur Darstellung der Aktionsspalte
  (rechtsbündig, Icon-Buttons, kein Blau bei Bearbeiten).

## Impact

- Frontend: `PortalUsers.jsx` (Icon-Buttons + Labels), `portal.css`
  (Rechtsbündigkeit der Aktionsspalte, neutraler Bearbeiten-Button); Tests
  nutzen Rollen-/Label-Selektoren statt Text.

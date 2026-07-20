## Why

Die Icon-Buttons »Bearbeiten«/»Löschen« in der Benutzerliste haben aktuell einen
dezenten „Ghost"-Hover (farbige Schrift, kaum Hintergrund). Gewünscht ist ein
kräftigerer Hover wie bei den normalen Buttons: gefüllter Hintergrund + weiße
Schrift.

## What Changes

- **Nur in der Benutzerliste** (`.user-actions`):
  - **Bearbeiten:** Hover-Hintergrund wird primär (Orange `--orange`), Schrift
    weiß.
  - **Löschen:** Hover-Hintergrund wird rot (Gefahren-Farbe `#DC2626`), Schrift
    weiß — behält also seinen roten Charakter.
- Andere `.btn-sm`-Buttons im Portal bleiben unverändert.

## Non-Goals

- Keine Änderung an anderen Seiten/Buttons; keine Änderung an Funktion/Layout.

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zum Hover-Verhalten der
  Aktions-Buttons in der Benutzerliste.

## Impact

- Frontend: `portal.css` (Hover-Regeln für `.user-actions .btn-sm`).

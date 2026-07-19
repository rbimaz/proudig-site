## Why

Das Benutzer-Formular (Anlegen/Bearbeiten) wird als schmale Karte (max. 470 px)
mit rein einspaltigen Feldern dargestellt. Dadurch ist die Karte unnötig hoch und
erfordert je nach Bildschirm Scrollen. Sie soll die volle verfügbare Breite nutzen
und niedriger werden, sodass sie ohne Scrollen sichtbar ist.

## What Changes

- **Volle Breite:** Die Formular-Karte (`.user-form-page`) nutzt die gesamte
  verfügbare Breite des Inhaltsbereichs statt der bisherigen `max-width: 470px`.
- **Geringere Höhe:** Vorname und Nachname stehen in **einer Zeile** nebeneinander
  (zwei Spalten); alle übrigen Felder bleiben einspaltig. Dadurch entfällt eine
  Formularzeile.
- Gilt für Anlegen und Bearbeiten (dieselbe Komponente `PortalUserForm`).

## Non-Goals

- Keine weiteren Feldpaare nebeneinander (nur Vorname/Nachname).
- Keine Änderung an Feldern, Validierung oder Verhalten.

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirement „Darstellung der Benutzerverwaltung" wird um
  volle Breite und die zweispaltige Vorname/Nachname-Zeile präzisiert.

## Impact

- Frontend: `PortalUserForm.jsx` (Vorname/Nachname in eine Zeile), `portal.css`
  (Karte volle Breite, Zeilen-Layout).

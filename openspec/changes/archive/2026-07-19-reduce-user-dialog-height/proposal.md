## Why

Der Dialog „Neuen Benutzer erstellen" wirkt zu hoch. Zwischen dem Header (Titel +
Vorschau) und dem ersten Eingabefeld ist der Abstand unnötig groß: die untere
Header-Polsterung (22 px) und die obere Body-Polsterung (24 px) summieren sich zu
~46 px. Ziel: diesen Abstand reduzieren und damit die Gesamthöhe des Dialogs
verringern, ohne das übrige Layout zu ändern.

## What Changes

- `.ucd-header` untere Polsterung von `22px` auf `14px` reduzieren.
- `.ucd-body` obere Polsterung von `24px` auf `16px` reduzieren.
- Keine Änderung an Feldabständen, Footer, Breite oder Funktionalität.

## Capabilities

### Modified Capabilities
- `user-management`: Präzisiert die Requirement „Darstellung der
  Benutzerverwaltung" um einen kompakteren Abstand zwischen Titelbereich und
  Formularinhalt.

## Impact

- Betroffener Code: `src/main/frontend/src/portal.css` (zwei Padding-Werte).

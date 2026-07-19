## Why

Auf `/admin/portal/users` steht das Erstellungs-Formular dauerhaft aufgeklappt
direkt über der Benutzerliste. Formular und Liste "vermischen" sich optisch; die
Liste ist als eigentlicher Hauptinhalt nicht klar erkennbar.

## What Changes

- Das Erstellungs-Formular wird in einen **Modal-Dialog** verlagert, der über
  einen Button »+ Neuer Benutzer« im Seitenkopf geöffnet wird.
- Die Benutzerliste ist der alleinige Hauptinhalt der Seite.
- Der Dialog folgt dem bestehenden Overlay-Muster (`ConfirmDialog`): schließen per
  Backdrop-Klick, Escape und »Abbrechen«; Body-Scroll wird gesperrt.
- Verhalten und Validierung der Anlage bleiben unverändert (Passwort Pflicht,
  Fehlermeldung, Reset nach Erfolg).

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zur Darstellung der
  Benutzerverwaltung (Trennung von Liste und Anlage via Modal). Die bestehende
  Requirement "Benutzer anlegen" bleibt inhaltlich unverändert.

## Impact

- Betroffener Code: `PortalUsers.jsx`, `portal.css`.
- Keine Backend-Änderung. Bestehende Tests bleiben gültig; ggf. Anpassung, dass
  das Formular erst nach Öffnen des Dialogs sichtbar ist.

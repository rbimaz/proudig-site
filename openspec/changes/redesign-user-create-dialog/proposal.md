## Why

Der Dialog „Neuen Benutzer erstellen" (`PortalUsers.jsx`) ist ein schlichtes
2×2-Raster ohne Rollenauswahl und ohne Passwort-Absicherung. Ein Design-Handoff
(Option 1c, `1c-preview.png` maßgeblich) definiert einen überarbeiteten Dialog:
gestapelte Felder mit Icons, Live-Vorschau (Avatar + Name), Rollen-Auswahl als
Pflichtfeld sowie ein Passwort-Bestätigungsfeld mit Live-Feedback und
Sichtbarkeits-Toggle. Ziel: den bestehenden Dialog so umbauen, dass er dem
Referenz-Screenshot entspricht, ohne das Backend zu ändern.

## What Changes

- **Layout:** Alle Felder einspaltig gestapelt statt 2×2-Raster; führende
  Feld-Icons (E-Mail, Person, Schild, Schloss) aus dem vorhandenen
  Bootstrap-Icon-Set.
- **Live-Vorschau:** Header mit Avatar (Initialen aus Vor-/Nachname, gefüllt
  sobald vorhanden) und „Vorschau: <Vorname Nachname>".
- **Rollenauswahl:** Neues Pflicht-Select mit den Optionen Benutzer, Bearbeiter,
  Administrator, das auf die Systemrollen `USER`, `CONSULTANT`, `ADMIN` abgebildet
  und im `roles`-Array des bestehenden `POST /api/users` mitgesendet wird.
- **Passwort:** Zusätzliches Bestätigungsfeld mit Live-Match-Hinweis
  (grün/rot), gemeinsamer Sichtbarkeits-Toggle (Auge) für beide Passwortfelder;
  „Erstellen" nur bei übereinstimmenden Passwörtern.
- **Styling:** High-Fidelity gemäß Handoff-Tokens (Orange `#E0710E`, Feldhöhe
  50 px, Radien 12–20 px) in `portal.css`, konsistent mit der Portal-Hausschrift.

## Non-Goals

- Keine Backend-Änderungen: `POST /api/users` akzeptiert `roles` bereits.
- Kein Mehrfach-Rollen-Widget im Dialog (die Liste behält ihre Rollen-Badges);
  im Dialog wird genau eine Rolle gewählt.
- Keine Änderung an Bearbeiten/Löschen/Rollen-Toggle in der Benutzerliste.

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirement „Darstellung der Benutzerverwaltung" wird um
  das überarbeitete Dialog-Layout (Option 1c) präzisiert; neue Requirements für
  Rollenauswahl, Passwort-Bestätigung und Live-Vorschau kommen hinzu.

## Impact

- Betroffener Code: `PortalUsers.jsx` (Dialog-Markup, State, Validierung,
  Payload-Mapping), `portal.css` (Dialog-Styles), `PortalUsers.test.jsx`
  (angepasste/ergänzte Tests).
- Referenz: `docs/REQUIREMENTS.md` (`USER-FIELD-*`), Handoff
  `design_handoff_adduser/README.md` + `1c-preview.png`.

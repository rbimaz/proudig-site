## Why

Beim Eingeben von Passwörtern gibt es keine Möglichkeit, das Eingetippte
sichtbar zu machen — das erschwert korrekte Eingabe (Tippfehler bei
verdeckten Feldern). Außerdem nutzt die Erfolgsmeldung „Passwort erfolgreich
geändert" grüne Elemente, die nicht zum ProuDig-Design passen.

## What Changes

- **Passwort-Sichtbarkeit umschalten**: An den Passwortfeldern der beiden
  Auth-Seiten wird ein Auge-Icon-Toggle ergänzt, der das Feld zwischen
  verdeckt (`type=password`) und sichtbar (`type=text`) umschaltet. Standard:
  verdeckt.
  - `/admin/login` (1 Feld)
  - `/admin/portal/change-password` (3 Felder: aktuelles / neues / Bestätigung)
- **Erfolgsmeldung im ProuDig-Design**: Die Erfolgsansicht „Passwort erfolgreich
  geändert" (change-password) wird von grünen Farben (`#ecfdf5`, `#10b981`) auf
  das ProuDig-Design umgestellt (Marken-Orange `#E8731A` / dunkles Navy /
  neutrale Töne). **Keine grünen Elemente** mehr.

## Capabilities

### New Capabilities
- `auth-password-ux`: UX der Passwort-Eingabe in den Auth-Flows —
  Sichtbarkeits-Umschaltung an Passwortfeldern und markenkonforme Darstellung
  der Passwort-geändert-Erfolgsmeldung.

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. Die Passwort-Sichtbarkeit
     und die Erfolgs-Optik waren bisher nicht spezifiziert. -->

## Impact

- Frontend: `AdminLogin.jsx`, `ChangePassword.jsx`.
- Kein Backend-/DB-Change.
- Optional (out of scope, nur Hinweis): die Passwort-Felder im „Sicherheit"-
  Abschnitt der Profil-Seite könnten denselben Toggle erhalten — hier bewusst
  auf die beiden genannten Seiten begrenzt.

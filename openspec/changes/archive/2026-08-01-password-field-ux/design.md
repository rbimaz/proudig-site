## Context

- `AdminLogin.jsx`: ein Passwortfeld (`type=password`), kein Toggle. Nutzt bereits
  Bootstrap-Icons und Marken-Orange `#E8731A`.
- `ChangePassword.jsx`: drei Passwortfelder; die Erfolgsansicht („Passwort
  erfolgreich geändert") nutzt Grün: `#ecfdf5` (Hintergrund), `#10b981` (Haken-Icon
  und Fortschrittsbalken).
- **Vorhandenes Muster**: `PortalUserForm.jsx` hat bereits einen Show/Hide-Toggle
  (`showPassword`-State + `bi-eye`/`bi-eye-slash`). Das wird für Konsistenz gespiegelt.

## Goals / Non-Goals

**Goals:**
- Pro Passwortfeld ein unabhängiger Sichtbarkeits-Toggle (Auge-Icon).
- Erfolgsmeldung im ProuDig-Design, keine grünen Elemente.

**Non-Goals:**
- Kein neues, projektweites `PasswordInput`-Shared-Component (inline nach
  bestehendem Muster genügt; Extraktion wäre separater Aufräum-Change).
- Keine Änderung an den Passwort-Feldern der Profil-Seite (bewusst auf die zwei
  genannten Seiten begrenzt).
- Kein Backend-/DB-Change.

## Decisions

**1. Toggle nach bestehendem Muster (`PortalUserForm`).**
Je Feld ein eigener `showPassword`-State; ein Button mit `bi-eye`/`bi-eye-slash`
schaltet `type` zwischen `password` und `text`. Standard verdeckt. Toggle-Button
mit `aria-label` (z. B. „Passwort anzeigen"/„Passwort verbergen").
- AdminLogin: 1 Feld.
- ChangePassword: 3 unabhängige Felder.

**2. Erfolgsmeldung: Grün → ProuDig.**
- Haken-Icon-Stroke `#10b981` → `#E8731A` (Marken-Orange).
- Fortschrittsbalken `#10b981` → `#E8731A`.
- Icon-Hintergrund `#ecfdf5` (grün) → neutraler/dezent-oranger Ton
  (z. B. `#FFF4EC` oder neutrales `#f8fafc`).
- Dunkler Text (`#1a1a2e`) und Slate-Töne (`#64748b`, `#e2e8f0`) bleiben (neutral,
  kein Grün).

## Risks / Trade-offs

- [Inkonsistenz zu anderen Passwortfeldern] → durch Wiederverwendung des
  `PortalUserForm`-Musters minimiert.
- [Barrierefreiheit] → Toggle als `<button type="button">` mit `aria-label`, damit
  er Formulare nicht absendet und für Screenreader beschriftet ist.

## Open Questions

- Später optional: einen gemeinsamen `PasswordInput`-Component extrahieren und
  überall (inkl. Profil-Seite, PortalUserForm) verwenden.

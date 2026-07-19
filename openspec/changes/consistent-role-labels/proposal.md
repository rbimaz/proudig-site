## Why

Die Rollenbezeichnungen sind uneinheitlich: Im Erstellungs-/Bearbeiten-Formular
erscheinen »Benutzer«, »Bearbeiter«, »Administrator«, in der Benutzerliste
dagegen die Rohwerte `ADMIN`, `CONSULTANT`, `CLIENT`. Es sollen durchgängig die
Begriffe **Admin**, **Consultant**, **Customer** angezeigt werden.

## What Changes

- **Einheitliche Anzeige-Labels** überall (Formular-Auswahl und Listen-Badges):
  - `ADMIN` → **Admin**
  - `CONSULTANT` → **Consultant**
  - `CLIENT` → **Customer**
- Nur die **Anzeige** ändert sich; die Systemrollen-Werte (`ADMIN`,
  `CONSULTANT`, `CLIENT`) und die Payloads bleiben unverändert.

## Non-Goals

- Keine Änderung an Rollenwerten, DB, Payloads oder Autorisierung.

## Capabilities

### Modified Capabilities
- `user-management`: Anzeigebezeichnungen der Rollen vereinheitlicht; die
  Requirements „Rollenauswahl beim Anlegen" und „Bestehenden Benutzer bearbeiten"
  verwenden die neuen Labels, plus eine Requirement zur durchgängigen
  Bezeichnung.

## Impact

- Frontend: `PortalUserForm.jsx` (Auswahl-Labels), `PortalUsers.jsx`
  (Badge-Labels via Mapping); Tests entsprechend angepasst.

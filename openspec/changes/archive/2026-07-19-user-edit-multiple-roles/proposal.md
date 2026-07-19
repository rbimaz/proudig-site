## Why

Der Bearbeiten-Dialog erlaubt derzeit nur die Auswahl **einer** Rolle
(Einzelauswahl). Ein Benutzer kann im Datenmodell mehrere Rollen haben; beim
Speichern über den Dialog wird er aktuell auf genau eine Rolle reduziert.
Administratoren sollen im Dialog mehrere Rollen gleichzeitig vergeben oder
entziehen können.

## What Changes

- **Frontend:** Das Einzel-Rollen-Select im Bearbeiten-Dialog wird durch eine
  Mehrfachauswahl (Checkboxen für Benutzer, Bearbeiter, Administrator) ersetzt.
  Beim Öffnen sind alle aktuellen Rollen des Benutzers vorausgewählt. Es MUSS
  mindestens eine Rolle gewählt sein; beim Speichern wird die vollständige
  Rollenmenge über `PUT /api/users/{id}` gesendet.
- **Backend:** `UserService.updateUser` weist eine leere Rollenmenge mit einem
  Validierungsfehler (HTTP 400) ab, statt sie stillschweigend zu ignorieren, damit
  ein gezieltes Entziemen bis auf eine Rolle möglich, ein vollständiges Entfernen
  aber ausgeschlossen ist.

## Non-Goals

- Kein Schutz der letzten Administratorrolle bzw. der eigenen Admin-Rolle — das
  ist Gegenstand des separaten Changes `protect-admin-role`.
- Die inline Rollen-Badges in der Tabelle bleiben unverändert bestehen.

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirement „Bestehenden Benutzer bearbeiten" wird von
  Einzel- auf Mehrfach-Rollenauswahl geändert.

## Impact

- Frontend: `PortalUsers.jsx` (Edit-Dialog Rollen-Checkboxen, Vorbelegung,
  Payload, Mindestens-eine-Rolle-Validierung).
- Backend: `UserService.updateUser` (leere Rollenmenge → HTTP 400).

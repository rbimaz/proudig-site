## 1. Frontend

- [x] 1.1 Edit-State: `roles` als Array (statt einzelner `role`); Vorbelegung mit allen aktuellen Rollen des Benutzers
- [x] 1.2 Rollen-Checkboxen (Benutzer/Bearbeiter/Administrator) im Edit-Dialog statt Einzel-Select
- [x] 1.3 Validierung „mindestens eine Rolle"; beim Speichern vollständige Rollenmenge in den PUT-Payload
- [x] 1.4 Erstellen-Dialog bleibt unverändert (Einzelauswahl)

## 2. Backend

- [x] 2.1 `UserService.updateUser`: leere/fehlende Rollenmenge mit `IllegalArgumentException` (→ HTTP 400) abweisen; nicht-leere Menge ersetzt die Rollen

## 3. Tests & Verifikation

- [x] 3.1 Frontend-Test: Umschalten mehrerer Rollen sendet die vollständige Menge; Deaktivieren aller Rollen verhindert Speichern
- [x] 3.2 Backend kompiliert; Frontend-Tests/Lint/Build grün
- [x] 3.3 `openspec validate user-edit-multiple-roles --strict` erfolgreich

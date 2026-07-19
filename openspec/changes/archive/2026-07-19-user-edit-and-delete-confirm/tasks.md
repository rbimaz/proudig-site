## 1. Bearbeiten

- [x] 1.1 State `editing` (id, email, firstName, lastName, role) + `saving`; Öffnen setzt Primärrolle (Priorität ADMIN > CONSULTANT > USER)
- [x] 1.2 Edit-Dialog (Styling wie Erstellen-Dialog): E-Mail schreibgeschützt, Vorname, Nachname, Rollen-Select; Escape/Backdrop/Abbrechen schließt
- [x] 1.3 Speichern via `PUT /api/users/{id}` mit `firstName`, `lastName`, `roles: [role]`; Liste aktualisieren, Erfolgsmeldung
- [x] 1.4 Aktionsspalte um Button »Bearbeiten« ergänzen (Rollen-Badges bleiben)

## 2. Löschen mit ConfirmDialog

- [x] 2.1 `ConfirmDialog` importieren; State `deleteTarget`
- [x] 2.2 »Löschen« öffnet den Dialog (danger) statt `confirm()`
- [x] 2.3 Bestätigung führt `DELETE /api/users/{id}` aus, entfernt den Benutzer und schließt den Dialog; Abbrechen schließt ohne Aktion

## 3. Tests & Verifikation

- [x] 3.1 Delete-Test auf ConfirmDialog-Fluss umstellen (Zeilen-Button → Dialog-Bestätigung)
- [x] 3.2 Neuer Test: Bearbeiten sendet `PUT /api/users/{id}` mit geänderten Feldern
- [x] 3.3 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 3.4 `openspec validate user-edit-and-delete-confirm --strict` erfolgreich

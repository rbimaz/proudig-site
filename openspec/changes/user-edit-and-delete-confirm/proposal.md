## Why

Auf `/admin/portal/users` fehlt eine Möglichkeit, bestehende Benutzer zu
**bearbeiten** (Name/Rolle). Das **Löschen** existiert zwar, nutzt aber den
Browser-`confirm()`-Dialog statt der vorhandenen, gestylten
`ConfirmDialog`-Komponente. Ziel: Bearbeiten ergänzen und das Löschen über einen
konsistenten Bestätigungsdialog absichern.

## What Changes

- **Bearbeiten:** Neue Aktion »Bearbeiten« je Tabellenzeile öffnet einen Dialog
  (gleiches Styling wie der Erstellen-Dialog) mit Vorname, Nachname und einem
  Rollen-Select (Einzelauswahl, wie beim Erstellen). Die E-Mail wird zur
  Orientierung **schreibgeschützt** angezeigt (Backend erlaubt keine
  E-Mail-Änderung). Speichern erfolgt via `PUT /api/users/{id}` mit
  `firstName`, `lastName` und `roles: [rolle]`.
- **Löschen:** Ersetzt `confirm()` durch die `ConfirmDialog`-Komponente
  (danger-Variante) mit Titel/Meldung; erst nach Bestätigung wird
  `DELETE /api/users/{id}` ausgeführt.
- **Tabelle:** Die vorhandenen inline Rollen-Badges bleiben erhalten; die
  Aktionsspalte erhält zusätzlich »Bearbeiten«.

## Non-Goals

- Kein E-Mail-Wechsel und kein Passwort-Reset über das Bearbeiten (Backend
  unterstützt beides im Update nicht).
- Keine Mehrfach-Rollen-Auswahl im Dialog (bewusst Einzelauswahl); Mehrfachrollen
  bleiben weiterhin über die inline Badges pflegbar.

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt Requirements zum Bearbeiten bestehender Benutzer und
  zum Löschen mit gestyltem Bestätigungsdialog.

## Impact

- Betroffener Code: `PortalUsers.jsx` (Edit-Dialog, Delete-Confirm-State,
  Aktionsspalte), Wiederverwendung von `components/ConfirmDialog.jsx`,
  ggf. `portal.css` (kleine Ergänzungen). Tests in `PortalUsers.test.jsx`
  (Delete-Fluss auf ConfirmDialog umstellen, Edit-Test ergänzen).
- Backend unverändert (`PUT`/`DELETE /api/users/{id}` bestehen bereits).

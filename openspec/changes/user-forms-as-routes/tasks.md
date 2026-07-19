## 1. Routing

- [x] 1.1 In `App.jsx` unter `/admin/portal` zwei Kind-Routen ergänzen: `users/new` und `users/:id`, jeweils in `ProtectedRoute requiredRole="ADMIN"`, gerendert als `PortalUserForm`

## 2. Formular-Komponente `PortalUserForm`

- [x] 2.1 Neue `pages/portal/PortalUserForm.jsx`; `useParams` → `id`, `isNew = !id`; bei Bearbeiten `GET /api/users/:id` laden
- [x] 2.2 Felder aus den bisherigen Dialogen übernehmen: E-Mail (Neu: editierbar, Bearbeiten: readonly), Vorname, Nachname, Rollen-Checkboxen (ADMIN-Sperre für letzten/eigenen Admin), Passwort + Bestätigung (Neu: Pflicht; Bearbeiten: optional), Live-Vorschau; bei Neu zusätzlich Checkbox „Passwortänderung beim ersten Login"
- [x] 2.3 Speichern: `POST /api/users` bzw. `PUT /api/users/:id`; Validierung (Pflichtfelder, Passwort-Match, mind. eine Rolle) wie bisher; Erfolg → `navigate('/admin/portal/users')`; »Abbrechen« → zurück
- [x] 2.4 ADMIN-Sperre-Daten (adminCount, aktueller Benutzer) in der Route beschaffen (Liste/Count laden bzw. via AuthContext)
- [x] 2.5 Styling der Formular-Seite in `portal.css` (Karte/Layout wiederverwenden)

## 3. Liste `PortalUsers`

- [x] 3.1 Erstellen-/Bearbeiten-Modals entfernen; »+ Neuer Benutzer« → `navigate('/admin/portal/users/new')`, »Bearbeiten« → `navigate('/admin/portal/users/:id')`
- [x] 3.2 Rollen-Badges und Lösch-`ConfirmDialog` bleiben unverändert; verwaisten State/Handler entfernen

## 4. Tests & Verifikation

- [x] 4.1 `PortalUsers.test.jsx` auf Listen-/Navigations-Tests reduzieren (Buttons navigieren zu den Routen)
- [x] 4.2 Neue `PortalUserForm.test.jsx`: Anlegen (POST + zurück), Bearbeiten (GET vorbelegt, PUT + zurück), Validierungen, ADMIN-Sperre
- [x] 4.3 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 4.4 `openspec validate user-forms-as-routes --strict` erfolgreich

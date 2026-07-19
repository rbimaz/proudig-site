## Why

Das Anlegen und Bearbeiten von Benutzern erfolgt derzeit in Modal-Dialogen auf
`/admin/portal/users`. Für konsistente Navigation (verlinkbar, Zurück-Button,
kein Scroll-Lock) sollen beide Vorgänge — wie im CMS bereits üblich
(`seiten/new`, `seiten/:id`) — auf **eigenen Routen** stattfinden statt im Modal.

## What Changes

- **Neue Routen** als Kind von `PortalLayout`, jeweils `requiredRole="ADMIN"`:
  - `/admin/portal/users/new` — Formular „Neuer Benutzer"
  - `/admin/portal/users/:id` — Formular „Benutzer bearbeiten"
- **Neue geteilte Komponente `PortalUserForm`** mit `isNew`-Logik (Muster
  `StaticPageEditor`): E-Mail (bei Bearbeiten schreibgeschützt), Vorname,
  Nachname, Rollen-Mehrfachauswahl (inkl. ADMIN-Sperre für letzten/eigenen
  Admin), Passwort + Bestätigung (bei Bearbeiten optional), Live-Vorschau; beim
  Anlegen zusätzlich die Checkbox „Passwortänderung beim ersten Login". Laden per
  `GET /api/users/:id`, Speichern `POST`/`PUT`; nach Erfolg zurück zur Liste mit
  Erfolgsmeldung, »Abbrechen« ebenfalls zurück.
- **`PortalUsers` wird zur reinen Liste:** »+ Neuer Benutzer« und »Bearbeiten«
  **navigieren** zu den Routen statt Modals zu öffnen. Rollen-Badges und der
  Lösch-`ConfirmDialog` (ein Bestätigungsdialog, kein Formular) bleiben.

## Non-Goals

- Keine Backend-Änderung: `GET /api/users/{id}`, `POST /api/users`,
  `PUT /api/users/{id}` bestehen bereits.
- Kein fachliches Verhalten ändert sich (Passwortregeln, Mehrfachrollen,
  Admin-Schutz, Erst-Login) — nur der Ort (Route statt Modal).
- Der Lösch-Bestätigungsdialog bleibt ein Modal (Bestätigung, kein Formular).

## Capabilities

### Modified Capabilities
- `user-management`: Die Requirements „Darstellung der Benutzerverwaltung" und
  „Bestehenden Benutzer bearbeiten" werden von Modal- auf Routen-Darstellung
  umgestellt.

## Impact

- Frontend: `App.jsx` (2 neue Routen), neue `pages/portal/PortalUserForm.jsx`,
  `PortalUsers.jsx` (Modals entfernt → Navigation), `portal.css` (Formular-Seite),
  Tests aufgeteilt (Liste + Formular-Route).
- Terminologie-Hinweis: Die Requirements „Live-Vorschau im Dialog-Header",
  „Rollenauswahl beim Anlegen" und „Passwort-Bestätigung und Sichtbarkeit"
  gelten inhaltlich unverändert weiter und beziehen sich nun auf das Formular der
  Route (Wortlaut „Dialog" = Formular-Seite); eine reine Wortlaut-Angleichung
  kann separat erfolgen.

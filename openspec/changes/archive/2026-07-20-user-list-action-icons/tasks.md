## 1. Frontend

- [x] 1.1 `PortalUsers.jsx`: »Bearbeiten«-Button als Icon (`bi-pencil`), Klasse ohne `btn-edit` (kein Blau), `aria-label`/`title` "Bearbeiten"
- [x] 1.2 `PortalUsers.jsx`: »Löschen«-Button als Icon (`bi-trash`), `aria-label` "Löschen", `title` = Sperr-Hinweis bzw. "Löschen"
- [x] 1.3 `portal.css`: Aktionsspalte rechtsbündig (`.portal-users .admin-table th:last-child`/`td:last-child`), `.user-actions` `justify-content: flex-end`

## 2. Tests & Verifikation

- [x] 2.1 `PortalUsers.test.jsx`: Zeilen-Buttons per `getByRole('button', { name: ... })` statt Text auswählen
- [x] 2.2 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 2.3 `openspec validate user-list-action-icons --strict` erfolgreich

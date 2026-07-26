## 1. Komponente extrahieren

- [x] 1.1 `src/main/frontend/src/components/UserMenu.jsx` anlegen: Dropdown-Markup + State/Ref + Außenklick-/Escape-Handler + `handleLogout` (aus `useAuth`/`useNavigate`)

## 2. Layouts anpassen

- [x] 2.1 `AdminLayout.jsx`: inline User-Menü durch `<UserMenu />` ersetzen; ungenutzt gewordene State/Helper/Imports entfernen
- [x] 2.2 `PortalLayout.jsx`: statischen `user-info`/`btn-logout`-Block durch `<UserMenu />` ersetzen; ungenutzt gewordene Helper/Imports entfernen

## 3. Verifikation

- [x] 3.1 Frontend Lint/Build grün
- [x] 3.2 `openspec validate unify-admin-portal-user-menu --strict` grün
- [x] 3.3 Sichtprüfung: Dropdown erscheint identisch unter `/admin/cms`, `/admin/portal` und `/admin/portal/users`

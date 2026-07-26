## 1. Backend — ADMIN-only
- [x] 1.1 `DocumentController`, `FolderController`, `DocumentShareController`: klassenweites `@PreAuthorize("isAuthenticated()")` → `@PreAuthorize("hasRole('ADMIN')")`
- [x] 1.2 `SecurityConfig`: Matcher `/api/documents/**`, `/api/folders/**`, `/api/shares/**`, `/api/portal/**` von `.authenticated()` auf `.hasRole("ADMIN")` heben (change-password + /api/users unverändert)

## 2. Frontend — Portal-Route sperren
- [x] 2.1 `App.jsx`: Route `/admin/portal` (PortalLayout) auf `<ProtectedRoute requiredRole="ADMIN">` setzen; `/admin/portal/change-password` unverändert lassen
- [x] 2.2 Falls in `AdminHome` ein Portal-Einstieg existiert: für Nicht-Admins ausblenden (kein toter Link)

## 3. Verifikation
- [x] 3.1 Lint/Build (Frontend) grün
- [x] 3.2 API-Check: CLIENT/CONSULTANT-Token → `GET /api/documents` = 403; ADMIN-Token = 200
- [x] 3.3 UI-Check: Nicht-Admin auf `/admin/portal` → Redirect `/admin`; ADMIN → Portal lädt
- [x] 3.4 `openspec validate portal-admin-only-access --strict` grün

# Design — Dokumentenportal auf ADMIN beschränken

Zwei Ebenen (Defense-in-Depth), beide auf ADMIN:

## Frontend
- `App.jsx`: Route `/admin/portal` (Element `PortalLayout`) von `<ProtectedRoute>` auf
  `<ProtectedRoute requiredRole="ADMIN">` ändern. Die `ProtectedRoute`-Logik existiert bereits
  (kommaseparierte Rollen, Redirect auf `/admin`).
- `/admin/portal/change-password` bleibt unverändert (`<ProtectedRoute>` ohne Rolle) — Nicht-Admins
  mit `forcePasswordChange` müssen es erreichen.
- Optional (UX): einen etwaigen Portal-Einstieg auf der Admin-Landing (`AdminHome`) für Nicht-Admins
  ausblenden, damit kein toter Link entsteht (nur falls vorhanden).

## Backend
- Method-Security (primär, co-located): Klassenweites `@PreAuthorize("isAuthenticated()")` →
  `@PreAuthorize("hasRole('ADMIN')")` auf:
  - `DocumentController`
  - `FolderController`
  - `DocumentShareController`
  (`hasRole('ADMIN')` ist bestätigt korrekt — Authorities tragen `ROLE_`-Präfix, `UserController`
  nutzt es bereits.)
- SecurityConfig (zusätzliche grobe Absicherung): Matcher für `/api/documents/**`, `/api/folders/**`,
  `/api/shares/**`, `/api/portal/**` von `.authenticated()` auf `.hasRole("ADMIN")` heben.
- Unverändert: `/api/auth/change-password` (authenticated), `/api/users/**` (bereits ADMIN via
  `@PreAuthorize` im `UserController`).

## Verifikation
- Backend baut/startet; ein CLIENT/CONSULTANT-Token erhält auf `/api/documents` **403**, ein
  ADMIN-Token **200**.
- Frontend: als Nicht-Admin führt `/admin/portal` zum Redirect auf `/admin`; als ADMIN lädt das Portal.
- `openspec validate portal-admin-only-access --strict` grün.

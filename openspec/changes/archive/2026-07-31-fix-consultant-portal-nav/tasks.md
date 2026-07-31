## 1. Fix ADMIN-only-Gates

- [x] 1.1 `PortalDashboard`: `isAdmin()` → `hasRole('ADMIN')` im Redirect-Guard (Nicht-Admin → `/admin/portal/documents`) und im Effekt-Guard (Statistiken nur für ADMIN laden)
- [x] 1.2 `PortalLayout`: Nav-Einträge „Dashboard" und „Benutzer" von `isAdmin()` auf `hasRole('ADMIN')` umstellen
- [x] 1.3 `AdminHome.handlePortalClick`: `isAdmin()` → `hasRole('ADMIN')` (Consultant → `/admin/portal/documents`, Admin → `/admin/portal`)

## 2. Tests & Verifikation

- [x] 2.1 `PortalDashboard`-Test: Consultant (nur CONSULTANT) wird auf `/admin/portal/documents` weitergeleitet; Admin sieht das Dashboard
- [x] 2.2 `npm run test:run` grün, `npm run lint` ohne neue Errors, `npm run build` erfolgreich
- [x] 2.3 Live-Verifikation (Screenshot): als Consultant „Dokumenten-Portal" öffnen → landet auf „Meine Dokumente" (mit „Mit mir geteilt"), keine Dashboard-/Benutzer-Nav; Admin unverändert

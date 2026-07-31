## Why

Nach `portal-consultant-documents` (PR #37) landet ein Consultant beim Öffnen des
Dokumenten-Portals fälschlich auf dem **Admin-Dashboard** statt bei „Meine
Dokumente". Ursache: An mehreren Frontend-Stellen wurde `isAdmin()` als
„nur ADMIN" verwendet — tatsächlich ist `isAdmin()` in `AuthContext` aber
`hasRole('ADMIN') || hasRole('CONSULTANT')` (also „Personal"). Dadurch greifen die
ADMIN-only gedachten Guards für Consultants nicht.

Kein Sicherheitsproblem (das Backend schützt `/api/portal/**` weiterhin, ein
Consultant erhält dort 403) — aber ein UX-Bug: leeres Admin-Dashboard und
überflüssige Navigationseinträge.

## What Changes

- An vier Frontend-Stellen wird `isAdmin()` durch `hasRole('ADMIN')` (echtes
  ADMIN-only) ersetzt:
  - `PortalDashboard`: Redirect-Guard (Nicht-Admin → `/admin/portal/documents`)
    und Effekt-Guard fürs Laden der Statistiken.
  - `PortalLayout`: Nav-Einträge „Dashboard" und „Benutzer" nur für ADMIN.
  - `AdminHome.handlePortalClick`: Consultant → `/admin/portal/documents` statt
    `/admin/portal`.
- Ergebnis: Ein Consultant landet direkt bei „Meine Dokumente" (inkl. „Mit mir
  geteilt"), ohne Dashboard-/Benutzer-Navigation. Admin unverändert.

## Capabilities

### New Capabilities
<!-- Keine neue Capability. -->

### Modified Capabilities
- `portal-documents`: Präzisiert die Portal-Navigation — ein Consultant gelangt
  direkt zu seinen Dokumenten und sieht keine ADMIN-only Bereiche (Dashboard,
  Benutzerverwaltung) in der Portal-Navigation.

## Impact

- Frontend: `PortalDashboard.jsx`, `PortalLayout.jsx`, `AdminHome.jsx`.
- Kein Backend-/DB-Change (Zugriffsschutz war und bleibt korrekt).
- Neuer Frontend-Test sichert den Consultant-Redirect in `PortalDashboard`.
- Baut auf `portal-consultant-documents` auf.

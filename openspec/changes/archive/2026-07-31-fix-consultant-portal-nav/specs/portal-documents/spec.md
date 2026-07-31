## ADDED Requirements

### Requirement: Portal-Navigation für Consultants

Beim Öffnen des Dokumenten-Portals SHALL ein Benutzer mit Rolle `CONSULTANT`
direkt zur Dokumentenansicht („Meine Dokumente") gelangen und NICHT auf das
Admin-Dashboard. Die Portal-Navigation SHALL für einen `CONSULTANT` die ADMIN-only
Bereiche (Dashboard-Statistiken, Benutzerverwaltung) NICHT anzeigen. Für einen
`ADMIN` bleibt die Navigation unverändert (Dashboard, Meine Dokumente, Benutzer).

#### Scenario: Consultant öffnet das Portal

- **WHEN** ein `CONSULTANT` das Dokumenten-Portal öffnet
- **THEN** wird direkt „Meine Dokumente" angezeigt (inkl. „Mit mir geteilt"),
  nicht das Admin-Dashboard

#### Scenario: Consultant ruft die Dashboard-Route direkt auf

- **WHEN** ein `CONSULTANT` `/admin/portal` (Dashboard-Route) direkt aufruft
- **THEN** wird er auf `/admin/portal/documents` weitergeleitet

#### Scenario: Portal-Navigation eines Consultants

- **WHEN** ein `CONSULTANT` die Portal-Navigation sieht
- **THEN** enthält sie „Meine Dokumente", aber weder „Dashboard" noch „Benutzer"

#### Scenario: Admin-Navigation unverändert

- **WHEN** ein `ADMIN` das Portal öffnet
- **THEN** sieht er weiterhin Dashboard, Meine Dokumente und Benutzer

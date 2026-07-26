## ADDED Requirements

### Requirement: Dokumentenportal nur für ADMIN
Der Zugriff auf das Dokumentenportal und dessen Endpunkte (`/api/documents`, `/api/folders`,
`/api/shares`, `/api/portal`) SHALL ausschließlich Benutzern mit der Rolle ADMIN gestattet sein.
Benutzer mit den Rollen CONSULTANT oder CLIENT SHALL keinen Zugriff auf das Portal oder dessen
Dokument-, Ordner- und Freigabe-Endpunkte erhalten. Die Passwort-ändern-Funktion SHALL für jeden
authentifizierten Benutzer erreichbar bleiben.

#### Scenario: ADMIN öffnet das Portal
- **WHEN** ein Benutzer mit Rolle ADMIN `/admin/portal` aufruft
- **THEN** wird das Dokumentenportal geladen und die Dokument-/Ordner-/Freigabe-Endpunkte antworten normal

#### Scenario: Nicht-Admin wird abgewiesen
- **WHEN** ein Benutzer mit Rolle CONSULTANT oder CLIENT `/admin/portal` aufruft
- **THEN** wird er auf `/admin` umgeleitet und Anfragen an `/api/documents`, `/api/folders`, `/api/shares` werden mit HTTP 403 beantwortet

#### Scenario: Passwortänderung bleibt erreichbar
- **WHEN** ein authentifizierter Nicht-Admin mit gesetztem `forcePasswordChange` sich anmeldet
- **THEN** kann er die Passwort-ändern-Seite (`/admin/portal/change-password`) weiterhin erreichen

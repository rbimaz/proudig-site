# Dokumentenportal auf ADMIN beschränken

## Warum
Das Dokumentenportal (`/admin/portal`) ist heute für **jeden authentifizierten Benutzer** zugänglich
(Frontend-Route ohne Rollen-Check; Backend `/api/documents|folders|shares|portal/**` nur
`isAuthenticated()`). Es soll künftig ausschließlich Benutzern mit der Rolle **ADMIN** offenstehen;
CONSULTANT und CLIENT erhalten keinen Zugriff mehr auf das Portal.

Der Umstieg ist unkritisch: aktuell existieren **0 Freigaben** und nur 2 Dokumente. CONSULTANTs
behalten den CMS-Zugang (`/admin/cms` bleibt `ADMIN,CONSULTANT`); CLIENT-Accounts bleiben bestehen.

## Was
- Frontend: Route `/admin/portal` (PortalLayout) SHALL `requiredRole="ADMIN"` erhalten. Nicht-Admins
  werden wie bei anderen geschützten Routen auf `/admin` umgeleitet.
- Backend: Dokument-, Ordner- und Share-Endpunkte SHALL nur für ADMIN zugänglich sein
  (`@PreAuthorize("hasRole('ADMIN')")` auf `DocumentController`, `FolderController`,
  `DocumentShareController`; zusätzlich SecurityConfig-Matcher `/api/documents|folders|shares|portal/**`
  auf `hasRole("ADMIN")`).
- Die Passwort-ändern-Route (`/admin/portal/change-password`) bleibt für **jeden** authentifizierten
  Benutzer erreichbar (Force-Password-Change-Flow für Nicht-Admins).

## Nicht-Ziele
- **Kein** neues Sharing-Konzept — das externe Link-Sharing für Nicht-Admins ist als **separater,
  späterer Change** vorgesehen (siehe Projekt-Notiz). Dieser Change deckt nur die Zugriffssperre ab.
- Keine Änderung an CMS-Zugriff (`/admin/cms` bleibt ADMIN,CONSULTANT) oder an der
  Benutzerverwaltung (`/api/users/**` ist bereits ADMIN-geschützt).
- Kein Löschen von CLIENT-Accounts.

## ADDED Requirements

### Requirement: News/Blog über die UI veröffentlichen und archivieren
Das Admin-CMS SHALL in der News- und Blog-Verwaltung je Eintrag Aktionen zum Veröffentlichen und
Archivieren bereitstellen. „Veröffentlichen" SHALL für nicht veröffentlichte Beiträge (Entwurf oder
archiviert) verfügbar sein und den Status auf `PUBLISHED` setzen; „Archivieren" SHALL für
veröffentlichte Beiträge verfügbar sein und den Status auf `ARCHIVED` setzen. Nach der Aktion SHALL
die Liste den neuen Status anzeigen.

#### Scenario: Beitrag veröffentlichen
- **WHEN** eine Redakteurin bei einem Entwurf oder archivierten Beitrag „Veröffentlichen" wählt
- **THEN** wird der Beitrag über `PUT /api/admin/pages/{id}/publish` auf `PUBLISHED` gesetzt und in der Liste als veröffentlicht angezeigt

#### Scenario: Beitrag archivieren
- **WHEN** eine Redakteurin bei einem veröffentlichten Beitrag „Archivieren" wählt
- **THEN** wird der Beitrag über `PUT /api/admin/pages/{id}/archive` auf `ARCHIVED` gesetzt und in der Liste als archiviert angezeigt

#### Scenario: Statusgerechte Aktionen
- **WHEN** die News- oder Blog-Liste angezeigt wird
- **THEN** erscheint pro Eintrag die zum Status passende Aktion (Veröffentlichen bei nicht-veröffentlicht, Archivieren bei veröffentlicht) und das Status-Badge zeigt den korrekten Status

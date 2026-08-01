## MODIFIED Requirements

### Requirement: Header-User-Menü als Dropdown
Der Admin-Header SHALL in allen Bereichen der Admin-Oberfläche einheitlich – auf der
Einstiegsseite (`/admin`), im CMS-Layout (`/admin/cms`) und im Portal-Layout
(`/admin/portal`) – den angemeldeten Nutzer als Avatar (Initialen) + Name + Rolle
inline zeigen; ein Klick SHALL ein Dropdown mit Profil, Einstellungen und Abmelden
öffnen. Das Menü SHALL bei Klick außerhalb und bei Escape schließen und passende
ARIA-Attribute tragen. Der Eintrag „Einstellungen" SHALL nur für ADMIN erscheinen.

#### Scenario: User-Menü öffnen und schließen
- **WHEN** die Nutzerin auf den Avatar/Namen im Header klickt
- **THEN** öffnet sich das Dropdown (Profil/Einstellungen/Abmelden); erneuter Klick, Außenklick oder Escape schließt es

#### Scenario: Gleiches Menü im Portal-Bereich
- **WHEN** die Nutzerin eine Portal-Admin-Seite öffnet (`/admin/portal`, z. B. `/admin/portal/users`)
- **THEN** zeigt der Header dasselbe Dropdown-Menü wie im CMS-Bereich (Avatar/Name/Rolle inline; Profil/Einstellungen/Abmelden im Dropdown)

#### Scenario: Gleiches Menü auf der Einstiegsseite
- **WHEN** die Nutzerin die Admin-Einstiegsseite (`/admin`) öffnet
- **THEN** zeigt der Header dasselbe Dropdown-Menü (Profil/Einstellungen/Abmelden), nicht nur einen Abmelden-Button

### Requirement: Dashboard-KPI-Karten für alle Kernbereiche
Das Admin-Dashboard SHALL KPI-Karten mit der jeweiligen Anzahl für News, Blog-Beiträge, Seminare,
Mediathek und Kontaktanfragen anzeigen. Die Zahlen SHALL aus den bestehenden Admin-Endpunkten
ermittelt werden; schlägt eine Abfrage fehl, SHALL die betroffene Karte 0 anzeigen und das
Dashboard nutzbar bleiben. Jede KPI-Karte SHALL zu ihrer zugehörigen Verwaltungsseite verlinken
(News → `/admin/cms/news`, Blog-Beiträge → `/admin/cms/blog`, Seminare → `/admin/cms/seminare`,
Mediathek → `/admin/cms/media`, Kontaktanfragen → `/admin/cms/nachrichten`).

#### Scenario: Dashboard zeigt alle KPIs
- **WHEN** eine Administratorin das Dashboard öffnet
- **THEN** erscheinen KPI-Karten mit Anzahl für News, Blog-Beiträge, Seminare, Mediathek und Kontaktanfragen

#### Scenario: Ausfall einer Zählquelle
- **WHEN** eine der Zähl-Abfragen fehlschlägt
- **THEN** zeigt die betroffene Karte 0 und die übrigen KPIs werden weiterhin angezeigt

#### Scenario: Klick auf eine KPI-Karte
- **WHEN** eine Administratorin auf eine KPI-Karte klickt (z. B. „Seminare")
- **THEN** navigiert die App zur zugehörigen Verwaltungsseite (z. B. `/admin/cms/seminare`)

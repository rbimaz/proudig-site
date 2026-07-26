## MODIFIED Requirements

### Requirement: Header-User-Menü als Dropdown
Der Admin-Header SHALL in allen Bereichen der Admin-Oberfläche einheitlich – sowohl im CMS-Layout
(`/admin/cms`) als auch im Portal-Layout (`/admin/portal`) – den angemeldeten Nutzer als Avatar
(Initialen) + Name + Rolle inline zeigen; ein Klick SHALL ein Dropdown mit Profil, Einstellungen und
Abmelden öffnen. Das Menü SHALL bei Klick außerhalb und bei Escape schließen und passende
ARIA-Attribute tragen. Der Eintrag „Einstellungen" SHALL nur für ADMIN erscheinen.

#### Scenario: User-Menü öffnen und schließen
- **WHEN** die Nutzerin auf den Avatar/Namen im Header klickt
- **THEN** öffnet sich das Dropdown (Profil/Einstellungen/Abmelden); erneuter Klick, Außenklick oder Escape schließt es

#### Scenario: Gleiches Menü im Portal-Bereich
- **WHEN** die Nutzerin eine Portal-Admin-Seite öffnet (`/admin/portal`, z. B. `/admin/portal/users`)
- **THEN** zeigt der Header dasselbe Dropdown-Menü wie im CMS-Bereich (Avatar/Name/Rolle inline; Profil/Einstellungen/Abmelden im Dropdown)

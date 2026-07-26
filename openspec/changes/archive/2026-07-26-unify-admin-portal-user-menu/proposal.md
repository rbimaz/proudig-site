# Header-User-Menü im Portal-Bereich vereinheitlichen

## Warum
Der Admin-Bereich nutzt zwei getrennte Layouts: `AdminLayout` (CMS, `/admin/cms`) und `PortalLayout`
(Portal, `/admin/portal`, `/admin/portal/users`). Das Header-User-Dropdown (Avatar mit Initialen +
Name + Rolle, Klick öffnet Profil/Einstellungen/Abmelden) ist **inline nur in `AdminLayout`** umgesetzt.
Das Portal-Layout zeigt stattdessen einen simplen statischen Block (Icon + Name + separater
Abmelden-Button) **ohne Dropdown**. Dadurch wirkt die Kopfzeile im Portal uneinheitlich.

## Was
- Das Dropdown aus `AdminLayout` in eine **wiederverwendbare Komponente `UserMenu`** extrahieren
  (State, Ref, Außenklick-/Escape-Handler, Markup, `handleLogout`). Die Komponente zieht Nutzer/Rolle/
  Logout selbst aus `useAuth` + `useNavigate` — keine Props nötig.
- `AdminLayout` nutzt künftig `<UserMenu />` statt des inline-Blocks (verhaltensgleich).
- `PortalLayout` ersetzt den statischen `user-info`/`btn-logout`-Block durch `<UserMenu />` und zeigt so
  dasselbe Dropdown wie das CMS.
- Keine CSS-Änderung nötig: die `.user-menu-*`-Klassen liegen bereits in `admin.css`.

## Nicht-Ziele
- Kein Redesign des Menüs, keine neuen Menüeinträge.
- Keine Änderung an Sidebar/Navigation der Layouts.
- Keine Backend-Änderung.

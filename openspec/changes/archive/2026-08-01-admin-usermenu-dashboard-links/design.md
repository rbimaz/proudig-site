## Context

`UserMenu` (Avatar/Name/Rolle + Dropdown mit Profil/Einstellungen/Abmelden) wird
bereits in `AdminLayout` (`/admin/cms`) und `PortalLayout` genutzt. `AdminHome`
(`/admin`) hat stattdessen einen eigenen Header-Block mit nur einem
Abmelden-Button. Das `AdminDashboard` rendert KPI-Karten als nicht-klickbare
`<div>`.

## Goals / Non-Goals

**Goals:** Einheitliches User-Menü auch auf `/admin`; KPI-Karten verlinken.

**Non-Goals:** Kein Umbau von `UserMenu` selbst; keine neuen KPIs; keine Änderung
der Zähl-Logik.

## Decisions

- **AdminHome nutzt `<UserMenu />`** statt des eigenen `admin-home-user`-Blocks.
  Verwaiste `logout`/`handleLogout` (nur für den alten Button) werden entfernt.
  `user` bleibt (Willkommens-Überschrift).
- **KPI-Karten als `<Link>`** (React-Router, clientseitig) mit `to` je Karte;
  Ziel-Routen existieren bereits im CMS-Layout.
- **Test-Anpassung:** Der Abmelden-Test in `AdminHome.test.jsx` öffnet zuerst das
  User-Menü (Trigger) und klickt dann „Abmelden" im Dropdown.

## Risks / Trade-offs

- `UserMenu` benötigt `user/logout/hasRole` aus `useAuth` — in AdminHome vorhanden.
  Geringes Risiko; per Tests + Sichtprüfung abgesichert.

## Why

Zwei Inkonsistenzen in der Admin-Oberfläche:

1. Die Admin-Einstiegsseite (`/admin`, `AdminHome`) hat kein einheitliches
   User-Menü — nur einen „Abmelden"-Button. Profil und Einstellungen sind von dort
   nicht erreichbar, anders als im CMS- und Portal-Layout, die das gemeinsame
   `UserMenu`-Dropdown nutzen.
2. Die KPI-Karten des Admin-Dashboards (`/admin/cms`) für News, Blog-Beiträge,
   Seminare, Mediathek und Kontaktanfragen sind nicht verlinkt — ein Klick führt
   nirgendwohin.

## What Changes

- **AdminHome (`/admin`)** nutzt das gemeinsame `UserMenu`-Dropdown (Avatar/Name/
  Rolle inline; Profil, Einstellungen [nur ADMIN], Abmelden) statt des einfachen
  Abmelden-Buttons.
- **Dashboard-KPI-Karten** werden zu Links auf die jeweilige Verwaltungsseite:
  News → `/admin/cms/news`, Blog-Beiträge → `/admin/cms/blog`, Seminare →
  `/admin/cms/seminare`, Mediathek → `/admin/cms/media`, Kontaktanfragen →
  `/admin/cms/nachrichten`.

## Capabilities

### New Capabilities
<!-- Keine. -->

### Modified Capabilities
- `admin-authoring`: Das Header-User-Menü gilt auch auf der Einstiegsseite
  (`/admin`); die Dashboard-KPI-Karten sind mit ihren Verwaltungsseiten verlinkt.

## Impact

- Frontend: `AdminHome.jsx` (UserMenu statt eigenem Abmelden-Block; verwaiste
  `logout`/`handleLogout` entfernen), `AdminDashboard.jsx` (Karten als `Link`),
  `AdminHome.test.jsx` (Abmelden jetzt im Dropdown).
- Keine Backend-, API- oder DB-Änderung.

## 1. AdminHome — User-Menü

- [x] 1.1 In `AdminHome.jsx` `UserMenu` importieren und den `admin-home-user`-Block (User-Info + Abmelden-Button) durch `<UserMenu />` ersetzen.
- [x] 1.2 Verwaiste `logout` (aus `useAuth`) und `handleLogout` entfernen.

## 2. AdminDashboard — KPI-Links

- [x] 2.1 In `AdminDashboard.jsx` `Link` importieren, jeder Karte ein `to` geben (news/blog/seminare/media/nachrichten) und die Karte als `<Link className="stat-card">` rendern.

## 3. Tests

- [x] 3.1 `AdminHome.test.jsx`: Abmelden-Test öffnet zuerst das User-Menü und klickt dann „Abmelden".

## 4. Verifikation

- [x] 4.1 Frontend-Testsuite läuft grün (`npm run test:run`).
- [x] 4.2 Manuell: `/admin` zeigt das User-Menü (Profil/Einstellungen/Abmelden); KPI-Karten auf `/admin/cms` navigieren zur jeweiligen Seite.

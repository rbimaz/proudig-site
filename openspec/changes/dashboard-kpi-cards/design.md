# Design — Dashboard-KPI-Karten

## `AdminDashboard.jsx`
- State `stats`: `{ news, blogPosts, seminars, media, messages }` (Zahlen, Default 0).
- Parallel laden (`Promise.all`), jeweils Array-Länge:
  - `/api/admin/pages?category=NEWS` → `news`
  - `/api/admin/pages?category=BLOG` → `blogPosts`
  - `/api/admin/pages?category=SEMINAR` → `seminars`
  - `/api/admin/media` → `media`
  - `/api/admin/messages` → `messages`
  - Fehlschlag einer Anfrage → Wert bleibt 0 (defensiv), Dashboard bleibt nutzbar.
- Fünf `.stat-card` (bestehendes Muster: `.stat-icon` + `.stat-content` mit `h3` + `.stat-number`):
  | Karte | Icon | Wert |
  |---|---|---|
  | News | `bi-newspaper` | `stats.news` |
  | Blog-Beiträge | `bi-pencil-square` | `stats.blogPosts` |
  | Seminare | `bi-mortarboard-fill` | `stats.seminars` |
  | Mediathek | `bi-images` | `stats.media` |
  | Kontaktanfragen | `bi-envelope-fill` | `stats.messages` |
- „Zuletzt aktualisiert"-Karte + `lastUpdated`-State entfernen.

Keine CSS-Änderung nötig (`.dashboard-grid`/`.stat-card` vorhanden; Grid ist `auto-fit`).

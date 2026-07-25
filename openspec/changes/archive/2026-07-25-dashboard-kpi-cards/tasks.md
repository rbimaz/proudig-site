## 1. Umsetzung

- [x] 1.1 `AdminDashboard`: `stats` um `media` und `messages` erweitern; parallel laden (`/api/admin/media`, `/api/admin/messages`), Länge zählen, defensiv 0
- [x] 1.2 KPI-Karten „Mediathek" (`bi-images`) und „Kontaktanfragen" (`bi-envelope-fill`) ergänzen
- [x] 1.3 „Zuletzt aktualisiert"-Karte + `lastUpdated`-State entfernen

## 2. Verifikation

- [x] 2.1 Frontend Lint/Build grün
- [x] 2.2 `openspec validate dashboard-kpi-cards --strict` grün
- [x] 2.3 Visuelle Kontrolle (5 KPI-Karten mit Zahlen)

# Dashboard-KPI-Karten vervollständigen

## Warum
Das Admin-Dashboard zeigt KPI-Karten für News, Blog-Beiträge und Seminare, aber nicht für
**Mediathek** und **Kontaktanfragen**. Für einen vollständigen Überblick sollen alle fünf
Kern-Bereiche als KPI-Karten mit Anzahl dargestellt werden.

## Was
Das Dashboard SHALL fünf KPI-Karten mit der jeweiligen Anzahl zeigen:
- **News** (`/api/admin/pages?category=NEWS`)
- **Blog-Beiträge** (`/api/admin/pages?category=BLOG`)
- **Seminare** (`/api/admin/pages?category=SEMINAR`)
- **Mediathek** (`/api/admin/media`)
- **Kontaktanfragen** (`/api/admin/messages`)

Die bisherige Karte „Zuletzt aktualisiert" (kein Zähl-KPI, nicht Teil der Anforderung) entfällt.

## Nicht-Ziele
- Keine Backend-Änderung (alle Zähl-Endpunkte existieren bereits).
- Keine Diagramme/Trends; nur Anzahl je Bereich.

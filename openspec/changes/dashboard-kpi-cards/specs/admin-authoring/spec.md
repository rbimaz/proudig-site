## ADDED Requirements

### Requirement: Dashboard-KPI-Karten für alle Kernbereiche
Das Admin-Dashboard SHALL KPI-Karten mit der jeweiligen Anzahl für News, Blog-Beiträge, Seminare,
Mediathek und Kontaktanfragen anzeigen. Die Zahlen SHALL aus den bestehenden Admin-Endpunkten
ermittelt werden; schlägt eine Abfrage fehl, SHALL die betroffene Karte 0 anzeigen und das
Dashboard nutzbar bleiben.

#### Scenario: Dashboard zeigt alle KPIs
- **WHEN** eine Administratorin das Dashboard öffnet
- **THEN** erscheinen KPI-Karten mit Anzahl für News, Blog-Beiträge, Seminare, Mediathek und Kontaktanfragen

#### Scenario: Ausfall einer Zählquelle
- **WHEN** eine der Zähl-Abfragen fehlschlägt
- **THEN** zeigt die betroffene Karte 0 und die übrigen KPIs werden weiterhin angezeigt

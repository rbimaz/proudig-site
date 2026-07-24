## ADDED Requirements

### Requirement: News-Lebenszyklus manuell auslösen (UI)
Die Einstellungen-Seite SHALL einen Button „Jetzt ausführen" bereitstellen, der den
News-Lebenszyklus sofort anstößt (`POST /api/admin/pages/run-lifecycle`), ohne auf das
Cron-Intervall zu warten. Das Ergebnis (Anzahl der Statusübergänge) SHALL angezeigt werden.

#### Scenario: Lebenszyklus manuell ausführen
- **WHEN** eine Administratorin in den Einstellungen „Jetzt ausführen" wählt
- **THEN** wird der Lebenszyklus über `POST /api/admin/pages/run-lifecycle` ausgeführt und die Anzahl der Übergänge angezeigt

#### Scenario: Fällige News wird archiviert
- **WHEN** eine veröffentlichte News ihre Archivierungs-Frist überschritten hat und der Lebenszyklus manuell ausgelöst wird
- **THEN** wird sie archiviert (und erscheint danach nicht mehr in der Hero-Box)

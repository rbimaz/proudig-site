# news-lifecycle Specification

## Purpose
Definiert den Veröffentlichungs-Lebenszyklus von News: die zeitgesteuerte automatische Archivierung (Frist A pro News) und endgültige Ausblendung (Frist B global), den manuellen Anstoß sowie die daraus folgende öffentliche Sichtbarkeit (News-Box, Liste, Direktlink) und CMS-Anzeige.
## Requirements
### Requirement: Frist bis zur automatischen Archivierung (pro News)

Eine News SHALL optional eine Archivierungsfrist als relative Dauer (`autoArchiveAfter`) tragen. Die Dauer SHALL in der einheitlichen Systematik `<Zahl><Einheit>` mit den Einheiten `d` (Tage), `h` (Stunden), `m` (Minuten), `s` (Sekunden) ausgedrückt werden (z. B. `30d`, `12h`, `45m`, `30s`). Ist die Frist gesetzt, SHALL die News automatisch archiviert werden, sobald seit ihrer Veröffentlichung (`publishedAt`) die angegebene Dauer verstrichen ist. Ist keine Frist gesetzt, SHALL die News unbegrenzt veröffentlicht bleiben (kein automatisches Archivieren).

#### Scenario: Frist im CMS setzen

- **WHEN** ein Redakteur im News-Editor eine Zahl und eine Einheit (Tage/Stunden/Minuten/Sekunden) wählt und speichert
- **THEN** wird die Frist als `autoArchiveAfter` (z. B. `"30d"`) an der News gespeichert
- **AND** die Frist wird beim erneuten Öffnen des Editors wieder als Zahl + Einheit angezeigt

#### Scenario: Ungültige Frist wird abgewiesen

- **WHEN** ein gespeicherter Frist-Wert nicht dem Format `<Zahl><d|h|m|s>` entspricht
- **THEN** wird die Eingabe als ungültig zurückgewiesen

#### Scenario: Keine Frist gesetzt

- **WHEN** eine veröffentlichte News keine `autoArchiveAfter` hat
- **THEN** wird sie durch den Auto-Archiv-Job niemals automatisch archiviert

#### Scenario: Neue News mit Default-Frist vorbelegt

- **WHEN** ein Redakteur eine neue News im Editor öffnet und ein Default für Frist A konfiguriert ist
- **THEN** ist das Frist-Feld mit dem konfigurierten Default vorbelegt
- **AND** der Redakteur kann den Wert überschreiben oder leeren

### Requirement: Automatische Archivierung veröffentlichter News

Ein zeitgesteuerter Job SHALL regelmäßig alle News mit Status `PUBLISHED` prüfen. Für jede News mit gesetzter `autoArchiveAfter` und gesetztem `publishedAt`, bei der `publishedAt + autoArchiveAfter` in der Vergangenheit liegt, SHALL der Job den Status auf `ARCHIVED` setzen und den Archivierungszeitpunkt (`archivedAt`) auf den aktuellen Zeitpunkt setzen. Der Vorgang SHALL im Aktivitätsprotokoll festgehalten werden.

#### Scenario: Frist abgelaufen

- **WHEN** der Job läuft und eine veröffentlichte News die Bedingung `publishedAt + autoArchiveAfter <= jetzt` erfüllt
- **THEN** erhält die News Status `ARCHIVED`
- **AND** `archivedAt` wird auf den aktuellen Zeitpunkt gesetzt

#### Scenario: Frist noch nicht abgelaufen

- **WHEN** der Job läuft und `publishedAt + autoArchiveAfter` in der Zukunft liegt
- **THEN** bleibt die News unverändert `PUBLISHED`

### Requirement: Automatisches endgültiges Ausblenden archivierter News

Ein zeitgesteuerter Job SHALL regelmäßig alle News mit Status `ARCHIVED` prüfen. Für jede News mit gesetztem `archivedAt`, bei der `archivedAt + globale Aufbewahrungsdauer` in der Vergangenheit liegt, SHALL der Job den Status auf `HIDDEN` setzen. Die globale Aufbewahrungsdauer SHALL aus den Einstellungen aufgelöst werden (DB-Wert vor Property-Default `app.news.archive-retention`, Default `90d`), in derselben Duration-Systematik. Das Ausführungsintervall des Jobs SHALL über die Einstellungen (Cron) konfigurierbar sein und ohne Neustart wirken.

#### Scenario: Aufbewahrungsdauer abgelaufen

- **WHEN** der Job läuft und eine archivierte News die Bedingung `archivedAt + app.news.archive-retention <= jetzt` erfüllt
- **THEN** erhält die News Status `HIDDEN`

#### Scenario: Aufbewahrungsdauer noch nicht abgelaufen

- **WHEN** der Job läuft und `archivedAt + Aufbewahrungsdauer` in der Zukunft liegt
- **THEN** bleibt die News unverändert `ARCHIVED`

### Requirement: Manueller Anstoß des Lebenszyklus

Das System SHALL einen geschützten Endpoint bereitstellen, der die beiden Übergangs-Prüfungen (Archivieren, Ausblenden) sofort ausführt, ohne auf das Cron-Intervall zu warten. Der Endpoint SHALL nur für Rollen `ADMIN`/`CONSULTANT` zugänglich sein.

#### Scenario: Sofortiger Lauf per Endpoint

- **WHEN** ein berechtigter Nutzer `POST /api/admin/pages/run-lifecycle` aufruft
- **THEN** werden fällige News unmittelbar archiviert bzw. ausgeblendet
- **AND** die Antwort meldet die Anzahl der durchgeführten Übergänge

### Requirement: Öffentliche Sichtbarkeit nach Status

Die öffentliche News-Box (Hero) und die öffentliche News-Liste SHALL ausschließlich News mit Status `PUBLISHED` anzeigen. Der öffentliche Einzelabruf einer News per Slug (`/news/:slug`) SHALL News mit Status `PUBLISHED` oder `ARCHIVED` liefern und für News mit Status `HIDDEN` oder `DRAFT` einen Nicht-gefunden-Fehler liefern. Direktlinks von Blog- und Seminar-Inhalten SHALL unverändert nur `PUBLISHED` liefern.

#### Scenario: Archivierte News aus der Box entfernt

- **WHEN** eine News den Status `ARCHIVED` erhält
- **THEN** erscheint sie nicht mehr in der News-Box und nicht mehr in der öffentlichen News-Liste

#### Scenario: Archivierte News per Direktlink erreichbar

- **WHEN** ein Besucher den Direktlink `/news/:slug` einer `ARCHIVED`-News aufruft
- **THEN** wird die News ausgeliefert und angezeigt

#### Scenario: Ausgeblendete News nicht mehr erreichbar

- **WHEN** ein Besucher den Direktlink einer `HIDDEN`-News aufruft
- **THEN** wird ein Nicht-gefunden-Fehler geliefert (404)

#### Scenario: News-spezifische Direktlink-Regel ändert Blog/Seminar nicht

- **WHEN** ein Besucher den Direktlink eines `ARCHIVED`-Blogbeitrags oder -Seminars aufruft
- **THEN** wird weiterhin ein Nicht-gefunden-Fehler geliefert

### Requirement: Status-Anzeige im CMS

Die CMS-News-Liste SHALL für jede News ihren aktuellen Status anzeigen, inklusive der Status `ARCHIVED` und `HIDDEN`. News jeden Status (außer gelöscht) SHALL im CMS erhalten und weiter bearbeitbar bleiben.

#### Scenario: Ausgeblendete News im CMS sichtbar

- **WHEN** eine News den Status `HIDDEN` hat
- **THEN** erscheint sie weiterhin in der CMS-News-Liste mit einem `HIDDEN`-Badge

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


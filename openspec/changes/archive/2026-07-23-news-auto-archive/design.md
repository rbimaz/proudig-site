## Context

News sind `Page`-Entities mit `category=NEWS` und `status` ∈ {`DRAFT`,`PUBLISHED`,`ARCHIVED`} (`Page.java`, `PageStatus.java`). Die öffentliche News-Box (`getHeroNews`) und -Liste (`getPublishedNews`) filtern bereits auf `PUBLISHED`; archivierte News fallen automatisch heraus. Der öffentliche Einzelabruf `getBySlug` (`PageService.java:51`) erlaubt aktuell nur `PUBLISHED` und wird von **allen** Kategorien geteilt (Blog/Seminar/News). Es existiert bereits ein stündlicher Scheduler `autoArchivePastSeminars()` (`PageService.java:131`) — nur für Seminare, mit rudimentärer Logik; er bleibt unberührt. Property-Präfix im Projekt ist `app.*`. Liquibase-Changesets liegen unter `src/main/resources/db/changelog/` nach Schema `NNN-*.xml` (aktuell bis `013`).

## Goals / Non-Goals

**Goals:**
- Pro News eine relative Archivierungsfrist setzbar; automatischer Übergang `PUBLISHED → ARCHIVED`.
- Zweite, globale Frist; automatischer Übergang `ARCHIVED → HIDDEN`.
- Einheitliche Fristen-Systematik `30d/30h/30m/30s` für beide Fristen → testbar mit kurzen Dauern.
- Deterministisch testbar (ohne Wartezeit) und manuell anstoßbar.
- Archivierte News per Direktlink erreichbar, `HIDDEN` nicht.
- Blog/Seminar-Verhalten strikt unverändert.

**Non-Goals:**
- Keine Änderung der bestehenden Seminar-Auto-Archivierung.
- Keine öffentliche „Archiv-Liste" archivierter News (nur Direktlink).
- Frist B nicht pro News (bewusst global).
- Kein neuer manueller Wiederherstellungs-Workflow über das bestehende Publish hinaus.

## Decisions

- **Einheitliche Duration-Systematik über Spring `DurationStyle.SIMPLE`.** Beide Fristen nutzen das Format `<Zahl><d|h|m|s>`. Parsing kostenlos über Spring: `DurationStyle.detectAndParse("30d")` → `Duration`. Kein eigener Parser. Größte Einheit ist `d` (Monate/Jahre nicht unterstützt → „1 Jahr" = `365d`; für News unkritisch).
- **Frist A pro News als String `autoArchiveAfter`** (Spalte `auto_archive_after VARCHAR`, nullable). Bewusst als **String** statt Sekunden gespeichert, damit die Einheit fürs Editor-Round-Trip erhalten bleibt (Redakteur sieht wieder `30d`, nicht `2592000s`). `null` = kein Auto-Archiv. Validierung beim Speichern über `DurationStyle`.
- **Konfigurierbare Defaults über UI-Settings mit Property-Fallback.** Neuer generischer Key-Value-Speicher (Entity `Setting{key,value}` + `SettingRepository` + `SettingService`). `SettingService` löst Werte auf als „DB-Wert vor Property-Default". Drei News-Schlüssel: `news.default-archive-after` (Editor-Vorbelegung Frist A), `news.archive-retention` (Frist B), `news.lifecycle-cron` (Intervall). Property-Fallbacks: `app.news.default-archive-after`, `app.news.archive-retention` (`90d`), `app.news.lifecycle-cron` (`0 0 * * * *`). Frist B und Default werden **zur Laufzeit** gelesen → wirken ohne Neustart.
- **Settings-Verwaltung nur ADMIN.** `SettingsController` (GET/PUT unter `/api/admin/settings`, `@PreAuthorize("hasRole('ADMIN')")`); neue CMS-Seite „Einstellungen" (`/admin/cms/einstellungen`) + Nav-Eintrag in `AdminLayout.jsx`. Validierung von Duration-/Cron-Werten beim Speichern.
- **Dynamischer Scheduler statt fixem `@Scheduled`-Cron.** `@Scheduled`-Cron wird beim Start fixiert und ließe sich per UI nicht ändern. Daher `SchedulingConfigurer`, der einen `Trigger` registriert, dessen `nextExecution` den aktuellen Cron bei jedem Lauf frisch aus `SettingService` liest → Cron-Änderung greift ohne Neustart. Der Trigger ruft dieselbe `runNewsLifecycle()`-Logik.
- **Zweites neues Feld `archivedAt`** (`Instant`, `archived_at`, nullable) — Zeitpunkt der Archivierung als Basis für Frist B; gesetzt bei automatischer **und** manueller Archivierung.
- **Neuer Status `HIDDEN`** statt boolescher Flags. `PageStatus` wird als `STRING` (varchar 20) gespeichert → kein DB-Enum-Constraint; Migration nur für die zwei neuen Felder. `HIDDEN` ist news-spezifisch terminal.
- **Zeit aus injizierter `Clock`-Bean.** `PageService` liest „jetzt" via `Instant.now(clock)`. Eine `@Bean Clock clock()` (Default `Clock.systemUTC()`) erlaubt in Tests eine fixe Uhrzeit → deterministische Übergangs-Tests ohne Warten. Der Cron testet man nicht; man testet die extrahierte Übergangs-Methode.
- **Getrennter News-Scheduler** (via `SchedulingConfigurer`, s. o.), getrennt vom Seminar-Job. Die reine Logik lebt in einer public Methode `runNewsLifecycle()`, die Scheduler-Trigger **und** Trigger-Endpoint aufrufen. Zwei Durchläufe: (1) `PUBLISHED`→`ARCHIVED` inkl. `archivedAt=now`; (2) `ARCHIVED`→`HIDDEN`. Beide Übergänge über `activityLogService` protokolliert (`PAGE_AUTO_ARCHIVE`, `PAGE_AUTO_HIDE`).
- **Trigger-Endpoint** `POST /api/admin/pages/run-lifecycle` (`@PreAuthorize("hasAnyRole('ADMIN','CONSULTANT')")`) ruft `runNewsLifecycle()` und liefert die Anzahl der Übergänge → On-Demand-Test ohne Cron-Warten.
- **News-spezifischer Slug-Abruf** `getNewsBySlug(slug)`: erlaubt `PUBLISHED` **oder** `ARCHIVED`, wirft bei `HIDDEN`/`DRAFT`/nicht gefunden `NoSuchElementException`. `NewsController.getNewsPost` ruft diese Methode; `getBySlug` (Blog/Seminar) bleibt unverändert (`PUBLISHED` only).
- **`archivePage` (manuell)** setzt zusätzlich `archivedAt=now`.
- **DTO/Editor:** `autoArchiveAfter` in `PageDto`, `PageCreateRequest`, `PageUpdateRequest`. Editor: **Zahl-Feld + Einheiten-Dropdown** (Tage/Stunden/Minuten/Sekunden) → beim Speichern zu `"<Zahl><Einheit>"` zusammengesetzt, beim Laden wieder zerlegt. Nur für Kategorie NEWS sichtbar (analog „Im Hero anzeigen"). `NewsList` rendert Badges für `ARCHIVED`/`HIDDEN`.

## Risks / Trade-offs

- **`getBySlug` ist geteilt** → Loosening würde Blog/Seminar-Archiv öffentlich machen. Mitigation: separate `getNewsBySlug`; explizites Regressions-Scenario im Spec.
- **Sub-Tages-Einheiten in der Produktions-UI** sind fachlich fast nur fürs Testen. Bewusst akzeptiert (harmlos, flexibel). Alternative (nur `d`/`h` in Prod) wäre mehr Aufwand.
- **Ungültiger Duration-String** → Parse-Fehler. Mitigation: Validierung beim Speichern; defensiver Skip + Log-Warnung im Job statt Abbruch.
- **Enum-Erweiterung `HIDDEN`** könnte in Anzeige-Logik unbehandelt sein. Mitigation: Frontend-Badges für alle Status; Backend-Filter allowlist-basiert (`PUBLISHED`).
- **Cron-Granularität:** stündlich (prod). Manuelle/Testläufe via Trigger-Endpoint bzw. `app.news.lifecycle-cron` im Dev-Profil.
- **Bestehender Seminar-Job unverändert** (weiterhin rudimentär) — bewusst außerhalb des Scopes.

## Migration Plan

Zwei neue Liquibase-Changesets: `014-page-auto-archive.xml` (`auto_archive_after VARCHAR(20) NULL`, `archived_at TIMESTAMP NULL` an Tabelle `pages`) und `015-settings.xml` (Tabelle `settings` mit `setting_key` PK, `setting_value`, `updated_at`, `updated_by`). Additiv, keine Datenmigration (Bestands-News: `autoArchiveAfter=null` → bleiben veröffentlicht; fehlende Settings → Property-Fallback). Rollback = Changesets zurücknehmen + Feature-Code entfernen.

## Open Questions

- Keine offen. Geklärt: einheitliche Duration-Systematik (`30d/30h/30m/30s`) für beide Fristen; Frist A pro News (String), Frist B global (`Duration`-Property, Default `90d`); Editor = Zahl + Einheiten-Dropdown; Testbarkeit über `Clock`-Bean + Trigger-Endpoint; „verfügbar" = Direktlink für `ARCHIVED`, danach `HIDDEN` = 404.

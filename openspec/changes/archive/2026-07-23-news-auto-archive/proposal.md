## Why

News (Kategorie `NEWS`) bleiben aktuell unbegrenzt veröffentlicht, bis sie manuell archiviert werden. Redakteure sollen pro News eine Frist festlegen können, nach der die News automatisch aus der öffentlichen News-Box verschwindet — zunächst aber per Direktlink erreichbar bleibt — und nach einer weiteren Frist ganz aus der Öffentlichkeit genommen wird, um Platz für neue Inhalte zu schaffen. Zusätzlich sollen Admins die zugehörigen Standardwerte über die UI konfigurieren können.

## What Changes

- **Zweistufiger automatischer Lebenszyklus für News:**
  1. `PUBLISHED` → nach **Frist A** (pro News, relative Dauer) → `ARCHIVED`: verschwindet aus News-Box/-Liste, bleibt aber per Direktlink (`/news/:slug`) öffentlich erreichbar.
  2. `ARCHIVED` → nach **Frist B** (globaler Standardwert) → neuer Status `HIDDEN`: nicht mehr öffentlich erreichbar (Direktlink → 404), nur noch im CMS sichtbar.
- **Einheitliche Fristen-Systematik** im Spring-`Duration`-Format `30d`/`30h`/`30m`/`30s` (Tage/Stunden/Minuten/Sekunden) für **beide** Fristen. Sub-Tages-Einheiten dienen v. a. der Testbarkeit; produktiv sind Tage üblich.
- **Neuer Status** `HIDDEN` im `PageStatus`-Enum.
- **Neue Felder** an `Page`: `autoArchiveAfter` (Frist A pro News, als Duration-String z. B. `"30d"`, optional) und `archivedAt` (Zeitpunkt der Archivierung als Basis für Frist B).
- **UI-konfigurierbare Defaults (nur ADMIN)** über eine neue CMS-Seite „Einstellungen":
  - **Default-Frist A** — Vorbelegung des Auto-Archiv-Felds für neue News.
  - **Globale Frist B** — Aufbewahrungsdauer bis `HIDDEN`.
  - **Lebenszyklus-Cron/Intervall** — wie oft der Job läuft.
- **Generischer Settings-Speicher** (Key-Value) mit **Property-Fallback**: gesetzter DB-Wert gewinnt, sonst greift der `application.properties`-Default.
- **Dynamischer Scheduler** (`SchedulingConfigurer` + dynamischer Trigger), damit Cron-Änderungen ohne Neustart greifen; Frist B und Default-Frist-A werden zur Laufzeit gelesen.
- **Testbarkeit:** injizierbares `java.time.Clock` für deterministische Zeit-Tests; **Admin-Trigger-Endpoint** `POST /api/admin/pages/run-lifecycle` für On-Demand-Läufe ohne Warten aufs Cron-Intervall.
- **Öffentlicher Einzel-News-Abruf** liefert News mit Status `PUBLISHED` **oder** `ARCHIVED` (news-spezifisch), aber nicht `HIDDEN`/`DRAFT`. Blog/Seminar-Direktlinks bleiben unverändert (nur `PUBLISHED`).
- **CMS-Editor** (News): Feld „Automatisch archivieren nach" als **Zahl + Einheiten-Dropdown**, vorbelegt mit dem Default. **News-Liste**: neue Status-Badges (`ARCHIVED`, `HIDDEN`).

## Capabilities

### New Capabilities
- `news-lifecycle`: Veröffentlichungs-Lebenszyklus von News inkl. automatischer, zeitgesteuerter Archivierung und endgültiger Ausblendung sowie die daraus folgende öffentliche Sichtbarkeit (News-Box, Liste, Direktlink).
- `cms-settings`: Persistente, über die Admin-UI konfigurierbare Systemeinstellungen (Key-Value) mit Property-Fallback; hier für die News-Lebenszyklus-Defaults genutzt.

### Modified Capabilities
<!-- Keine bestehende Capability in openspec/specs/ betrifft News/CMS. -->

## Impact

- **Backend Domain:** `Page.java` (+`autoArchiveAfter`, +`archivedAt`), `PageStatus.java` (+`HIDDEN`), neue Entity `Setting`.
- **Backend Persistence:** `PageRepository` (Queries), neues `SettingRepository`.
- **Backend Service:** `PageService` (Scheduler-Logik, `getNewsBySlug`, `Clock`, liest Defaults aus `SettingService`), neuer `SettingService` mit Property-Fallback.
- **Backend Config:** `Clock`-Bean; `SchedulingConfigurer` mit dynamischem Trigger; Properties `app.news.default-archive-after`, `app.news.archive-retention`, `app.news.lifecycle-cron` (als Fallback-Defaults).
- **Backend Controller:** `NewsController` (news-spezifischer Slug-Abruf); Admin-Endpoint `run-lifecycle`; neuer `SettingsController` (GET/PUT, nur ADMIN).
- **DTOs:** `PageDto`, `PageCreateRequest`, `PageUpdateRequest` (+`autoArchiveAfter`); Settings-DTO.
- **Migration:** `014-page-auto-archive.xml` (`auto_archive_after`, `archived_at`), `015-settings.xml` (Tabelle `settings`).
- **Frontend:** `PageEditor.jsx` (Zahl + Einheiten-Dropdown, Default-Vorbelegung), `NewsList.jsx` (Status-Badges), neue Seite „Einstellungen" + Route + Nav-Eintrag in `AdminLayout.jsx`.
- Keine Änderung am öffentlichen Listen-/Hero-Verhalten (filtert weiter `PUBLISHED`). Blog/Seminar-Verhalten bleibt unverändert.

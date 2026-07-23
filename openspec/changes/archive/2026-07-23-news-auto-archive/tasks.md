## 1. Datenmodell & Migration

- [x] 1.1 `PageStatus`-Enum um `HIDDEN` erweitern
- [x] 1.2 `Page`-Entity: Felder `autoArchiveAfter` (String, `auto_archive_after`) und `archivedAt` (Instant, `archived_at`) ergänzen
- [x] 1.3 Liquibase-Changeset `014-page-auto-archive.xml` (`auto_archive_after VARCHAR(20) NULL`, `archived_at TIMESTAMP NULL`) anlegen und in `master.xml` einhängen
- [x] 1.4 Entity `Setting{key, value, updatedAt, updatedBy}` + `SettingRepository`; Changeset `015-settings.xml` (Tabelle `settings`) anlegen und einhängen

## 2. Konfiguration & Zeit

- [x] 2.1 Property-Fallbacks in `application.properties`: `app.news.default-archive-after=`, `app.news.archive-retention=90d`, `app.news.lifecycle-cron=0 0 * * * *`
- [x] 2.2 `Clock`-Bean bereitstellen (`@Bean Clock clock()` → `Clock.systemUTC()`), in `PageService` injizieren; „jetzt" konsequent über `Instant.now(clock)` lesen
- [x] 2.3 `SettingService`: Auflösung „DB-Wert vor Property-Default" (u. a. `getDuration`, `getString`), plus `set(key,value,user)` mit Validierung (Duration via `DurationStyle`, Cron via `CronExpression.isValidExpression`)

## 3. Service-Logik (News-Lebenszyklus)

- [x] 3.1 Duration-Parsing über Spring `DurationStyle.detectAndParse(...)`; Frist B & Default-Frist-A aus `SettingService` lesen (Laufzeit)
- [x] 3.2 `archivePage` (manuell): zusätzlich `archivedAt = Instant.now(clock)` setzen
- [x] 3.3 News-spezifischen `getNewsBySlug(slug)` hinzufügen: erlaubt `PUBLISHED` oder `ARCHIVED`, sonst `NoSuchElementException`; `getBySlug` (Blog/Seminar) unverändert lassen
- [x] 3.4 Public-Methode `runNewsLifecycle()` (gibt Anzahl Übergänge zurück): (a) `PUBLISHED` mit gültigem `autoArchiveAfter`+`publishedAt`, wenn `publishedAt+dauer <= now` → `ARCHIVED` + `archivedAt=now`; (b) `ARCHIVED`, wenn `archivedAt+retention <= now` → `HIDDEN`; ungültige Duration-Strings defensiv überspringen + loggen; Übergänge via `activityLogService` protokollieren
- [x] 3.5 `mapToDto` um `autoArchiveAfter` erweitern; `createPage`/`updatePage` übernehmen `autoArchiveAfter` (mit Format-Validierung)

## 4. Scheduling

- [x] 4.1 `SchedulingConfigurer` mit dynamischem Trigger, der den Cron bei jeder Ausführung aus `SettingService` (`news.lifecycle-cron`) liest und `runNewsLifecycle()` aufruft (getrennt vom bestehenden Seminar-Job)

## 5. Controller & DTOs

- [x] 5.1 `PageDto`, `PageCreateRequest`, `PageUpdateRequest` um `autoArchiveAfter` erweitern
- [x] 5.2 `NewsController.getNewsPost` auf `getNewsBySlug` umstellen
- [x] 5.3 Admin-Endpoint `POST /api/admin/pages/run-lifecycle` (`hasAnyRole('ADMIN','CONSULTANT')`) → `runNewsLifecycle()`, liefert Anzahl Übergänge
- [x] 5.4 `SettingsController` `GET/PUT /api/admin/settings` (`hasRole('ADMIN')`) mit Settings-DTO; PUT validiert Werte

## 6. Frontend

- [x] 6.1 `PageEditor.jsx` (nur NEWS): Zahl-Feld + Einheiten-Dropdown (Tage/Stunden/Minuten/Sekunden), Default-Vorbelegung aus Settings, beim Speichern zu `"<Zahl><Einheit>"` zusammensetzen, beim Laden zerlegen; als `autoArchiveAfter` senden
- [x] 6.2 `NewsList.jsx`: Status-Badges für `ARCHIVED` und `HIDDEN`
- [x] 6.3 Neue Seite „Einstellungen" (`/admin/cms/einstellungen`, nur ADMIN): lädt/speichert Default-Frist-A, Frist B, Lebenszyklus-Cron; Route + Nav-Eintrag in `AdminLayout.jsx`

## 7. Tests & Verifikation

- [x] 7.1 Unit-/Integrationstest mit fixem `Clock`: abgelaufene Frist A → `ARCHIVED` + `archivedAt`; nicht abgelaufen → unverändert
- [x] 7.2 Test mit fixem `Clock` + kurzer Retention (`30s`): `ARCHIVED` → `HIDDEN`
- [x] 7.3 Test: `getNewsBySlug` liefert `PUBLISHED`/`ARCHIVED`, wirft bei `HIDDEN`/`DRAFT`; Blog/Seminar-`getBySlug` weiterhin nur `PUBLISHED`
- [x] 7.4 Test: `SettingService` DB-Wert überschreibt Property-Default; Fallback bei fehlendem DB-Wert; Settings-Endpoints nur für ADMIN
- [x] 7.5 Backend baut (`mvn -q -DskipTests compile`); Liquibase validiert beim Start; Frontend-Build (`npm run build`) fehlerfrei
- [x] 7.6 Manueller Smoke-Test: Einstellungen (Frist B/Cron/Default) per UI ändern; über `run-lifecycle` Übergänge auslösen; News verschwindet aus Box/Liste, `/news/:slug` erreichbar (ARCHIVED) bzw. 404 (HIDDEN)

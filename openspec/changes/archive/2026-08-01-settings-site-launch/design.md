## Context

Die App zeigt in `App.jsx` `ComingSoon`, solange nicht
`sessionStorage['proudig-preview'] === 'true'`. Freischaltung erfolgt über
`/api/preview-auth` (Passwort aus `app.preview-password`). Systemeinstellungen sind
ein Key-Value-Store (`SettingService`, DB-Wert vor Property-Fallback), ADMIN-only
via `/api/admin/settings`. `/api/public/**` ist ohne Auth erreichbar.

## Goals / Non-Goals

**Goals:**
- Launch als reversible ADMIN-Einstellung; ohne Code-Deploy live schalten.
- Preview-Passwort-Mechanismus bleibt für Vorschau vor dem Launch.

**Non-Goals:**
- Kein Umbau des Preview-Passwort-Flows.
- Keine granularen Teil-Launches (einzelne Seiten); die Site ist ganz live oder ganz
  „Coming Soon".

## Decisions

- **Neuer Setting-Key `site.launched` (Boolean).** In `SettingService`:
  `KEY_SITE_LAUNCHED`, Getter `isSiteLaunched()`, Property-Fallback
  `app.site.launched:false`, Validierung akzeptiert nur `true`/`false`.
- **Öffentlicher Read-Endpoint `GET /api/public/site-status`.** Gibt ausschließlich
  `{ launched }` zurück; nötig, weil das Gate vor jeder Authentifizierung greift.
  Liegt unter dem bereits offenen `/api/public/**`.
  - Alternative: Launch-Status in einen bestehenden öffentlichen Endpoint einbetten —
    verworfen, eigener klarer Endpoint ist einfacher und cache-freundlich.
- **Admin-Schreibweg über die bestehende Settings-Seite.** `launched` wird in die
  Settings-GET/PUT-Nutzlast aufgenommen (ADMIN-only bleibt).
- **Frontend: asynchrones Gate.** `App.jsx` lädt beim Start `site-status`. Zustand
  `launched` startet `null` (unbekannt); bis der Status vorliegt wird weder Inhalt
  noch `ComingSoon` endgültig gerendert (Loader/leer), um Aufblitzen zu vermeiden.
  Entscheidung danach: `launched === true` ODER Preview-freigeschaltet →
  Inhalt; sonst `ComingSoon`.
- **Default `false`.** Verhalten bleibt bis zum bewussten Launch unverändert.

## Risks / Trade-offs

- Zusätzlicher Netzwerk-Roundtrip beim Start → minimal (ein Boolean); mit kurzem
  Loader abgefedert.
- Fällt der Status-Endpoint aus, MUSS das Gate fail-safe bleiben (nicht
  versehentlich live) → bei Fehler `launched=false` annehmen (Coming Soon), Preview
  bleibt möglich.

## Migration Plan

- Additiv. Ohne DB-Wert greift der Default `false` → Site bleibt „Coming Soon" wie
  heute. Launch = ADMIN setzt den Schalter. Rollback = Schalter aus / Setting
  entfernen.

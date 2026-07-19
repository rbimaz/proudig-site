## Why

Abschluss der Portal-Baseline. Das Aktivitätsprotokoll (`LOG-*` in
`docs/REQUIREMENTS.md`) wird aus `ActivityLogService`/`ActivityLogController` und
den protokollierenden Aufrufern als Ist-Zustand nach `openspec/specs/` überführt.

Code-Abgleich deckt Abweichungen zur Doku auf:
- Protokolliert werden im Portal `UPLOAD`, `DELETE` (Dokument), `SHARE` und
  `UNSHARE`. Ein **Download wird nicht protokolliert** (anders als `LOG-002`).
- Die Anzeige (`LOG-004`) ist ausschließlich Administratoren vorbehalten
  (`/api/admin/activity`, `hasRole('ADMIN')`).

## What Changes

- Neue Capability `portal-activity-log` mit Requirements für Protokollierung und
  administrative Einsicht.
- Keine Code-Änderung: reine Nachdokumentation.

## Capabilities

### New Capabilities
- `portal-activity-log`: Serverseitige Protokollierung von Portal-Aktionen und
  administrativer, gefilterter, paginierter Abruf.

## Impact

- Referenzierter Code (unverändert): `ActivityLogService`,
  `ActivityLogController`, protokollierende Aufrufe in `DocumentService` und
  `DocumentShareService`.
- Löst `LOG-*` in `docs/REQUIREMENTS.md` ab. Das Protokoll wird auch von
  CMS-Capabilities (Seiten/Medien/Content) genutzt; diese werden separat
  dokumentiert.

## Why

Fortsetzung der Portal-Baseline. Die Dokumenten-Freigabe (`SHARE-*` in
`docs/REQUIREMENTS.md`) wird aus `DocumentShareController` und
`DocumentShareService` als Ist-Zustand nach `openspec/specs/` überführt.

Code-Abgleich deckt Abweichungen zur Doku auf:
- `SHARE-002` nennt Rechte VIEW/DOWNLOAD/EDIT — das Enum `DocumentPermission`
  kennt nur **VIEW und EDIT**. Zudem wird die Berechtigungsstufe zwar gespeichert,
  aber bei der Zugriffsprüfung **nicht durchgesetzt**.
- Der Endpoint `GET /api/shares/shared-with-me/{documentId}` liefert Metadaten
  faktisch nur dem Eigentümer (latenter Fehler: `canAccessDocument` erlaubt
  Freigabe, der nachgelagerte `getDocument` ist aber eigentümer-only).

## What Changes

- Neue Capability `portal-sharing` mit Requirements für Freigeben, Einsehen,
  Widerrufen und Zugriff via Freigabe.
- Keine Code-Änderung: reine Nachdokumentation.

## Capabilities

### New Capabilities
- `portal-sharing`: Freigabe von Dokumenten an andere Benutzer mit optionalem
  Ablaufdatum und eigentümer-basierter Verwaltung.

## Impact

- Referenzierter Code (unverändert): `DocumentShareController`,
  `DocumentShareService`, `DocumentShare`, `DocumentPermission`.
- Löst `SHARE-*` in `docs/REQUIREMENTS.md` ab. Bezieht sich auf das
  Download-Requirement in `portal-documents` (Freigabe-Zugriff).

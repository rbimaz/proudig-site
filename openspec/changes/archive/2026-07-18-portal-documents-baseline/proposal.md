## Why

Das Dokumentenportal ist bereits implementiert, aber nur in `docs/REQUIREMENTS.md`
(Soll-Zustand, ID-Schema `DOC-*`) und `docs/PORTAL-STORAGE.md` beschrieben. Es
existiert keine capability-orientierte Spezifikation, die den tatsächlich
gebauten Ist-Zustand festhält. Diese Change ist der Pilot der OpenSpec-Einführung:
Sie überführt die Dokumentenverwaltung des Portals als Baseline nach
`openspec/specs/`.

Die Requirements werden aus dem Code (`DocumentController`, `DocumentService`)
abgeleitet, nicht aus `REQUIREMENTS.md`. Dabei aufgedeckte Abweichungen zwischen
Doku und Implementierung werden in den Requirements als Hinweis dokumentiert.

## What Changes

- Neue Capability `portal-documents` mit den Requirements der Dokumenten-CRUD,
  Upload/Download und Eigentümer-Zugriffskontrolle.
- Keine Code-Änderung: reine Nachdokumentation eines bestehenden Features.

## Capabilities

### New Capabilities
- `portal-documents`: Upload, Auflistung, Download, Umbenennen und Löschen von
  Dokumenten im Portal inklusive Eigentümer-basierter Zugriffskontrolle.

### Modified Capabilities
<!-- keine -->

## Impact

- Betroffener Code (nur als Referenz, unverändert): `DocumentController`,
  `DocumentService`, `FileStorageService`, `DocumentRepository`.
- Ablöst schrittweise die `DOC-*`-Einträge in `docs/REQUIREMENTS.md`.
- Folge-Changes nach gleichem Muster: `portal-folders` (FOLD-*),
  `portal-sharing` (SHARE-*), `portal-activity-log` (LOG-*).

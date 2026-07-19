# portal-sharing Specification

## Purpose
Freigabe von Dokumenten an andere Benutzer: Erstellen (mit Berechtigung VIEW/EDIT
und optionalem Ablaufdatum), Einsehen eigener und empfangener Freigaben,
Widerrufen sowie freigabe-basierter Zugriff (steuert den Download in
`portal-documents`).

## Requirements
### Requirement: Dokument freigeben
Das Portal SHALL nur dem Eigentümer eines Dokuments erlauben, es über
`POST /api/shares` (`{documentId, sharedWithEmail, permission?, expiresAt?}`) an
einen anderen (per E-Mail identifizierten) Benutzer freizugeben. Die
Berechtigung ist `VIEW` (Standard) oder `EDIT`; ein optionales `expiresAt` setzt
ein Ablaufdatum. Die Freigabe wird als Aktivität (`SHARE`/`DOCUMENT`)
protokolliert. Ersetzt `SHARE-001`, `SHARE-002`, `SHARE-003`.

Hinweis (Ist-Zustand): Das Rechte-Enum kennt nur `VIEW` und `EDIT` (kein
`DOWNLOAD` wie in `SHARE-002`). Die Berechtigungsstufe wird gespeichert, aber
bei der Zugriffsprüfung derzeit **nicht durchgesetzt** — jede gültige Freigabe
gewährt Lese-/Download-Zugriff unabhängig von `VIEW` vs. `EDIT`.

#### Scenario: Eigentümer gibt Dokument frei
- **WHEN** der Eigentümer ein Dokument an eine existierende Benutzer-E-Mail freigibt
- **THEN** wird eine Freigabe angelegt und ein `SHARE`-Aktivitätseintrag geschrieben

#### Scenario: Nur Eigentümer darf freigeben
- **WHEN** ein Nicht-Eigentümer versucht, ein Dokument freizugeben
- **THEN** wird mit `IllegalAccessError` ("Only document owner can share") abgewiesen

### Requirement: Mit mir geteilte Dokumente einsehen
Das Portal SHALL einem Benutzer über `GET /api/shares/shared-with-me` alle nicht
abgelaufenen Freigaben auflisten, die auf ihn ausgestellt sind. Ersetzt
`SHARE-004`.

#### Scenario: Abgelaufene Freigaben werden ausgeblendet
- **WHEN** ein Benutzer seine geteilten Dokumente abruft und eine Freigabe ein `expiresAt` in der Vergangenheit hat
- **THEN** wird diese Freigabe nicht in der Liste zurückgegeben

### Requirement: Freigaben eines Dokuments einsehen
Das Portal SHALL nur dem Eigentümer erlauben, über
`GET /api/shares/document/{documentId}` die bestehenden Freigaben eines
Dokuments einzusehen.

#### Scenario: Fremde Freigaben nicht einsehbar
- **WHEN** ein Nicht-Eigentümer die Freigaben eines Dokuments abruft
- **THEN** wird mit `IllegalAccessError` ("Only document owner can view shares") abgewiesen

### Requirement: Freigabe widerrufen
Das Portal SHALL das Widerrufen einer Freigabe über
`DELETE /api/shares/{shareId}` erlauben, wenn der Benutzer der Eigentümer des
Dokuments ODER der begünstigte Empfänger der Freigabe ist. Der Widerruf wird als
Aktivität (`UNSHARE`/`DOCUMENT`) protokolliert. Ersetzt `SHARE-005`.

#### Scenario: Empfänger entfernt eigene Freigabe
- **WHEN** der begünstigte Empfänger seine Freigabe widerruft
- **THEN** wird die Freigabe gelöscht und ein `UNSHARE`-Aktivitätseintrag geschrieben

#### Scenario: Unbeteiligter darf nicht widerrufen
- **WHEN** ein Benutzer, der weder Eigentümer noch Empfänger ist, die Freigabe widerruft
- **THEN** wird mit `IllegalAccessError` abgewiesen

### Requirement: Zugriff auf ein freigegebenes Dokument
Das Portal SHALL Zugriff auf ein Dokument gewähren, wenn der Benutzer Eigentümer
ist ODER eine gültige (nicht abgelaufene) Freigabe besitzt (`canAccessDocument`).
Dies steuert insbesondere den Download in `portal-documents`.

Hinweis (Ist-Zustand): Der Metadaten-Endpoint
`GET /api/shares/shared-with-me/{documentId}` liefert die Dokument-Metadaten
faktisch nur dem Eigentümer; Empfänger einer Freigabe erhalten HTTP 403, obwohl
der Download für sie funktioniert (latenter Fehler).

#### Scenario: Gültige Freigabe erlaubt Zugriff
- **WHEN** ein Benutzer mit einer nicht abgelaufenen Freigabe auf das Dokument zugreift
- **THEN** wird der Zugriff als erlaubt gewertet

#### Scenario: Kein Zugriff ohne Eigentum oder gültige Freigabe
- **WHEN** ein Benutzer ohne Eigentum und ohne gültige Freigabe zugreift
- **THEN** wird der Zugriff verweigert


## MODIFIED Requirements

### Requirement: Dokument freigeben
Das Portal SHALL dem Eigentümer eines Dokuments sowie jedem `ADMIN` erlauben, es
über `POST /api/shares` (`{documentId, sharedWithEmail, permission?, expiresAt?}`)
an einen anderen (per E-Mail identifizierten) Benutzer freizugeben. Die
Berechtigung ist `VIEW` (Standard) oder `EDIT`; ein optionales `expiresAt` setzt
ein Ablaufdatum. Die Freigabe wird als Aktivität (`SHARE`/`DOCUMENT`)
protokolliert.

Hinweis (Ist-Zustand): Das Rechte-Enum kennt nur `VIEW` und `EDIT`. Die
Berechtigungsstufe wird gespeichert, aber bei der Zugriffsprüfung derzeit
**nicht durchgesetzt** — jede gültige Freigabe gewährt Lese-/Download-Zugriff
unabhängig von `VIEW` vs. `EDIT`.

#### Scenario: Eigentümer gibt Dokument frei
- **WHEN** der Eigentümer ein Dokument an eine existierende Benutzer-E-Mail freigibt
- **THEN** wird eine Freigabe angelegt und ein `SHARE`-Aktivitätseintrag geschrieben

#### Scenario: Admin gibt fremdes Dokument frei
- **WHEN** ein `ADMIN` ein Dokument freigibt, dessen Eigentümer er nicht ist
- **THEN** wird eine Freigabe angelegt und ein `SHARE`-Aktivitätseintrag geschrieben

#### Scenario: Nur Eigentümer darf freigeben
- **WHEN** ein Client, der nicht Eigentümer ist (und nicht `ADMIN`), ein Dokument freizugeben versucht
- **THEN** wird mit `IllegalAccessError` abgewiesen

### Requirement: Freigaben eines Dokuments einsehen
Das Portal SHALL dem Eigentümer sowie jedem `ADMIN` erlauben, über
`GET /api/shares/document/{documentId}` die bestehenden Freigaben eines
Dokuments einzusehen.

#### Scenario: Fremde Freigaben nicht einsehbar
- **WHEN** ein Client, der nicht Eigentümer ist (und nicht `ADMIN`), die Freigaben eines Dokuments abruft
- **THEN** wird mit `IllegalAccessError` abgewiesen

#### Scenario: Admin sieht Freigaben eines fremden Dokuments
- **WHEN** ein `ADMIN` die Freigaben eines fremden Dokuments abruft
- **THEN** werden die bestehenden Freigaben zurückgegeben

### Requirement: Freigabe widerrufen
Das Portal SHALL das Widerrufen einer Freigabe über
`DELETE /api/shares/{shareId}` erlauben, wenn der Benutzer der Eigentümer des
Dokuments, der begünstigte Empfänger der Freigabe ODER `ADMIN` ist. Der Widerruf
wird als Aktivität (`UNSHARE`/`DOCUMENT`) protokolliert.

#### Scenario: Empfänger entfernt eigene Freigabe
- **WHEN** der begünstigte Empfänger seine Freigabe widerruft
- **THEN** wird die Freigabe gelöscht und ein `UNSHARE`-Aktivitätseintrag geschrieben

#### Scenario: Admin widerruft fremde Freigabe
- **WHEN** ein `ADMIN` eine Freigabe widerruft, an der er weder Eigentümer noch Empfänger ist
- **THEN** wird die Freigabe gelöscht und ein `UNSHARE`-Aktivitätseintrag geschrieben

#### Scenario: Unbeteiligter darf nicht widerrufen
- **WHEN** ein Benutzer, der weder Eigentümer noch Empfänger noch `ADMIN` ist, die Freigabe widerruft
- **THEN** wird mit `IllegalAccessError` abgewiesen

### Requirement: Zugriff auf ein freigegebenes Dokument
Das Portal SHALL Zugriff auf ein Dokument gewähren, wenn der Benutzer Eigentümer
ist, eine gültige (nicht abgelaufene) Freigabe besitzt ODER Personal (Rolle
`ADMIN` oder `CONSULTANT`) ist (`canAccessDocument`). Dies steuert insbesondere
den Download in `portal-documents`.

Hinweis (Ist-Zustand): Der Metadaten-Endpoint
`GET /api/shares/shared-with-me/{documentId}` liefert die Dokument-Metadaten
faktisch nur dem Eigentümer; Empfänger einer Freigabe erhalten HTTP 403, obwohl
der Download für sie funktioniert (latenter Fehler).

#### Scenario: Gültige Freigabe erlaubt Zugriff
- **WHEN** ein Benutzer mit einer nicht abgelaufenen Freigabe auf das Dokument zugreift
- **THEN** wird der Zugriff als erlaubt gewertet

#### Scenario: Personal erhält Zugriff ohne Freigabe
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` ohne eigene Freigabe auf ein fremdes Dokument zugreift
- **THEN** wird der Zugriff als erlaubt gewertet

#### Scenario: Kein Zugriff ohne Eigentum oder gültige Freigabe
- **WHEN** ein Client ohne Eigentum und ohne gültige Freigabe zugreift
- **THEN** wird der Zugriff verweigert

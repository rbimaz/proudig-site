## ADDED Requirements

### Requirement: Benutzer löschen — abhängige Daten und Eigentumsschutz
Beim Löschen eines Benutzers SHALL das System zunächst prüfen, ob der Benutzer
noch Inhalte besitzt (Ordner, Dokumente, Medien oder CMS-Seiten). Ist das der
Fall, SHALL das Löschen mit einem Validierungsfehler (HTTP 400) und einer klaren
Meldung abgelehnt werden, und es SHALL nichts gelöscht werden. Andernfalls SHALL
das System die abhängigen, unkritischen Daten des Benutzers entfernen
(Sessions/`refresh_tokens`, `activity_log`-Einträge, gesendete und empfangene
`document_shares`) sowie die Bearbeiter-Zuordnung in `content_blocks`
(`updated_by`) auf `NULL` setzen und anschließend den Benutzer löschen. Die
Bereinigung und das Löschen SHALL atomar (in einer Transaktion) erfolgen. Das
Frontend SHALL eine abgelehnte Löschung als Fehlermeldung anzeigen.

#### Scenario: Löschen ohne eigene Inhalte
- **WHEN** ein Administrator einen Benutzer ohne eigene Ordner/Dokumente/Medien/Seiten löscht
- **THEN** werden dessen Sessions, Aktivitätsprotokoll und Freigaben entfernt, die Bearbeiter-Zuordnung in Inhaltsblöcken auf `NULL` gesetzt und der Benutzer gelöscht

#### Scenario: Löschen mit eigenen Inhalten wird abgelehnt
- **WHEN** ein Administrator einen Benutzer löscht, der noch Ordner, Dokumente, Medien oder CMS-Seiten besitzt
- **THEN** antwortet das System mit HTTP 400 und einer erklärenden Meldung und der Benutzer bleibt bestehen

#### Scenario: Fehlermeldung im UI
- **WHEN** ein Löschversuch serverseitig abgelehnt wird
- **THEN** zeigt die Benutzerliste die Server-Fehlermeldung an

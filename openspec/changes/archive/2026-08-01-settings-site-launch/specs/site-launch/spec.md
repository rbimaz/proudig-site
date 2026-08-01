## ADDED Requirements

### Requirement: Launch-Status steuert den öffentlichen Zugang

Der öffentliche Zugang zur Website SHALL über die persistente Einstellung
`site.launched` gesteuert werden. Ist `site.launched` **true** (Site live), SHALL
die App allen Besuchern den normalen Seiteninhalt ohne „Coming Soon"-Sperre zeigen.
Ist `site.launched` **false**, SHALL die App die „Coming Soon"-Sperre zeigen, sofern
kein Preview-Zugang besteht. Der Default SHALL `false` sein.

#### Scenario: Site live

- **WHEN** `site.launched` auf true steht und ein Besucher die Website öffnet
- **THEN** wird der normale Inhalt ohne „Coming Soon"-Sperre angezeigt

#### Scenario: Site nicht live

- **WHEN** `site.launched` auf false steht und ein Besucher ohne Preview-Zugang die
  Website öffnet
- **THEN** wird die „Coming Soon"-Sperre angezeigt

### Requirement: Öffentlicher Launch-Status-Endpoint

Das Backend SHALL unter `GET /api/public/site-status` ohne Authentifizierung den
Launch-Status als `{ "launched": <boolean> }` bereitstellen. Der Endpoint SHALL nur
diesen Status preisgeben, keine weiteren Einstellungen.

#### Scenario: Status abrufbar

- **WHEN** ein Client `GET /api/public/site-status` aufruft
- **THEN** liefert die Antwort `{ "launched": true }` bzw. `{ "launched": false }`
  entsprechend der Einstellung

### Requirement: Preview-Zugang vor dem Launch

Solange die Site nicht live ist, SHALL der bestehende Preview-Zugang per Passwort
weiterhin funktionieren: Nach erfolgreicher Preview-Freischaltung SHALL der Besucher
den normalen Inhalt trotz `site.launched = false` sehen.

#### Scenario: Vorschau trotz nicht gelaunchter Site

- **WHEN** die Site nicht live ist und ein Besucher die Preview per Passwort
  freischaltet
- **THEN** sieht er den normalen Inhalt ohne „Coming Soon"-Sperre

### Requirement: Kein „Coming Soon"-Aufblitzen beim Laden

Während der Launch-Status geladen wird, SHALL die App weder den normalen Inhalt noch
die „Coming Soon"-Sperre endgültig festlegen, sondern erst nach Vorliegen des Status
entscheiden, um ein kurzes Aufblitzen der falschen Ansicht zu vermeiden.

#### Scenario: Entscheidung erst nach Status

- **WHEN** die App geladen wird und der Launch-Status noch nicht vorliegt
- **THEN** wird die Gate-Entscheidung (Inhalt vs. „Coming Soon") erst nach Erhalt
  des Status getroffen

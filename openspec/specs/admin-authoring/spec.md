# admin-authoring Specification

## Purpose
TBD - created by archiving change fix-admin-editors. Update Purpose after archive.
## Requirements
### Requirement: Blog- und Seminar-Beiträge lassen sich anlegen und bearbeiten
Das Admin-CMS SHALL das Anlegen und Bearbeiten von Blog- und Seminar-Beiträgen ermöglichen.
Die Navigation aus den Verwaltungslisten und die Weiterleitung nach dem Speichern SHALL auf die
tatsächlich registrierten Editor-Routen unter `/admin/cms/…` zeigen (kein leerer Screen).

#### Scenario: Neuen Blog-Beitrag anlegen
- **WHEN** eine Redakteurin in der Blog-Verwaltung „Neu" wählt
- **THEN** öffnet sich der Editor unter `/admin/cms/blog/new`

#### Scenario: Neues Seminar anlegen
- **WHEN** eine Redakteurin in der Seminar-Verwaltung „Neu" wählt
- **THEN** öffnet sich der Editor unter `/admin/cms/seminare/new`

#### Scenario: Nach Speichern zum Editor der Seite
- **WHEN** ein neuer Beitrag gespeichert oder veröffentlicht wird
- **THEN** wird auf `/admin/cms/<segment>/<id>` weitergeleitet (Segment `seminare` für Seminare), nicht auf eine unbekannte Route

#### Scenario: Speichern ohne oder mit Tags funktioniert
- **WHEN** ein Beitrag (mit leerem oder gefülltem Tag-Feld) gespeichert wird
- **THEN** werden die Tags als Array (`List<String>`) übertragen und das Speichern gelingt ohne Deserialisierungsfehler

### Requirement: Mediathek-Inhalte in Seiteninhalte einfügen
Der Editor SHALL das Einfügen von Bildern aus der Mediathek in den Inhalt von News, Seminaren,
Blog und CMS-Seiten ermöglichen. Ausgewählte Medien SHALL über `/api/media/{id}` referenziert werden.

#### Scenario: Bild in Markdown-Inhalt einfügen
- **WHEN** ein Redakteur im Seiten-Editor „Bild aus Mediathek einfügen" nutzt und ein Bild wählt
- **THEN** wird eine Bild-Referenz (`![…](/api/media/{id})`) in den Inhalt eingefügt

#### Scenario: Bild in CMS-Seite einfügen
- **WHEN** ein Redakteur im CMS-Seiten-Editor ein Mediathek-Bild einfügt
- **THEN** wird ein `<img src="/api/media/{id}">` in den HTML-Inhalt eingefügt

### Requirement: News/Blog über die UI veröffentlichen und archivieren
Das Admin-CMS SHALL in der News- und Blog-Verwaltung je Eintrag Aktionen zum Veröffentlichen und
Archivieren bereitstellen. „Veröffentlichen" SHALL für nicht veröffentlichte Beiträge (Entwurf oder
archiviert) verfügbar sein und den Status auf `PUBLISHED` setzen; „Archivieren" SHALL für
veröffentlichte Beiträge verfügbar sein und den Status auf `ARCHIVED` setzen. Nach der Aktion SHALL
die Liste den neuen Status anzeigen.

#### Scenario: Beitrag veröffentlichen
- **WHEN** eine Redakteurin bei einem Entwurf oder archivierten Beitrag „Veröffentlichen" wählt
- **THEN** wird der Beitrag über `PUT /api/admin/pages/{id}/publish` auf `PUBLISHED` gesetzt und in der Liste als veröffentlicht angezeigt

#### Scenario: Beitrag archivieren
- **WHEN** eine Redakteurin bei einem veröffentlichten Beitrag „Archivieren" wählt
- **THEN** wird der Beitrag über `PUT /api/admin/pages/{id}/archive` auf `ARCHIVED` gesetzt und in der Liste als archiviert angezeigt

#### Scenario: Statusgerechte Aktionen
- **WHEN** die News- oder Blog-Liste angezeigt wird
- **THEN** erscheint pro Eintrag die zum Status passende Aktion (Veröffentlichen bei nicht-veröffentlicht, Archivieren bei veröffentlicht) und das Status-Badge zeigt den korrekten Status

### Requirement: News löschen mit Bestätigungsdialog
Das Admin-CMS SHALL das Löschen einer News über einen gestylten In-App-Bestätigungsdialog
(`ConfirmDialog`) absichern — nicht über den nativen Browser-`confirm`. Der Dialog SHALL
Abbrechen und Bestätigen anbieten; nur bei Bestätigung SHALL die News gelöscht werden.

#### Scenario: Löschen bestätigen
- **WHEN** eine Redakteurin bei einer News „Löschen" wählt
- **THEN** erscheint ein Bestätigungsdialog; bei Bestätigung wird die News gelöscht und verschwindet aus der Liste

#### Scenario: Löschen abbrechen
- **WHEN** die Redakteurin den Dialog abbricht (Abbrechen, ESC oder Klick auf den Hintergrund)
- **THEN** wird nichts gelöscht und die Liste bleibt unverändert

#### Scenario: Veröffentlichte News löschen
- **WHEN** eine veröffentlichte (oder archivierte) News gelöscht wird
- **THEN** gelingt das Löschen (kein „Only draft pages can be deleted"-Fehler) — der Status verhindert das Löschen nicht mehr

### Requirement: „Im Hero anzeigen" ist Default für neue News, mit Speicher-Hinweis
Beim Anlegen einer neuen News SHALL „Im Hero anzeigen" (`showInHero`) standardmäßig aktiviert sein.
Beim Bearbeiten bestehender News SHALL der gespeicherte Wert unverändert übernommen werden. Wird
eine News mit aktivem „Im Hero anzeigen" gespeichert oder veröffentlicht, SHALL die Bestätigung
darauf hinweisen, dass sie im Hero angezeigt wird.

#### Scenario: Neue News hat Hero-Anzeige vorbelegt
- **WHEN** eine Redakteurin eine neue News anlegt
- **THEN** ist „Im Hero anzeigen" standardmäßig aktiviert

#### Scenario: Hinweis beim Speichern
- **WHEN** eine News mit aktivem „Im Hero anzeigen" gespeichert oder veröffentlicht wird
- **THEN** weist die Erfolgsmeldung darauf hin, dass die News im Hero angezeigt wird

#### Scenario: Bestehende News unverändert
- **WHEN** eine bestehende News bearbeitet wird
- **THEN** entspricht der Zustand von „Im Hero anzeigen" dem gespeicherten Wert (kein automatisches Aktivieren)

### Requirement: Einheitliches Design der Admin-Listen
Alle Admin-Listen/Übersichten (Seiten, Blog, News, Seminare, Nachrichten) SHALL ein einheitliches
Erscheinungsbild gemäß Design-Handoff nutzen: Tabellen-Karte mit Rahmen/Radius, klare Kopf-Labels,
Status-Badges (Veröffentlicht grün, Archiviert grau, Entwurf neutral) und volle Content-Breite mit
rechts bündiger Kante. Farben SHALL über die bestehenden `--c-*`-Tokens abgebildet werden.

#### Scenario: Konsistente Listen
- **WHEN** eine der Admin-Listen angezeigt wird
- **THEN** erscheinen Karte, Status-Badges und Spaltenkopf im einheitlichen Design, in voller Content-Breite

### Requirement: Aktions-Buttons mit Hover-Solid-Fill
Die Aktions-Buttons je Zeile SHALL im Ruhezustand neutral (weiß, Rahmen, dunkle Schrift) sein und
bei Hover einen Solid-Fill erhalten: normale Aktionen im Akzent (Orange), destruktive Aktion
(Löschen) in Danger (Rot), jeweils mit weißer Schrift/Icon.

#### Scenario: Button-Hover
- **WHEN** eine Nutzerin einen Aktions-Button überfährt
- **THEN** füllt er sich solide (Akzent bzw. Danger) mit weißer Schrift/Icon; im Ruhezustand ist er neutral

### Requirement: Header-User-Menü als Dropdown
Der Admin-Header SHALL den angemeldeten Nutzer als Avatar (Initialen) + Name + Rolle inline zeigen;
ein Klick SHALL ein Dropdown mit Profil, Einstellungen und Abmelden öffnen. Das Menü SHALL bei
Klick außerhalb und bei Escape schließen und passende ARIA-Attribute tragen.

#### Scenario: User-Menü öffnen und schließen
- **WHEN** die Nutzerin auf den Avatar/Namen im Header klickt
- **THEN** öffnet sich das Dropdown (Profil/Einstellungen/Abmelden); erneuter Klick, Außenklick oder Escape schließt es

### Requirement: Sidebar-Navigation im Handoff-Stil
Die Admin-Sidebar SHALL dunkles Navy nutzen; das aktive Nav-Item SHALL mit Akzentbalken und
Akzenttext hervorgehoben sein.

#### Scenario: Aktives Nav-Item
- **WHEN** eine Admin-Seite geöffnet ist
- **THEN** ist das zugehörige Sidebar-Item mit Akzentbalken/Akzenttext markiert

### Requirement: Media in konsistenter Breite
Die Mediathek SHALL dieselbe Content-Breite/rechte Kante wie die Tabellen-Übersichten nutzen. Das
Grid-Layout und die Detail-Panel-Buttons bleiben erhalten (eigener Kontext).

#### Scenario: Media-Breite
- **WHEN** die Mediathek angezeigt wird
- **THEN** nutzt sie dieselbe Content-Breite/rechte Kante wie die übrigen Übersichten


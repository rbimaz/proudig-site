## ADDED Requirements

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

## ADDED Requirements

### Requirement: Statische Seiten werden als Markdown gepflegt und gerendert
Statische Seiten (`STATIC`) SHALL wie News/Blog als Markdown editiert und öffentlich als Markdown
gerendert werden. Der öffentliche Renderer SHALL den Inhalt sicher als Markdown ausgeben (kein rohes
HTML via `dangerouslySetInnerHTML`) und den Seiten-Rahmen (Titel aus dem Seitentitel) selbst liefern.

#### Scenario: Statische Seite wird als Markdown gerendert
- **WHEN** eine Besucherin eine statische Seite (z.B. `/impressum`) öffnet
- **THEN** wird der Markdown-Inhalt formatiert dargestellt (Überschriften, Links, Absätze) und der
  Seitentitel erscheint im Kopfbereich

#### Scenario: Statische Seite wird als Markdown editiert
- **WHEN** ein Redakteur eine statische Seite im Admin öffnet
- **THEN** bearbeitet er den Inhalt als Markdown mit einer Vorschau-Ansicht (analog News/Blog), ohne
  HTML schreiben zu müssen

## MODIFIED Requirements

### Requirement: Mediathek-Inhalte in Seiteninhalte einfügen
Der Editor SHALL das Einfügen von Bildern aus der Mediathek in den Inhalt von News, Seminaren,
Blog und statischen Seiten ermöglichen. Ausgewählte Medien SHALL als Markdown-Bild-Referenz
`![…](/api/media/{id})` in den Inhalt eingefügt werden.

#### Scenario: Bild in Markdown-Inhalt einfügen
- **WHEN** ein Redakteur im Seiten-Editor „Bild aus Mediathek einfügen" nutzt und ein Bild wählt
- **THEN** wird eine Bild-Referenz (`![…](/api/media/{id})`) in den Inhalt eingefügt

#### Scenario: Bild in CMS-Seite einfügen
- **WHEN** ein Redakteur im CMS-Seiten-Editor (statische Seite) ein Mediathek-Bild einfügt
- **THEN** wird eine Markdown-Bild-Referenz (`![…](/api/media/{id})`) in den Inhalt eingefügt

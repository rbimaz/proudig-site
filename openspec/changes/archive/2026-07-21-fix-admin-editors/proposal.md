# Admin-Editoren reparieren: Erstellen & Mediathek-Nutzung

## Warum
- **Blog/Seminar anlegen führt zu leerem Screen.** `BlogList` navigiert zu `/admin/blog/new`
  und `SeminarList` zu `/admin/seminare/new` — die Routen liegen aber unter `/admin/cms/…`.
  Die Ziele existieren nicht → leere Seite. (`NewsList`/`StaticPageList` nutzen korrekt `/admin/cms/…`.)
- **Nach dem Speichern** leitet `PageEditor` zu `/admin/${category}/${id}` um — ebenfalls ohne
  `/cms`, und `seminar` ≠ Routen-Segment `seminare` → nach dem Speichern erneut leerer Screen.
- **Mediathek-Inhalte lassen sich nicht in Inhalte einbetten.** Der Bild-Picker setzt nur das
  Titelbild. Es fehlt eine Möglichkeit, Bilder aus der Mediathek in den Inhalt von News,
  Seminaren, Blog und CMS-Seiten einzufügen.

## Was
- Navigationspfade in `BlogList` und `SeminarList` auf `/admin/cms/…` korrigieren.
- `PageEditor`-Weiterleitungen nach Speichern/Veröffentlichen auf `/admin/cms/<segment>/<id>`
  korrigieren (mit korrektem Segment für `SEMINAR` → `seminare`).
- `MediaPicker` um einen Einfüge-Modus erweitern (Auswahl liefert die Mediathek-ID an einen Callback).
- In `PageEditor` (News/Seminar/Blog) einen „Bild aus Mediathek einfügen"-Button ergänzen, der
  Markdown `![name](/api/media/{id})` in den Inhalt einfügt.
- In `StaticPageEditor` (CMS-Seiten) einen Media-Einfüge-Button ergänzen, der `<img src="/api/media/{id}">`
  in den HTML-Inhalt einfügt.

## Nicht-Ziele
- Kein Umbau des generischen CMS-Datenmodells.
- Kein Cursor-genaues Einfügen (Anhängen an den Inhalt genügt, analog bestehender Snippets).

# Design — Admin-Editoren

## Routen-Fix (leerer Screen)
Alle CMS-Editor-Routen liegen unter `/admin/cms/…` (siehe `App.jsx`):
`/admin/cms/blog/new`, `/admin/cms/blog/:id`, `/admin/cms/seminare/new`, `/admin/cms/seminare/:id`.

- `BlogList`: `navigate('/admin/blog/new')` → `/admin/cms/blog/new`; Edit `/admin/cms/blog/${id}`.
- `SeminarList`: `navigate('/admin/seminare/new')` → `/admin/cms/seminare/new`; Edit `/admin/cms/seminare/${id}`.
- `PageEditor`: nach POST/Publish `navigate('/admin/${category.toLowerCase()}/${id}')` ersetzen durch
  `/admin/cms/${segment}/${id}` mit Segment-Zuordnung `BLOG→blog`, `SEMINAR→seminare`, `NEWS→news`.

## MediaPicker — Einfüge-Modus
`MediaPicker` erhält optionalen `onInsert(id, item)` + `buttonLabel`:
- Mit `onInsert`: rendert nur einen Auslöse-Button (`buttonLabel`); Klick auf eine Kachel ruft
  `onInsert(id, item)` und schließt das Modal (keine Titelbild-Vorschau).
- Ohne `onInsert` (bestehend): Titelbild-Modus mit `value`/`onChange` + Vorschau/„Ändern"/„Entfernen".

Bild-URL/Kacheln unverändert über `/api/media/{id}` (öffentlich via `SecurityConfig`).

## Einfügen in Inhalt
- `PageEditor` (Markdown): Button über dem Inhalts-Textarea; `onInsert` hängt
  `\n![${item.name}](/api/media/${id})\n` an `data.content` (über `handleChange('content', …)`).
- `StaticPageEditor` (HTML): Button in der Snippet-Leiste; `onInsert` ruft
  `insertSnippet('<img src="/api/media/${id}" alt="${item.name}" />')`.

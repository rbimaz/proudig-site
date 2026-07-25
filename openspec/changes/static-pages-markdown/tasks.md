## 1. Öffentliches Rendering (Markdown)
- [x] 1.1 `StaticPageRenderer.jsx`: `dangerouslySetInnerHTML` durch `ReactMarkdown` + `remark-gfm` ersetzen; Seiten-Rahmen (`section`/`container`/`section-header` mit Titel aus `page.title`, Subtitle aus `page.excerpt`) im Renderer liefern; Loading/Error/`Footer`/`visible`-Animation unverändert lassen

## 2. Admin-Editor (Markdown)
- [x] 2.1 `StaticPageEditor.jsx`: HTML-Textarea/`dangerouslySetInnerHTML`-Preview, HTML-/Grid-/Section-Snippets und CSS-Klassen-Hilfe entfernen
- [x] 2.2 Markdown-Editor analog `PageEditor.jsx` einbauen (Tabs Bearbeiten/Vorschau, `ReactMarkdown` + `remark-gfm`); übrige Felder (Titel, Slug, Status, Speichern gegen `/api/admin/pages`) beibehalten
- [x] 2.3 Medien-Einfügen beibehalten, aber Markdown-Referenz `![…](/api/media/{id})` statt `<img>` einfügen

## 3. Impressum-Inhalt (Liquibase-Upsert, kontextlos)
- [x] 3.1 `db/changelog/017-impressum-markdown-seed.xml` anlegen: changeSet A `<update pages … WHERE slug='impressum'>` (Markdown-`content` + `category=STATIC`); changeSet B `<insert>` mit `<preConditions onFail="MARK_RAN">`-Count-0-Check (frische DB) — beide **ohne** `context`
- [x] 3.2 Markdown-Inhalt mit hartem Zeilenumbruch im Adressblock und Links als `[text](url)`; `author_id=f47ac10b-58cc-4372-a567-0e02b2c3d479`, `status=PUBLISHED`, Zeitstempel setzen
- [x] 3.3 `<include file="db/changelog/017-impressum-markdown-seed.xml"/>` in `master.xml` nach `016-…` ergänzen

## 4. Toter Impressum-Code entfernen
- [x] 4.1 Löschen: `components/Impressum.jsx`, `pages/ImpressumPage.jsx`, `pages/admin/editors/ImpressumEditor.jsx`
- [x] 4.2 `App.jsx`: ungenutzten `import { ImpressumPage }` entfernen

## 5. Verifikation
- [x] 5.1 Frontend Lint/Build grün
- [x] 5.2 `openspec validate static-pages-markdown --strict` grün
- [x] 5.3 Visuelle Kontrolle: `/impressum` rendert formatiertes Markdown (Adressblock, Links) ohne rohes HTML; Editor bearbeitet die Seite als Markdown mit Vorschau

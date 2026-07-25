# Design — Statische Seiten auf Markdown

## `StaticPageRenderer.jsx` (öffentliches Rendering)
- `dangerouslySetInnerHTML` entfernen; stattdessen `ReactMarkdown` + `remark-gfm` (Muster wie
  `NewsPostPage.jsx`/`BlogPostPage.jsx`).
- Seiten-Rahmen liefert der Renderer, nicht mehr der Content:
  ```jsx
  <section className="section">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">{page.title}</h2>
        {page.excerpt && <p className="section-subtitle">{page.excerpt}</p>}
      </div>
      <div className={`content-area static-page-inner ${visible ? 'visible' : ''}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
      </div>
    </div>
  </section>
  ```
- Der dekorative Eyebrow-Tag („§ RECHTLICHES") entfällt (war Teil des eingebetteten HTML, kein
  Datenfeld) — bewusste Vereinfachung.
- Loading/Error/`Footer`/`visible`-Animation bleiben unverändert.

## `StaticPageEditor.jsx` (Admin-Editor)
- **Entfernen:** rohe HTML-Textarea-Semantik, Live-`dangerouslySetInnerHTML`-Preview, HTML-/Grid-/
  Section-Snippet-Vorlagen und die CSS-Klassen-Hilfe.
- **Ersetzen** durch Markdown-Editor analog `PageEditor.jsx`: Tabs „Bearbeiten"/„Vorschau", Textarea
  für `content`, Vorschau via `ReactMarkdown` + `remark-gfm`.
- **Behalten (als Markdown):** Medien-Einfügen aus der Mediathek — fügt künftig eine Markdown-Bild-
  Referenz `![…](/api/media/{id})` ein (statt bisher `<img src=…>`), konsistent mit News/Blog.
- Übrige Felder (Titel, Slug, Status/Veröffentlichung, Speichern gegen `/api/admin/pages`) bleiben.

## Impressum-Inhalt — Liquibase-Changeset
- Neue Datei `db/changelog/017-impressum-markdown-seed.xml`, im `master.xml` nach `016-...`
  eingebunden.
- **Kontextlos** (kein `context="dev"`), damit es in jeder Umgebung läuft — jetzt (universeller
  `dev`-Kontext) und nach einer etwaigen künftigen Kontext-Trennung.
- **Upsert-Semantik** wegen bereits bestehender persistenter Prod-Zeile:
  - changeSet A `<update tableName="pages">` setzt `content` (Markdown) + `category=STATIC` für
    `WHERE slug='impressum'` (korrigiert bestehende HTML-Zeile).
  - changeSet B `<insert>` legt die Zeile an, geschützt durch
    `<preConditions onFail="MARK_RAN"><sqlCheck expectedResult="0">SELECT count(*) FROM pages WHERE slug='impressum'</sqlCheck></preConditions>`
    (nur falls keine Zeile existiert, z.B. frische DB).
- Spalten am Muster aus `012-seminar-seed.xml`: `slug=impressum`, `title=Impressum`,
  `category=STATIC`, `status=PUBLISHED`, `author_id=f47ac10b-58cc-4372-a567-0e02b2c3d479`
  (kontextlos geseedeter Default-Admin, FK-sicher), Zeitstempel gesetzt.
- Markdown-Inhalt mit **harten Zeilenumbrüchen** im Adressblock (zwei Leerzeichen bzw. `&#10;` mit
  trailing spaces), damit Firma/Straße/Ort untereinander bleiben; Links als `[text](url)`.

## Toter Impressum-Code entfernen
- Löschen: `src/main/frontend/src/components/Impressum.jsx`,
  `src/main/frontend/src/pages/ImpressumPage.jsx`,
  `src/main/frontend/src/pages/admin/editors/ImpressumEditor.jsx`.
- `App.jsx`: ungenutzten `import { ImpressumPage } ...` (Zeile 13) entfernen.
- **Nicht** anfassen: `ContentBlock`-Backend/`/api/admin/content` und die übrigen `editors/*`
  (out-of-scope, geteilte Abhängigkeit).

## Verifikation
- Frontend Lint/Build grün.
- Renderer zeigt Impressum als formatiertes Markdown (Headings/Links/Adressblock) ohne rohes HTML.
- Editor bearbeitet `STATIC`-Seite als Markdown mit Vorschau.
- `openspec validate static-pages-markdown --strict` grün.

# Statische Seiten auf Markdown vereinheitlichen

## Warum
Statische Inhaltsseiten (`STATIC`) werden aktuell als **rohes HTML** gepflegt und via
`dangerouslySetInnerHTML` (ohne Sanitizing) gerendert, während News/Blog/Seminare bereits
**Markdown** nutzen. Aktuell existiert genau eine ausgelieferte statische Seite: das **Impressum**.
Die Uneinheitlichkeit bedeutet zwei Editor-/Render-Wege, HTML-Kenntnis für Redakteure und ein
XSS-Risiko durch rohes HTML. Zusätzlich existieren drei konkurrierende Impressum-Mechanismen, von
denen zwei toter Code sind.

## Was
- `STATIC`-Seiten werden wie News/Blog als **Markdown** editiert und gerendert.
  - `StaticPageRenderer` rendert `content` mit `ReactMarkdown` + `remark-gfm` und liefert den
    Seiten-Rahmen (`section`/`container`/Header, Titel aus `page.title`) selbst — kein
    `dangerouslySetInnerHTML` mehr.
  - `StaticPageEditor` wird zum Markdown-Editor (Textarea + Vorschau, Muster aus `PageEditor`).
- Der **Impressum-Inhalt** wird per **kontextlosem Liquibase-Changeset** als Markdown gesetzt
  (Upsert: bestehende Zeile aktualisieren, sonst anlegen), damit jede Umgebung — inkl. der
  bestehenden persistenten Prod-Zeile — korrekt auf Markdown landet und kein Broken-State entsteht.
- **Toter Impressum-Code** wird entfernt: `components/Impressum.jsx`, `pages/ImpressumPage.jsx`,
  `pages/admin/editors/ImpressumEditor.jsx` und der ungenutzte Import in `App.jsx`.

## Nicht-Ziele
- **Keine** Änderung an News/Blog/Seminar-Content oder deren Editoren/Renderern.
- **Kein** `contentFormat`-Flag pro Seite — `STATIC` ist künftig ausschließlich Markdown
  (Over-Engineering bei einer einzigen Seite).
- **Kein** individuelles Seitenlayout mehr für `STATIC` (Grids/Spalten/HTML-Snippets entfallen);
  layout-lastige Seiten liegen ohnehin hartkodiert in React.
- **Keine** Änderung am `ContentBlock`-Backend (`/api/admin/content`), da es von weiteren
  (out-of-scope, ebenfalls unreferenzierten) Editoren geteilt wird.
- **Keine** Änderung des Liquibase-Kontext-Setups (Prod läuft weiterhin unter `dev`).

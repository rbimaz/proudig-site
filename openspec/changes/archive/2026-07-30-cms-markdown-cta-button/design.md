## Context

Öffentliche CMS-Inhalte werden mit `react-markdown` v9 + `remark-gfm` gerendert.
Raw-HTML ist bewusst deaktiviert (kein `rehype-raw`), es sind keine Custom-
`components` registriert. Die Renderer sind in vier Seiten dupliziert
(`StaticPageRenderer.jsx`, `BlogPostPage.jsx`, `NewsPostPage.jsx`,
`SeminarDetailPage.jsx`) sowie in zwei Editor-Vorschauen (`StaticPageEditor.jsx`,
`PageEditor.jsx`). Alle nutzen dasselbe Muster:
`<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>`.

Button-Styles sind bereits vorhanden: `.btn` (Basis) + `.btn-cta` (Modifier) in
`App.css` — ein CTA-Button braucht beide Klassen (`className="btn btn-cta"`).
Navigation läuft über React Router 7; Standard-Markdown-Links rendern als `<a>`
und lösen einen vollen Reload aus.

## Goals / Non-Goals

**Goals:**
- Markdown-Link mit Title `button` als `.btn btn-cta` rendern.
- Interne Ziele (`/…`) clientseitig via React-Router-`<Link>` navigieren.
- Eine einzige gemeinsame Renderer-Komponente, in allen sechs Stellen verwendet.
- Kein Raw-HTML, kein neues npm-Paket, keine Backend-/DB-Änderung.

**Non-Goals:**
- Keine Button-Varianten (primär/sekundär) — nur der eine CTA-Button.
- Kein WYSIWYG-Editor oder Toolbar-Button zum Einfügen (v1: Autoren tippen die
  Konvention selbst; ggf. später).
- Keine Änderung an Bild-/Tabellen-/GFM-Rendering.

## Decisions

**1. Gemeinsame Komponente `MarkdownContent` statt sechsfacher Duplizierung.**
Neue Datei `src/main/frontend/src/components/MarkdownContent.jsx`, die
`ReactMarkdown` mit `remarkPlugins={[remarkGfm]}` und einem Custom-`a`-Renderer
kapselt. Alle sechs Stellen ersetzen ihren Inline-`<ReactMarkdown>`-Aufruf durch
`<MarkdownContent>{content}</MarkdownContent>`.
Alternative (Custom-Renderer je Datei kopieren) verworfen — Duplizierung war
bereits Ursache der Inkonsistenz.

**2. Erkennung über den Link-Title `button` (Variante A).**
`react-markdown` reicht den Markdown-Title als `title`-Prop an den `a`-Renderer.
Ist `title === 'button'`, wird `className="btn btn-cta"` gesetzt und die
`title`-Prop nicht durchgereicht (kein Tooltip „button"). Alternative
(`remark-directive`) verworfen — mehr Aufwand, für einen einzigen Button-Typ
nicht nötig.

**3. Internes Ziel = `href` beginnt mit `/` und nicht mit `//`.**
Solche Ziele werden als React-Router-`<Link to={href}>` gerendert (mit oder ohne
Button-Klasse). Alles andere (`http(s)://`, `mailto:`, `#…`, `//…`) bleibt ein
`<a href>`; externe Ziele erhalten zusätzlich `target="_blank"` +
`rel="noopener noreferrer"`. Externe CTA-Buttons bleiben `<a>` mit
`btn btn-cta`.

## Risks / Trade-offs

- [Autor tippt Title falsch, z. B. `"Button"` oder `"btn"`] → Nur exakt
  `button` (klein) greift; sonst normaler Link. Konvention in Autoren-Hinweis
  dokumentieren.
- [Regression in einem der sechs Renderer beim Umstellen] → Alle Stellen auf
  dieselbe Komponente umstellen; Unit-Tests für `MarkdownContent` (Button,
  interner Link, externer Link) sichern das Verhalten ab.
- [Kein XSS-Risiko] → Raw-HTML bleibt aus; es wird ausschließlich react-markdown-
  eigenes AST verarbeitet, keine `dangerouslySetInnerHTML`.

## Open Questions

- Soll später ein Editor-Hilfstext / Toolbar-Button die Konvention erklären bzw.
  einfügen? (Out of scope für v1, als Folge-Change denkbar.)

## 1. Gemeinsame Renderer-Komponente

- [x] 1.1 `src/main/frontend/src/components/MarkdownContent.jsx` anlegen: kapselt `ReactMarkdown` mit `remarkPlugins={[remarkGfm]}` und einem Custom-`a`-Renderer
- [x] 1.2 Custom-`a`-Renderer: internes Ziel erkennen (`href` beginnt mit `/`, nicht mit `//`) → React-Router-`<Link to={href}>`; sonst `<a href>` mit `target="_blank"` + `rel="noopener noreferrer"` für externe Ziele
- [x] 1.3 Button-Konvention: bei `title === 'button'` Klasse `btn btn-cta` setzen und `title`-Prop nicht durchreichen; funktioniert für interne (`Link`) wie externe (`a`) Ziele

## 2. Renderer in Content-Seiten umstellen

- [x] 2.1 `StaticPageRenderer.jsx` auf `<MarkdownContent>` umstellen
- [x] 2.2 `BlogPostPage.jsx` auf `<MarkdownContent>` umstellen
- [x] 2.3 `NewsPostPage.jsx` auf `<MarkdownContent>` umstellen
- [x] 2.4 `SeminarDetailPage.jsx` auf `<MarkdownContent>` umstellen
- [x] 2.5 Verwaiste `ReactMarkdown`/`remarkGfm`-Imports in den geänderten Dateien entfernen

## 3. Editor-Vorschau umstellen

- [x] 3.1 `StaticPageEditor.jsx`-Vorschau auf `<MarkdownContent>` umstellen
- [x] 3.2 `PageEditor.jsx`-Vorschau auf `<MarkdownContent>` umstellen

## 4. Tests & Abschluss

- [x] 4.1 Unit-Test für `MarkdownContent`: CTA-Button (`[Text](/kontakt "button")`) rendert `btn btn-cta` mit Link auf `/kontakt`
- [x] 4.2 Unit-Test: normaler interner Link rendert als Router-`Link` ohne `btn-cta`; externer Link rendert als `<a target="_blank">`; externer Button behält `btn-cta`
- [x] 4.3 `npm run test:run` ausführen (volle Suite) und Build/Lint grün
- [x] 4.4 Autoren-Hinweis zur Button-Konvention ergänzen (kurzer Hilfstext im Editor oder Doku-Notiz)

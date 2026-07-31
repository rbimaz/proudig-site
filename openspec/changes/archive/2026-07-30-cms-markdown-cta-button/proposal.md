## Why

Redakteur:innen können im CMS Seiten in Markdown schreiben (z. B. Werbung für das
eigene Unternehmen), aber es gibt keine Möglichkeit, einen hervorgehobenen
Call-to-Action-Button auf eine App-interne Seite zu setzen. Reine Markdown-Links
rendern als schlichtes `<a>` ohne Button-Optik und lösen zudem einen vollen
Seiten-Reload aus. Raw-HTML ist im Renderer bewusst deaktiviert, also fehlt heute
jeder Weg zu einem gestylten CTA.

## What Changes

- Neue Autoren-Konvention: Ein Markdown-Link mit dem Title `"button"` — z. B.
  `[Jetzt anfragen](/kontakt "button")` — wird als CTA-Button (`.btn-cta`)
  gerendert statt als normaler Link.
- Ein gemeinsamer `react-markdown`-Custom-Renderer für das `a`-Element wird in
  allen Content-Renderern verwendet (statische Seiten, Blog, News, Seminare) und
  in der Editor-Vorschau, damit die Darstellung konsistent ist.
- Interne Ziele (Pfad beginnt mit `/`) navigieren clientseitig über den React-
  Router (`<Link>`) statt per Full-Page-Reload; das gilt für CTA-Buttons und für
  normale interne Links.
- Kein Raw-HTML wird aktiviert; die Umsetzung bleibt rein über die
  Title-Konvention und den Custom-Renderer (kein XSS-Risiko).

## Capabilities

### New Capabilities
- `content-cta-button`: Rendering-Verhalten für Markdown-Links in CMS-Inhalten —
  Erkennung der Button-Konvention, CTA-Button-Darstellung und clientseitige
  Navigation für interne Ziele über alle öffentlichen Content-Typen hinweg.

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements; die Autoren-Konvention
     ist additiv und das Rendering war bisher nicht spezifiziert. -->

## Impact

- Frontend-Renderer: `StaticPageRenderer.jsx`, `BlogPostPage.jsx`,
  `NewsPostPage.jsx`, `SeminarDetailPage.jsx` sowie die Editor-Vorschauen
  (`StaticPageEditor.jsx`, `PageEditor.jsx`).
- Neue gemeinsame Renderer-Komponente/Helper (z. B. `MarkdownContent`) mit
  `components={{ a }}`; nutzt bestehende `.btn-cta`-Styles aus `App.css`.
- Abhängigkeiten: React Router 7 (`Link`), bestehendes `react-markdown` +
  `remark-gfm`. Keine neuen npm-Abhängigkeiten, keine Backend-/DB-Änderungen.
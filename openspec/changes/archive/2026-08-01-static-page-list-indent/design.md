## Context

STATIC-Seiten werden über `StaticPageRenderer.jsx` gerendert, der den
Markdown-Inhalt via `MarkdownContent` (react-markdown + remark-gfm) in einen
Container `.content-area.static-page-inner` schreibt. Der globale Reset in
`App.css` (`* { margin: 0; padding: 0 }`) nullt Padding/Margin aller `ul`/`ol`;
ohne `padding-left` sitzen die Aufzählungszeichen (Default `list-style-position:
outside`) außerhalb des Inhaltsflusses und werden nicht sichtbar eingerückt.
Blog- (`.blog-post-content ul/ol`) und Seminar-Inhalte
(`.seminar-detail-content ul/ol`) stellen das über eigene Regeln wieder her;
`.static-page-inner` fehlt diese Regel.

## Goals / Non-Goals

**Goals:**
- Aufzählungen im STATIC-Inhalt eingerückt und mit sichtbaren Zeichen darstellen.
- Konsistenz mit der bestehenden Blog-/Seminar-Darstellung.

**Non-Goals:**
- Keine Änderung am globalen Reset (würde Layout an anderer Stelle beeinflussen).
- Keine Änderung an Renderer-Logik, Markdown-Pipeline, API oder Datenmodell.

## Decisions

- **Scoped CSS-Regel statt globalem Reset-Eingriff:** Neue Regeln
  `.static-page-inner ul, .static-page-inner ol { margin-bottom: 1rem;
  padding-left: 2rem; }` und `.static-page-inner li { margin-bottom: 0.5rem; }`
  in `App.css`, direkt nach dem `.static-page-inner`-Block. Werte 1:1 aus
  `.blog-post-content` übernommen, um Konsistenz sicherzustellen und keine neuen
  Design-Tokens einzuführen.

## Risks / Trade-offs

- Minimal: rein additive, auf `.static-page-inner` begrenzte CSS-Regel. Kein
  Einfluss auf andere Seiten. Verschachtelte Listen erben die Einrückung
  kaskadierend — für die aktuellen redaktionellen Inhalte ausreichend.
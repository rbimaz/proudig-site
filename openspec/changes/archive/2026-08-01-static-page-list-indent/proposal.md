## Why

Aufzählungen (`ul`/`ol`) im Markdown-Inhalt veröffentlichter STATIC-Seiten
werden ohne Einrückung und ohne sichtbare Aufzählungszeichen dargestellt. Der
globale CSS-Reset (`* { margin: 0; padding: 0 }`) entfernt das Listen-Padding,
und der STATIC-Renderer-Container (`.static-page-inner`) stellt es — anders als
Blog- und Seminar-Inhalte — nicht wieder her. Dadurch wirken Listen wie
fortlaufende Absätze, was die Lesbarkeit redaktioneller Inhalte spürbar
verschlechtert.

## What Changes

- Der STATIC-Renderer SHALL Aufzählungen im Markdown-Inhalt eingerückt und mit
  sichtbaren Aufzählungszeichen darstellen (analog zu Blog-/Seminar-Inhalten).
- Rein visuelle Änderung im Frontend-Stylesheet (`.static-page-inner ul/ol/li`);
  keine Änderung an Renderer-Logik, API oder Datenmodell.

## Capabilities

### New Capabilities

_(keine)_

### Modified Capabilities

- `static-pages`: Ergänzt eine Anforderung an die Darstellung von Listen im
  Markdown-Inhalt des öffentlichen STATIC-Renderers (Einrückung + sichtbare
  Aufzählungszeichen).

## Impact

- Frontend: `src/main/frontend/src/App.css` (Regeln für `.static-page-inner
  ul/ol/li`).
- Keine Backend-, API- oder DB-Änderung. Kein neuer Abhängigkeit.
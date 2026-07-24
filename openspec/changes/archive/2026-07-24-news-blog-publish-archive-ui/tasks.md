## 1. NewsList

- [x] 1.1 `handleArchive(id)` → `PUT /api/admin/pages/{id}/archive`, danach `fetchPosts()`
- [x] 1.2 „Archivieren"-Button (Icon `bi-archive`) rendern, wenn `status === 'PUBLISHED'`; „Veröffentlichen" bleibt bei `status !== 'PUBLISHED'`

## 2. BlogList

- [x] 2.1 Status-Handling angleichen: `STATUS_LABELS`/`statusLabel`/`statusClass`, Großschreibung (`PUBLISHED`); Status-Badge korrekt
- [x] 2.2 `handleArchive(id)` ergänzen; „Veröffentlichen"/„Archivieren"-Buttons nach denselben Bedingungen wie NewsList

## 3. Verifikation

- [x] 3.1 Frontend Lint/Build grün
- [x] 3.2 `openspec validate news-blog-publish-archive-ui --strict` grün
- [x] 3.3 Visuelle Kontrolle: Aktionen je Status korrekt (Entwurf/Veröffentlicht/Archiviert)

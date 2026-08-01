## 1. Renderer

- [x] 1.1 In `StaticPageRenderer.jsx` den Eyebrow als `section-tag` über dem Titel ausgeben, wenn `page.metaData` gesetzt ist (Untertitel aus `excerpt` bleibt).

## 2. Seiten-Editor

- [x] 2.1 In `StaticPageEditor.jsx` State `eyebrow` und `excerpt` ergänzen und beim Laden aus `page.metaData` bzw. `page.excerpt` vorbefüllen.
- [x] 2.2 Eingabefelder „Eyebrow" (über Titel) und „Untertitel" (nach Titel) im Meta-Bereich ergänzen.
- [x] 2.3 In allen Save-/Publish-Bodies `excerpt` und `metaData: eyebrow` mitsenden (Entwurf speichern, Neu-Veröffentlichen, Bestehende veröffentlichen).

## 3. Verifikation

- [x] 3.1 Frontend-Testsuite läuft grün (`npm run test:run`).
- [x] 3.2 Manuell prüfen: STATIC-Seite mit Eyebrow/Titel/Untertitel rendert das dreiteilige Muster wie die übrigen Seiten.

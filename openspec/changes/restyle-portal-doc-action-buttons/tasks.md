## 1. ActionButton neu gestalten

- [x] 1.1 Basis-Style: 42×42, Radius 8, weißer BG, Rahmen `--line`, Icon `--ink-3` ~18px; disabled = reduzierte Deckkraft.
- [x] 1.2 Hover/Fokus (nicht disabled): Füllung `--orange` (BG + Rahmen), Icon `#fff`; `danger` → Füllung `--danger` + Icon `#fff`.
- [x] 1.3 Icon-only beibehalten; `title`/`aria-label` unverändert.

## 2. Verifikation

- [x] 2.1 `npm --prefix src/main/frontend run build` + `test:run` grün (bestehende PortalDocuments-Tests nutzen `title` → unberührt).
- [ ] 2.2 Sichtprüfung im Dev-App (durch Nutzer) (`/admin/portal/documents`): Größe 42px, Hover füllt Orange (Icon weiß), Löschen füllt Rot.

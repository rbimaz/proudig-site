## 1. ActionButton neu gestalten

- [x] 1.1 Basis-Style: 42×42, Radius 8, weißer BG, Rahmen `--line`, Icon `--ink-3` ~18px; disabled = reduzierte Deckkraft.
- [x] 1.2 Hover/Fokus (nicht disabled): Füllung `--orange` (BG + Rahmen), Icon `#fff`; `danger` → Füllung `--danger` + Icon `#fff`.
- [x] 1.3 Icon-only beibehalten; `title`/`aria-label` unverändert.

## 2. Layout: Breite + rechte Ausrichtung

- [x] 2a `.portal-documents-v2`: `max-width: 1200px` entfernt (füllt die Breite).
- [x] 2b `--gutter: 0 40px` → `0` (Blöcke an der 2rem-Basis von `.portal-content` = Navbar-Rand); Mobile-Override (`0 16px`) unberührt.

## 3. Verifikation

- [x] 3.1 `npm --prefix src/main/frontend run build` + `test:run` grün (nach Layout-Änderung erneut).
- [ ] 3.2 Sichtprüfung im Dev-App (durch Nutzer) (`/admin/portal/documents`): Buttons 42px + Füll-Hover; Tabelle voll-breit, rechter Rand = Navbar (32px).

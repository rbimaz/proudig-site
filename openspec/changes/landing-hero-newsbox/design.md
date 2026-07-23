# Design — Hero-News-Box & konfigurierbare Landing

## Konfig-Flag (ContentBlock)
- Träger: bestehender ContentBlock `HERO` (bearbeitet über `HeroEditor` / `/api/admin/content/HERO`).
- Neues Feld `newLanding` (boolean) im JSON. `HeroEditor` bekommt einen Toggle „Neue Landing
  (Kugel/News) aktivieren".
- Frontend liest über `useContent()`: `blocks.HERO?.newLanding`.
  - **Default (kein/`undefined`): neue Landing** (`!== false`), damit die Variante sichtbar ist.
  - `false` → alte Landing.
- `useContent()` liefert nur **veröffentlichte** Blocks → Flag wirkt nach „Veröffentlichen".

## News-Hero-Flag (Backend)
- Migration `013-page-show-in-hero.xml`: Spalte `show_in_hero BOOLEAN DEFAULT FALSE` an `pages`;
  zusätzlich Demo: eine Beispiel-News auf `true` setzen.
- `Page`, `PageDto`, `PageCreateRequest`, `PageUpdateRequest`: Feld `showInHero`.
- `PageService`: in create/update setzen (default false), in `mapToDto` ausgeben.
- `PageService.getHeroNews()`: `category=NEWS`, `status=PUBLISHED`, `showInHero=true`,
  sortiert `publishedAt desc`, Limit 4.
- `NewsController`: `GET /api/news/hero` → Liste (öffentlich, `permitAll` deckt `/api/news/**`).

## Frontend
- **PageEditor:** Checkbox „Im Hero anzeigen" (Feld `showInHero`), wird über `toPayload()` gesendet.
- **`useHeroNews()`** (Hook): lädt `/api/news/hero` → `[]` bei Fehler.
- **`HeroNewsBox`** (Komponente): Glas-Karte gem. Handoff, nur `var(--c-*)`-Tokens.
  - Kopf: Eyebrow (Akzent) + optional Zähler. Aufmacher: Kategorie-Pill + Datum, Titel
    (Space Grotesk), Excerpt, „Mehr erfahren →" (Link zu `/news/{slug}`).
  - Bei mehreren: Trennlinie + kompakte Liste (Kategorie + Titel + „→"), Fuß „Alle News ansehen →".
  - `max-width: 440px`, rechtsbündig im rechten Hero-Slot.
- **`Hero`/`HeroUdig2`:** liest Konfig; rechter Slot:
  - alte Landing → `<HeroVisualCarousel />`.
  - neue Landing → `heroNews.length > 0 ? <HeroNewsBox items=… /> : <div className="orb">…`.
- **`HomePage`:** `<News />`-Sektion nur in der **alten** Landing rendern.

## Styles
`.hero-newsbox*`-Block in `App.css` mit Tokens (`--c-accent`, `--c-primary`, `--c-white`,
`--c-accent-soft`; Sekundärtext auf dunkel als eigenes lokales Grau, da kein Token). Glas:
`rgba(255,255,255,.05)`, `backdrop-filter: blur(14px)`. Responsive < 900px: unter den Hero-Text,
volle Breite.

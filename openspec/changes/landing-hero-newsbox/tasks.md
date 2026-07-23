## 1. Backend — showInHero + Hero-News

- [x] 1.1 Migration `013-page-show-in-hero.xml`: Spalte `show_in_hero BOOLEAN DEFAULT FALSE` + Demo-News auf `true`; in `master.xml` einbinden
- [x] 1.2 `Page`-Entity: Feld `showInHero`
- [x] 1.3 `PageDto`, `PageCreateRequest`, `PageUpdateRequest`: `showInHero`
- [x] 1.4 `PageService`: create/update setzen, `mapToDto` ausgeben; `getHeroNews()` (NEWS+PUBLISHED+showInHero, publishedAt desc, Limit 4)
- [x] 1.5 `NewsController`: `GET /api/news/hero`

## 2. Frontend — Konfig & Editor

- [x] 2.1 `HeroEditor`: Toggle „Neue Landing (Kugel/News) aktivieren" (Feld `newLanding`)
- [x] 2.2 `PageEditor`: Checkbox „Im Hero anzeigen" (`showInHero`), über `toPayload()` senden + beim Laden übernehmen

## 3. Frontend — Hero-News-Box & Weiche

- [x] 3.1 `useHeroNews()`-Hook (`/api/news/hero`)
- [x] 3.2 `HeroNewsBox`-Komponente (Handoff-Design, Tokens) inkl. Mehrfach-Liste + Zähler
- [x] 3.3 `Hero`/`HeroUdig2`: Konfig lesen; alte Landing → `HeroVisualCarousel`, neue → Kugel/News-Box
- [x] 3.4 `HomePage`: `<News />`-Sektion nur in alter Landing
- [x] 3.5 `.hero-newsbox*`-Styles in `App.css` (Tokens, Glas, responsive)

## 4. Verifikation

- [x] 4.1 Backend kompiliert, Frontend Lint/Build grün
- [x] 4.2 `openspec validate landing-hero-newsbox --strict` grün
- [x] 4.3 Visuelle Kontrolle der News-Box gegen Zielbild

## 1. Asset

- [x] 1.1 Orb-Grafik als `public/proudig-orb.jpg` ablegen (von externer URL geladen)

## 2. Markup (Hero.jsx)

- [x] 2.1 In `HeroUdig2` das Rechts-Spalten-Visual (`hero-udig2-visual` → `HeroVisualCarousel`) entfernen; Layout einspaltig
- [x] 2.2 `<div className="orb"><img src="/proudig-orb.jpg" alt="ProuDig Digital Orb" /></div>` als absolutes Deko-Element im `hero-udig2`-Section ergänzen
- [x] 2.3 Ungenutzten `HeroVisualCarousel`-Import entfernen

## 3. Styles (App.css)

- [x] 3.1 `.orb` (absolute, top:50%, right:-6%, translateY(-50%), width:60%, max-width:820px, opacity:.9, pointer-events:none, z-index:1)
- [x] 3.2 `.orb img` (width:100%, display:block, mix-blend-mode:screen, filter hue-rotate/saturate/brightness, radiale mask-image + -webkit-, animation floatOrb)
- [x] 3.3 `@keyframes floatOrb` (0/100% translateY(0); 50% translateY(-22px)) + `prefers-reduced-motion` Abschaltung
- [x] 3.4 Text/Container über die Kugel (`z-index: 2`); Responsive < ~900px Kugel dezenter (opacity senken)

## 4. Verifikation

- [x] 4.1 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 4.2 Visuelle Kontrolle (App starten, Screenshot)
- [x] 4.3 `openspec validate hero-orb --strict` erfolgreich

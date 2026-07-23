# Hero-News-Box + konfigurierbare Landing (Kugel/News ⇄ Prozess-Bild)

## Warum
Zwei Anforderungen:
1. **Design-Handoff:** Im Hero rechts soll die animierte **Kugel** durch eine **News-Box**
   ersetzt werden, sobald relevante News existieren; sonst bleibt die Kugel.
2. **Betrieb:** Die Umstellung auf die **neue Landing** (Kugel/News) soll **per Konfiguration**
   schaltbar sein. Bei `false` erscheint die **alte Landing mit Prozess-Bild** (wie `main`).

## Was
- **Konfig-Flag** über das bestehende ContentBlock-System (`sectionKey HERO`, Feld `newLanding`),
  im Admin-`HeroEditor` umschaltbar, im Frontend über `useContent()` gelesen.
  - `newLanding !== false` → neue Landing (Kugel/News-Box, keine Homepage-News-Sektion).
  - `newLanding === false` → alte Landing (`HeroVisualCarousel`/Prozess-Bild + Homepage-News-Sektion).
- **Hero-News-Weiche:** `GET /api/news/hero` liefert veröffentlichte News mit gesetztem
  Hero-Flag (neueste zuerst). Liste leer → Kugel; sonst → **HeroNewsBox** (Aufmacher; bei
  mehreren zusätzlich kompakte Liste + Zähler).
- **News-Hero-Flag:** neues Feld `showInHero` an `Page`/News (Migration + DTO + Editor-Checkbox).

## Nicht-Ziele
- Kugel-Animation/Optik nicht neu bauen (bestehendes Element, nur bedingtes Rendern).
- Restlicher Hero (Headline, Text, Buttons, Navigation) unverändert.
- Kein neues Settings-/Feature-Flag-System (ContentBlock genügt).

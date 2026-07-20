# ProuDig — Design System (`DESIGN.md`)

> **Single Source of Truth für das UI.** Diese Datei ist verbindlich. Jedes neue Design,
> jede neue Komponente und jede Änderung an bestehenden Styles muss sich an den hier
> definierten Tokens und Regeln orientieren. Abweichungen sind nur nach Aktualisierung
> dieses Dokuments erlaubt (siehe *Änderungsprozess* am Ende).
>
> Abgeleitet aus dem tatsächlichen Code: `src/App.css`, `src/public.css` (Stand: aktueller `main`).
> Aktiver Default-Theme: **`udig2`**.

---

## 1. Grundprinzipien

1. **Tokens statt Hex.** Farben, Schatten und (künftig) Abstände werden ausschließlich über
   CSS-Variablen (`--c-*`, `--shadow-*`) referenziert. Kein hartkodierter Hex-Wert in Komponenten.
2. **Ein Theme als Kanon.** `udig2` ist der offizielle Look. Alle anderen `[data-theme]`-Blöcke
   sind experimentell und gelten als *deprecated* (siehe §9).
3. **Dunkler Hero, helle Seite.** Die Marke lebt vom Kontrast: heller Seitenhintergrund
   (`--c-bg`) mit dunklem Navy-Hero (`--c-primary`) und orangem Akzent (`--c-accent`).
4. **Zwei Schriften, klare Rollen.** `Space Grotesk` für Display/Headlines, `Inter` für alles andere.
5. **Zurückhaltung.** Ein Akzentton (Orange) pro Screen. Orange ist für Aktion/Fokus reserviert,
   nicht für Dekoration.

---

## 2. Farben (Design-Tokens)

Kanonische Palette = `[data-theme="udig2"]`. **Immer die Variable verwenden, nie den Hex-Wert.**

### Marken- & Akzentfarben

| Token | Wert | Verwendung |
|---|---|---|
| `--c-accent` | `#E8731A` | Primäre Aktion, CTA, Links, Hervorhebung im Headline-Wort |
| `--c-accent-hover` | `#D06515` | Hover-Zustand von Akzent-Elementen |
| `--c-accent-soft` | `#FDE8D3` | Akzent-Flächen, Tag-Hintergründe |
| `--c-accent-light` | `#FDF2E8` | Sehr helle Akzent-Sektionen |
| `--c-accent-glow` | `rgba(232,115,26,.12)` | Glow/Radial hinter dem Hero |

### Primär / Navy (dunkle Flächen, Hero)

| Token | Wert | Verwendung |
|---|---|---|
| `--c-primary` | `#0F2B3C` | Hero-Hintergrund, dunkle Sektionen, Footer |
| `--c-primary-light` | `#163A4F` | Karten/Abgrenzungen auf dunklem Grund |
| `--c-primary-dark` | `#0A1E2A` | Tiefster Navy-Ton, Verläufe |
| `--c-primary-soft` | `#E3EDF8` | Helle Info-/Prozessflächen |

### Neutrale Töne (heller Seiten-Body)

| Token | Wert | Verwendung |
|---|---|---|
| `--c-bg` | `#FFFFFF` | Standard-Seitenhintergrund |
| `--c-bg-alt` | `#F5F7FA` | Abwechselnde Sektionen |
| `--c-bg-section` | `#F0F2F5` | Betonte Content-Sektionen (z. B. Blog/News) |
| `--c-border` | `#E2E8F0` | Rahmen, Trennlinien, Karten-Border |
| `--c-white` | `#FFFFFF` | Text auf dunklem Grund, Karten |
| `--c-text` | `#1A1D23` | Fließtext / Headlines auf hellem Grund |
| `--c-text-muted` | `#4A5568` | Sekundärtext, Beschreibungen |
| `--c-text-light` | `#718096` | Meta-Infos, Datums-/Lesezeit-Angaben |

### Schatten

| Token | Wert |
|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,.05)` |
| `--shadow` | `0 4px 20px rgba(0,0,0,.06)` |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,.08)` |
| `--shadow-accent` | `0 8px 30px rgba(232,115,26,.2)` |

> ⛔ **Nicht verwenden** (Drift-Altlasten, sollen ersetzt werden): `#f97316`, `#2563eb`,
> `#4f46e5`, `#1a1a2e` und ähnliche in `public.css`. Diese sind **nicht** Teil des Systems.

---

## 3. Typografie

| Rolle | Font | Regel |
|---|---|---|
| Display / Headlines | `'Space Grotesk', sans-serif` | H1–H2, Hero-Titel |
| Body / UI | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Alles andere |
| Code / Mono | `'Courier New', monospace` | Nur Code-Snippets |

### Typskala (aus dem Code)

| Element | `font-size` | `font-weight` | `line-height` |
|---|---|---|---|
| Hero-H1 | `clamp(2.5rem, 6vw, 4rem)` | 800 | ~1.05 |
| Section-Title (H2) | `clamp(36px, 5vw, 60px)` | 700–800 | ~1.1 |
| Sub-Title (H3) | `clamp(1.25rem, 2.5vw, 1.75rem)` | 700 | ~1.3 |
| Body | `1rem` (16px) | 400–500 | 1.6 |
| Meta / Eyebrow | `0.8rem` | 700 | — |

**Eyebrow-Muster** (Kicker über Headlines): `0.8rem`, `font-weight:700`,
`letter-spacing:0.15em`, `text-transform:uppercase`, Farbe `--c-accent`.

---

## 4. Layout & Spacing

| Größe | Wert |
|---|---|
| Content-Breite (`.container`) | `max-width: 1200px`, zentriert, `padding: 0 2rem` |
| Sektions-Padding vertikal | `3rem–4rem` (48–64px) |
| Grid-Gap (Karten) | `2rem` (32px) |
| Karten-Grid | `repeat(auto-fill, minmax(320px, 1fr))` |

**Radius:** Karten `8px` · Buttons/Inputs `8–12px` · Pills/Tags `100px`.
**Transition-Standard:** `all 0.2s` (UI) bzw. `all 0.3s` (Karten/Hover-Effekte), `ease`.

> 🔧 *Empfehlung:* Spacing- und Radius-Tokens ergänzen (`--radius-sm/md/pill`,
> `--space-*`), da diese aktuell als Rohwerte im Code verstreut sind.

---

## 5. Komponenten

### Buttons

| Klasse | Aussehen | Einsatz |
|---|---|---|
| `.btn-primary` | Hintergrund `--c-accent`, weißer Text, Hover `--c-accent-hover` | Primäre Aktion pro View |
| `.btn-cta` | Größer, `padding: 1rem 2.5rem` | Haupt-CTA (Beratungsgespräch) |
| `.btn-secondary` | transparent, Rahmen; Hover `--c-accent-soft` | Sekundäre Aktion |
| `.nav-cta` | `padding: 10px 24px`, `radius: 10px`, `--c-accent` | CTA in der Navigation |
| `.nav-link` | `padding: 8px 16px`, `--c-text-muted`, Hover → `--c-text` | Navigationslinks |

**Regel:** Genau **ein** `.btn-primary`/`.btn-cta` pro Sichtbereich. Sekundäraktionen als `.btn-secondary`.

### Karten (Blog/News/Services)
Weißer Grund, `1px solid --c-border`, `radius: 8px`, Hover: Border → Akzent + `--shadow`
+ leichtes `translateY(-3px)`. Bild-Thumbnails `object-fit: cover`, Hover `scale(1.05)`.

### Tags / Pills
`radius: 100px`, `font-size: 0.8rem`, `font-weight: 700`. Kategorie-Farbe aus der Akzent-
oder Statuspalette; **soft-Variante** als Hintergrund (`--c-accent-soft` etc.).

---

## 6. Blog- & News-Bereiche (verbindliches Muster)

- **Blog:** Karten-Grid (`.blog-grid`), Karte = Thumbnail + Datum (`--c-text-light`) +
  H2 (`1.3rem`) + Excerpt (2 Zeilen, `-webkit-line-clamp: 2`, `--c-text-muted`).
- **News:** Datums-/Listenformat oder Sidebar-Feed; Kategorie-Pill + Kurztitel.
- Beide teilen sich Karten-, Tag- und Typo-Tokens — **kein eigenes Farbschema** pro Bereich.

---

## 7. Themes

- **Kanon:** `data-theme="udig2"` (in `App.jsx` als Default gesetzt).
- Theme-Wechsel geschieht über `document.documentElement.setAttribute('data-theme', ...)`.
- Neue Farben werden **als Override eines Tokens** im Theme-Block definiert, nie als
  Inline-Hex in Komponenten.

---

## 8. Verbindliche Regeln (Checkliste für Reviews)

- [ ] Keine hartkodierten Hex-/RGB-Werte in Komponenten — nur `var(--c-*)` / `var(--shadow-*)`.
- [ ] Nur `Inter` (Body) und `Space Grotesk` (Display); keine weiteren Fonts.
- [ ] Genau ein Primär-CTA pro Sichtbereich; Orange nur für Aktion/Fokus.
- [ ] Karten- und Button-Radien aus §4/§5, keine neuen Ad-hoc-Werte.
- [ ] Neue Farbe nötig? → Token in §2 ergänzen, **dann** verwenden.
- [ ] Blog/News nutzen die gemeinsamen Karten-/Typo-Tokens.
- [ ] Contrast-Check: Text auf Akzent/Navy erfüllt WCAG AA (≥ 4.5:1 für Fließtext).

---

## 9. Bekannte Drift-Altlasten (zu bereinigen)

Diese Punkte weichen heute vom System ab und sollen schrittweise angeglichen werden:

1. **~262 hartkodierte Hex-Werte** in `App.css` außerhalb der `--c-*`-Blöcke.
2. **`public.css` nutzt eine fremde Palette** (`#f97316`, `#2563eb`, `#1a1a2e`) statt der Tokens —
   Blog-/Seminar-Seiten auf `--c-*` umstellen.
3. **~20 experimentelle `[data-theme]`-Blöcke** (`aoe`, `neural`, `flow`, `coder`, …) —
   auf den Kanon `udig2` reduzieren oder klar als Preview kennzeichnen.

---

## 10. Änderungsprozess

1. Vorschlag in dieser Datei ergänzen/ändern (Token, Regel oder Komponente).
2. Im PR auf `DESIGN.md` verweisen; Reviewer prüft anhand der Checkliste (§8).
3. Erst nach Merge dieser Datei darf der abweichende Style in den Code.

*So bleibt das Design nachvollziehbar und künftige Änderungen weichen nicht unbemerkt vom Kanon ab.*

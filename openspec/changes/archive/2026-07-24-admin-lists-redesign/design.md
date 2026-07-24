# Design — Admin-Listen & Chrome

## Farb-Mapping (Handoff → Site-Token)
| Handoff | Verwendung | Site-Token |
|---|---|---|
| `#E5792B` | Primär/Akzent, aktives Nav, Hover-Fill normale Aktionen | `--c-accent` |
| `#D2621A` | Akzent dunkel (Hover) | `--c-accent-hover` |
| `#C0392B` | Danger (Löschen/Abmelden, Hover-Fill) | `--c-danger` |
| `#FCEDED` | Danger-Tint (Abmelden-Hover) | `--c-danger-light` |
| `#0E3446` | Sidebar-BG | `--c-primary` |
| `#F4F6F8` | Seiten-BG | `--c-bg-alt` |
| `#FFFFFF` | Karte/Header | `--c-white` |
| `#1C2B33` | Text primär | `--c-text` |
| `#5A6672` / `#7A8890` | Text sekundär | `--c-text-muted` / `--c-text-light` |
| `#8A96A0` | Labels/Slug/tertiär | `--c-text-light` |
| `#DCE1E5` | Button-Border neutral | `--c-border` |

**Status-Badges** haben keine passenden Site-Tokens → als Literale im Badge-CSS (semantische
Statusfarben): Veröffentlicht `#2E7D46` / BG `#DCF3E4`; Archiviert `#65737D` / BG `#EAEEF1`;
Entwurf neutral (`--c-text-muted` auf `--c-bg-alt`); Ausgeblendet gedämpft.

## `AdminLayout.jsx` + CSS
### Sidebar (Navbar)
- Hintergrund `var(--c-primary)`, heller Text; aktives Nav-Item: linker Akzentbalken (3–3.5px
  `var(--c-accent)`), Text im Akzentton, leicht getönter Hintergrund; inaktive Items gedämpft hell.
  (Bestehende `.admin-sidebar`/`.admin-nav-item`/`.active` restylen.)

### Header-User-Menü (ersetzt die statische `.user-info`)
- Trigger inline, rechtsbündig, **kein** Rahmen/Hintergrund im Ruhezustand: Avatar (Initialen aus
  `user.firstName/lastName`, Akzent-Gradient), Name (`--c-text`) + Rolle (`--c-text-light`),
  Chevron (dreht bei offen). Bei offen: leicht getönter Trigger-Hintergrund.
- Dropdown (`position:absolute`, rechtsbündig, ~290px, weiß, Rahmen `--c-border`, Radius 16px,
  Schatten): Kopf mit Avatar + Name + voller E-Mail; Einträge **Profil**, **Einstellungen**
  (Icon Akzent), Trenner, **Abmelden** (Danger, Hover `--c-danger-light`).
- Verhalten: State `userMenuOpen`; Toggle bei Klick; Schließen bei Menüpunkt-Klick, **Außenklick**
  (Ref + document-Listener) und **Escape**; `aria-haspopup="menu"`, `aria-expanded`,
  `role="menu"`/`menuitem`. Navigation: Profil/Einstellungen → jeweilige Admin-Route, Abmelden → `logout()`.

## `admin.css` — Listen (zentral, wirkt auf alle Tabellen)
- **Breite/Padding:** Content-Bereich und Header gleiches rechtes = linkes Padding (Handoff 44px →
  an bestehendes Admin-Spacing angepasst), sodass die Tabelle die volle Breite nutzt und rechts
  bündig mit dem User-Menü liegt.
- **Tabellen-Karte:** `.admin-table`/Wrapper: weiß, `1px solid var(--c-border)`, `border-radius:16px`,
  dezenter Schatten, `overflow:hidden`. Kopf-Labels `--c-text-light`, `letter-spacing`, uppercase.
  Zeilen mit ruhiger unterer Trennlinie; Titel `--c-text` fett; Slug monospace `--c-text-light`.
- **Status-Badges:** `.status-badge` Pill (`border-radius:999px`), Varianten `.published`/`.archived`/
  `.draft`/`.hidden` gem. Farbfestlegung oben.
- **Aktions-Buttons `.admin-table .actions .btn-sm`:** Ruhezustand neutral (`background:var(--c-white)`,
  `border:1px solid var(--c-border)`, `color:var(--c-text)`, Radius ~9px, Icon erbt `currentColor`).
  Hover **Solid-Fill**: normal `background/border:var(--c-accent)`, `color:#fff`; `.btn-sm.danger`
  Hover `background/border:var(--c-danger)`, `color:#fff`. Übergang `all .13s`.

## Media (`MediaLibrary`)
- **Breite** analog Tabellen: gleiche Content-Breite/Padding (bündige rechte Kante). `.media-library`
  Max-Breite/Padding an den restlichen Admin-Content angleichen.
- **Aktions-Buttons** im Detail-Panel (`.btn-navy` „Umbenennen", `.btn-delete` „Löschen") auf das
  gemeinsame Muster bringen (neutral → Hover-Fill Akzent bzw. Danger) bzw. konsistent zu den
  Listen-Buttons. Grid-Layout unverändert.

## Nicht angetastet
- Tabellen-Struktur (`<table>`) und Spalten je Liste; Nachrichten-Spalten bleiben.
- Funktionslogik der Listen.

## Why

Die Aktions-Buttons in der Dokumenten-/Ordnerliste (`/admin/portal/documents`) wirken zu klein und im Hover nur „getönt" (flau). Sie sollen einem etablierten Muster folgen: klar dimensionierte Icon-Buttons, die beim Hover in der Primärfarbe **gefüllt** werden (Icon weiß) — konsistent mit dem bereits vorhandenen Hover-Muster der Nutzerliste.

## What Changes

- **`ActionButton` neu gestaltet** (wird ausschließlich in der Dokumentenliste verwendet — kein App-weiter Effekt):
  - Größe **42×42px**, abgerundet (Radius 8), weißer Hintergrund, dezenter Rahmen (`--line`), gedämpftes Icon (`--ink-3`) im Ruhezustand.
  - **Hover/Fokus: Füllung in Primärfarbe** (`--orange`), Icon **weiß**; der **Lösch-Button** füllt stattdessen in der Gefahren-Farbe (`--danger`).
  - Icon etwas größer (~18px) passend zur Buttongröße; Tooltip/`aria-label` bleiben erhalten.
- **Alle Aktionen bleiben Icon-only** (keine Text-Variante) — passend zur dichten Aktionsspalte (bis zu 5 Aktionen/Zeile).
- **Layout: Dokumente-Seite füllt die Breite wie die Navbar.** `.portal-documents-v2` verliert die `max-width: 1200px`-Kappung (war links-ausgerichtet → warf den Überschuss rechts ab), und der Block-Gutter (`--gutter`) entfällt horizontal, sodass Titel/Toolbar/Liste an der 2rem-Basis von `.portal-content` liegen = **derselbe rechte Rand wie das User-Dropdown der Navbar (32px)**. Dadurch wird die Tabelle breiter und die 42px-Buttons bekommen Platz.

## Capabilities

### Modified Capabilities
- `portal-documents`: ergänzt eine Darstellungs-Anforderung für die Aktions-Buttons der Dokumenten-/Ordnerliste (Größe, Ruhezustand, Füll-Hover primär/gefahr, Barrierefreiheit).

## Impact

- **Frontend:** `src/main/frontend/src/components/ActionButton.jsx` (Inline-Styles) — Basis-/Hover-Styles angepasst; `src/main/frontend/src/portal.css` — `.portal-documents-v2` (max-width entfernt) und `--gutter` (horizontal 0). Kein weiterer Ort betroffen (`ActionButton` nur in `PortalDocuments.jsx`; `--gutter` nur von den `pd-`Blöcken genutzt; Mobile hat eigenen `0 16px`-Override).
- **Kein** Backend-/API-/Verhaltens-Change. Bestehende Tests nutzen `title`/`aria-label` → unverändert.

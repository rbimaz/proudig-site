## Why

Die Aktions-Buttons in der Dokumenten-/Ordnerliste (`/admin/portal/documents`) wirken zu klein und im Hover nur „getönt" (flau). Sie sollen einem etablierten Muster folgen: klar dimensionierte Icon-Buttons, die beim Hover in der Primärfarbe **gefüllt** werden (Icon weiß) — konsistent mit dem bereits vorhandenen Hover-Muster der Nutzerliste.

## What Changes

- **`ActionButton` neu gestaltet** (wird ausschließlich in der Dokumentenliste verwendet — kein App-weiter Effekt):
  - Größe **42×42px**, abgerundet (Radius 8), weißer Hintergrund, dezenter Rahmen (`--line`), gedämpftes Icon (`--ink-3`) im Ruhezustand.
  - **Hover/Fokus: Füllung in Primärfarbe** (`--orange`), Icon **weiß**; der **Lösch-Button** füllt stattdessen in der Gefahren-Farbe (`--danger`).
  - Icon etwas größer (~18px) passend zur Buttongröße; Tooltip/`aria-label` bleiben erhalten.
- **Alle Aktionen bleiben Icon-only** (keine Text-Variante) — passend zur dichten Aktionsspalte (bis zu 5 Aktionen/Zeile).

## Capabilities

### Modified Capabilities
- `portal-documents`: ergänzt eine Darstellungs-Anforderung für die Aktions-Buttons der Dokumenten-/Ordnerliste (Größe, Ruhezustand, Füll-Hover primär/gefahr, Barrierefreiheit).

## Impact

- **Frontend:** `src/main/frontend/src/components/ActionButton.jsx` (Inline-Styles) — Basis-/Hover-Styles angepasst. Kein weiterer Ort betroffen (Komponente nur in `PortalDocuments.jsx` genutzt).
- **Kein** Backend-/API-/Verhaltens-Change. Bestehende Tests nutzen `title`/`aria-label` → unverändert.

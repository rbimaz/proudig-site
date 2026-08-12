## Context

`components/ActionButton.jsx` (nur in `PortalDocuments.jsx` verwendet) rendert Icon-Buttons via Inline-Styles: 34×34, Radius 8, Rahmen `--line`, Icon `--ink-3` @16px; Hover **tönt** (Orange-Rahmen/-Text + `--orange-weak`-BG), Danger tönt rot. Farb-Variablen in `portal.css`: `--orange #E8731A`, `--danger #d65745`, `--line #e5eaed`, `--ink-3 #85959d`.

## Goals / Non-Goals

**Goals:** klar dimensionierte Icon-Buttons (42×42), Hover **füllt** in Primär-/Gefahr-Farbe (Icon weiß) — analog zum Hover-Muster der Nutzerliste.

**Non-Goals:** keine Text-Variante; keine Overflow-/Menü-Umbauten; keine Änderung an anderen Buttons/Komponenten; kein Backend.

## Decisions

- **Reines Inline-Style-Update in `ActionButton`.** Basis: 42×42, Radius 8, `--line`-Rahmen, weißer BG, `--ink-3`-Icon @~18px. Hover/Fokus (nicht disabled): `background`/`borderColor` = `--orange` (bzw. `--danger` bei `danger`), `color` = `#fff`. Disabled: reduzierte Deckkraft, kein Hover-Fill.
- **Icon-only bleibt** (Tooltip/`aria-label` unverändert) — dichte Aktionsspalte, kein Überlauf.

## Risks / Trade-offs

- **Nur visuell** → Verifikation über Build + bestehende Tests (nutzen `title`/`aria-label`, unberührt) + Sichtprüfung im Dev-App. Exakte Hover-Optik ist nicht sinnvoll unit-testbar (Inline-Styles).

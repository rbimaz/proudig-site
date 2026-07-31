## Why

Der Kopfbereich der Offering-Übersicht (`/offerings/:key`) zeigt aktuell einen
fest verdrahteten Text: Eyebrow „LEISTUNG" und einen Titel aus dem Frontend-
Config-Modul. Redaktion kann Titel, Untertitel oder einen Intro-Text pro Leistung
nicht ändern, ohne Code anzupassen. Für eigene Werbe-/Landing-Texte je Leistung
braucht es redaktionelle Kontrolle über den Kopf-/Intro-Bereich.

## What Changes

- Der Kopf-/Intro-Bereich von `/offerings/:key` wird optional aus einer **CMS-
  Index-Seite** gespeist: eine OFFERING-Seite, deren **Slug = Offering-Key** ist
  (z. B. Slug `consulting`).
- Genutzte Felder der Index-Seite: `title` → Überschrift, `excerpt` → Untertitel,
  optionaler `content` (Markdown) → Intro-Block über dem Grid (gerendert via
  `MarkdownContent`). Kein Cover in v1.
- Das automatische Grid darunter bleibt: veröffentlichte OFFERING-Beiträge mit dem
  Leistungs-Tag, wobei die Index-Seite selbst (Slug = Key) **ausgeschlossen** wird.
- **Fallback**: existiert keine veröffentlichte Index-Seite, bleibt der heutige
  Kopf (Config-Titel + Eyebrow „LEISTUNG"); der Empty-State fürs Grid bleibt
  unverändert.
- Redaktion legt die Index-Seite wie jede OFFERING-Seite an (muss PUBLISHED sein);
  die Slug-Konvention wird als Hinweis dokumentiert.

## Capabilities

### New Capabilities
<!-- Keine neue Capability. -->

### Modified Capabilities
- `offerings`: Ergänzt das Verhalten der Offering-Übersicht um einen optional
  CMS-gepflegten Kopf-/Intro-Bereich (Index-Seite per Slug = Key) mit Fallback auf
  die bisherige Config-basierte Darstellung; das automatische Grid schließt die
  Index-Seite aus.

## Impact

- Frontend: `OfferingOverviewPage` lädt zusätzlich `GET /api/offerings/{key}` für
  den Kopf und filtert die Index-Seite (Slug = Key) aus dem Grid.
- Keine Backend-/DB-Änderung (nutzt bestehende OFFERING-Struktur und
  `/api/offerings`).
- Baut auf `add-offering-content-type` auf (Offering-Typ, Übersicht, Config-Modul,
  `MarkdownContent`).

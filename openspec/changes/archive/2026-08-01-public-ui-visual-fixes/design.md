## Context

Drei unabhängige kosmetische Fehler auf öffentlichen Seiten, alle über `App.css`
lösbar, ohne Komponenten anzufassen.

## Goals / Non-Goals

**Goals:** Die drei visuellen Fehler chirurgisch beheben.

**Non-Goals:** Keine Layout-Refactorings, keine Änderung an Komponenten, keine
Theme-/Farbänderungen über das Nötige hinaus.

## Decisions

- **`.offering-intro`**: eigene Regel mit `background: rgb(240, 242, 245)` — exakter
  Literal-Wert wie `news-hero`/`news-list-section` (dort ist `var(--c-bg-alt)`
  auskommentiert).
- **`.btn-cta`**: Größen-Deklarationen auf die `nav-cta`-Werte setzen
  (`padding: 10px 24px; font-size: 14px; border-radius: 10px`). Nur Größe; Theme-
  Farbregeln (`[data-theme=…] .btn-cta`) bleiben.
- **`.hero-udig2-newsbox`**: `margin-left: auto`. Der Content ist per
  `max-width: 560px` gedeckelt, wodurch ~56px freier Flex-Raum rechts der News-Box
  liegt; `margin-left: auto` absorbiert ihn links und schiebt die Box an die
  Container-Kante. Im Mobile-Spaltenlayout (`width: 100%`) wirkungslos.
  - Alternative `justify-content: flex-end` am Layout — verworfen, würde auch den
    linken Content nach rechts schieben.

## Risks / Trade-offs

- Rein visuell, geringes Risiko. Absicherung per Sichtprüfung der drei Stellen.

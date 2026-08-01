## Why

Bei der Sichtprüfung der öffentlichen Seiten sind drei unabhängige, rein visuelle
Fehler aufgefallen, die das einheitliche Erscheinungsbild stören. Sie werden
gebündelt behoben (jeweils eine kleine CSS-Anpassung).

## What Changes

- **Offering-Intro-Hintergrund:** Die Sektion `.offering-intro` (Intro-Block der
  Offering-Übersicht) hat keinen Hintergrund und erscheint weiß zwischen den grauen
  Nachbar-Sektionen. Sie bekommt denselben Hintergrund wie `news-hero`
  (`rgb(240, 242, 245)`).
- **CTA-Button-Größe:** CTA-Buttons (`.btn-cta`, aus der Markdown-Button-Konvention)
  sind zu groß. Größe wird an den Navbar-Button `.nav-cta` angeglichen
  (`padding: 10px 24px; font-size: 14px; border-radius: 10px`).
- **News-Box-Ausrichtung:** Die Hero-News-Box (`.hero-udig2-newsbox`) ist nicht
  rechtsbündig, weil freier Flex-Raum rechts neben ihr liegt. Sie wird per
  `margin-left: auto` an die Container-Kante geschoben — gleiche rechte Bündigkeit
  wie der Navbar-Button.

## Capabilities

### New Capabilities
<!-- Keine. -->

### Modified Capabilities
- `offerings`: Intro-Block der Offering-Übersicht erhält den Hintergrund der
  Hero-Sektion.
- `content-cta-button`: CTA-Button-Größe entspricht dem Navbar-Button.
- `landing`: Hero-News-Box ist rechtsbündig an der Container-Kante.

## Impact

- Frontend: `App.css` (`.offering-intro`, `.btn-cta`, `.hero-udig2-newsbox`).
- Keine Änderung an Komponenten, Backend, API oder DB. Rein kosmetisch.

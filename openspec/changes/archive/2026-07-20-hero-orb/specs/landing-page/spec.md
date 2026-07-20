## ADDED Requirements

### Requirement: Hero-Orb auf der Landing Page
Der Hero der öffentlichen Landing Page (Theme `udig2`) SHALL rechts eine
leuchtende, schwebende Kugel-Grafik (Orb) als dekoratives Element zeigen. Die
Kugel SHALL absolut positioniert sein und den Textbereich überlappen dürfen,
wobei der Textbereich darüber liegt (höherer `z-index`). Die Kugel SHALL sanft
vertikal schweben (Auf-/Ab-Animation); bei `prefers-reduced-motion: reduce` SHALL
die Animation deaktiviert sein. Das Orb-Asset SHALL als Projekt-Asset ausgeliefert
werden (keine externe URL). Headline, Fließtext und Buttons des Hero SHALL
unverändert bleiben.

#### Scenario: Kugel wird im Hero angezeigt
- **WHEN** die Landing Page geladen wird
- **THEN** erscheint rechts im Hero die Orb-Grafik als überlappendes Deko-Element, während der Text darüber lesbar bleibt

#### Scenario: Schwebe-Animation
- **WHEN** die Kugel dargestellt wird und keine Reduced-Motion-Präferenz aktiv ist
- **THEN** bewegt sie sich sanft vertikal auf und ab

#### Scenario: Reduced Motion
- **WHEN** `prefers-reduced-motion: reduce` aktiv ist
- **THEN** ist die Schwebe-Animation deaktiviert

#### Scenario: Lokales Asset
- **WHEN** die Kugel geladen wird
- **THEN** stammt die Grafik aus einem Projekt-Asset (nicht aus einer externen URL)

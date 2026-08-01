## ADDED Requirements

### Requirement: Sticky-Footer-Layout der STATIC-Seite

Eine STATIC-Seite (impressum, datenschutz, `/seite/*`) SHALL den Footer bei wenig
Inhalt am unteren Rand des Viewports darstellen. Der Content-Bereich SHALL den
verfügbaren vertikalen Raum zwischen Navbar und Footer füllen, sodass der Footer
nicht in den leeren Bereich unter kurzem Inhalt hineinragt. Bei viel Inhalt SHALL
der Footer wie bisher unter dem Inhalt folgen (Seite scrollt).

#### Scenario: Wenig Inhalt

- **WHEN** ein Nutzer eine STATIC-Seite öffnet, deren Inhalt kürzer als der
  Viewport ist
- **THEN** steht der Footer am unteren Viewport-Rand, ohne leeren Bereich darunter

#### Scenario: Viel Inhalt

- **WHEN** der Inhalt einer STATIC-Seite höher als der Viewport ist
- **THEN** folgt der Footer unter dem Inhalt und ist durch Scrollen erreichbar

#### Scenario: Andere Seiten unberührt

- **WHEN** eine Nicht-STATIC-Seite gerendert wird
- **THEN** bleibt deren Layout unverändert

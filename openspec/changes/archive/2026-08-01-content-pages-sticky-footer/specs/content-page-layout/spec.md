## ADDED Requirements

### Requirement: Sticky-Footer der Content-Seiten

Öffentliche Content-Seiten mit gemeinsamem `.page`-Wrapper (Offering-Übersicht und
-Detail, News-Liste und -Detail, Blog-Liste und -Detail, Seminar-Liste und -Detail)
SHALL den Footer bei wenig Inhalt am unteren Rand des Viewports darstellen. Der
Bereich zwischen Seitenanfang und Footer SHALL den verfügbaren vertikalen Raum
füllen, sodass der Footer nicht in den leeren Bereich unter kurzem Inhalt hineinragt.
Bei viel Inhalt SHALL der Footer wie bisher unter dem Inhalt folgen.

#### Scenario: Übersicht ohne Beiträge

- **WHEN** ein Nutzer eine Offering-Übersicht ohne Beiträge öffnet (kurzer Inhalt,
  Empty-State)
- **THEN** steht der Footer am unteren Viewport-Rand, ohne leeren Bereich darunter

#### Scenario: Viel Inhalt

- **WHEN** der Inhalt einer Content-Seite höher als der Viewport ist
- **THEN** folgt der Footer unter dem Inhalt und ist durch Scrollen erreichbar

#### Scenario: Seiten ohne .page-Wrapper unberührt

- **WHEN** eine Seite ohne `.page`-Wrapper gerendert wird (z. B. Landing/HomePage)
- **THEN** bleibt deren Layout unverändert

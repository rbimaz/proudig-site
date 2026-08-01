## ADDED Requirements

### Requirement: Eingerückte Aufzählungen im STATIC-Inhalt

Der öffentliche STATIC-Renderer SHALL Aufzählungen (`ul` und `ol`) im
Markdown-Inhalt einer veröffentlichten STATIC-Seite eingerückt und mit
sichtbaren Aufzählungszeichen bzw. Nummerierungen darstellen. Die Darstellung
SHALL konsistent zu den Aufzählungen in Blog- und Seminar-Inhalten sein.

#### Scenario: Ungeordnete Liste eingerückt

- **WHEN** ein Nutzer eine veröffentlichte STATIC-Seite öffnet, deren Inhalt eine
  ungeordnete Liste (`- Punkt`) enthält
- **THEN** werden die Listeneinträge eingerückt und mit sichtbaren
  Aufzählungszeichen dargestellt und heben sich klar vom umgebenden Fließtext ab

#### Scenario: Geordnete Liste eingerückt

- **WHEN** ein Nutzer eine veröffentlichte STATIC-Seite öffnet, deren Inhalt eine
  geordnete Liste (`1. Punkt`) enthält
- **THEN** werden die Listeneinträge eingerückt und mit sichtbarer Nummerierung
  dargestellt

#### Scenario: Nur Darstellung, kein Vertrag geändert

- **WHEN** die Listen-Darstellung angepasst wird
- **THEN** bleiben Renderer-Logik, `/api/pages/{slug}`-Vertrag und Datenmodell
  unverändert; die Änderung betrifft ausschließlich das Frontend-Stylesheet
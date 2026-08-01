## MODIFIED Requirements

### Requirement: Klickbare Leistungs-Karten

Die Landing-Sektion „Unsere Leistungen" SHALL Karten haben, die **nur dann**
klickbar sind, wenn zur jeweiligen Leistung Inhalt vorhanden ist. Die fünf
Offering-Karten (Beratung, Studien, Vorträge, Software-Lösungen, KI-Anwendungen)
SHALL zur Offering-Übersicht ihres Leistungs-Tags (`/offerings/:key`) führen,
**wenn** es veröffentlichte Offerings mit diesem Tag gibt. Die Karte
Weiterbildung SHALL zur Seminar-Übersicht (`/seminare`) führen, **wenn**
veröffentlichte Seminare existieren.

Karten **ohne** vorhandenen Inhalt SHALL als nicht-interaktives Element
dargestellt werden: kein Link, keine Navigation und kein Klick-Affordance
(Cursor/Hover). Die Karte SHALL sichtbar bleiben (Titel/Beschreibung). Die
Kartentitel SHALL deutsch bleiben; die URL-Keys SHALL fest englisch sein.

#### Scenario: Klick auf Karte mit Inhalt

- **WHEN** ein Nutzer die Karte „Beratung" anklickt und es veröffentlichte
  Offerings mit Tag „Beratung" gibt
- **THEN** öffnet sich `/offerings/consulting` mit diesen Offerings

#### Scenario: Karte ohne Inhalt reagiert nicht

- **WHEN** ein Nutzer eine Leistungs-Karte anklickt, zu der es (noch) keinen
  veröffentlichten Inhalt gibt
- **THEN** erfolgt **keine** Navigation; es wird nicht zur leeren Übersicht
  geführt

#### Scenario: Weiterbildung inhaltsabhängig

- **WHEN** veröffentlichte Seminare existieren und die Karte „Weiterbildung"
  angeklickt wird
- **THEN** öffnet sich die Seminar-Übersicht `/seminare`; gibt es keine
  veröffentlichten Seminare, reagiert die Karte nicht

#### Scenario: Direktaufruf einer leeren Übersicht

- **WHEN** ein Nutzer eine Offering-Übersicht ohne Inhalt direkt per URL aufruft
- **THEN** wird weiterhin der Empty-State („Noch keine Beiträge …") angezeigt
  (Fallback bleibt erhalten)

## ADDED Requirements

### Requirement: CMS-gepflegter Kopfbereich der Offering-Übersicht

Die Offering-Übersicht (`/offerings/:key`) SHALL ihren Kopf-/Intro-Bereich aus
einer optionalen CMS-Index-Seite beziehen: einer veröffentlichten OFFERING-Seite,
deren Slug dem Offering-Key entspricht. Vorhanden, SHALL deren `title` als
Überschrift, `excerpt` als Untertitel und – falls gesetzt – `content` als
Markdown-Intro über dem Grid dargestellt werden (gerendert über den gemeinsamen
`MarkdownContent`-Renderer).

#### Scenario: Kopf aus Index-Seite

- **WHEN** ein Nutzer `/offerings/consulting` öffnet und eine veröffentlichte
  OFFERING-Seite mit Slug `consulting` existiert
- **THEN** zeigt der Kopfbereich deren Titel und Untertitel; ist ein Inhalt
  gepflegt, wird er als Markdown-Intro über dem Grid angezeigt

#### Scenario: Intro nur wenn Inhalt vorhanden

- **WHEN** die Index-Seite keinen `content` hat
- **THEN** wird kein Intro-Block gerendert (nur Titel/Untertitel)

### Requirement: Fallback ohne Index-Seite

Existiert keine veröffentlichte Index-Seite für den Key, SHALL die Übersicht den
bisherigen Kopf verwenden: den Titel aus der Offering-Config und den Eyebrow
„LEISTUNG". Das Grid-Verhalten (inkl. Empty-State) SHALL unverändert bleiben.

#### Scenario: Kein Index vorhanden

- **WHEN** ein Nutzer eine Offering-Übersicht öffnet, für deren Key es keine
  veröffentlichte Index-Seite gibt
- **THEN** zeigt der Kopf den Config-Titel und den Eyebrow „LEISTUNG" wie bisher

### Requirement: Index-Seite nicht im Grid

Das automatische Grid der Offering-Übersicht SHALL die Index-Seite (Slug = Key)
NICHT als Karte anzeigen, auch wenn sie mit dem Leistungs-Tag versehen ist.

#### Scenario: Index-Seite wird aus dem Grid ausgeschlossen

- **WHEN** die Index-Seite mit dem Leistungs-Tag getaggt ist und veröffentlicht
  wurde
- **THEN** erscheint sie nicht als Karte im Grid der zugehörigen Übersicht

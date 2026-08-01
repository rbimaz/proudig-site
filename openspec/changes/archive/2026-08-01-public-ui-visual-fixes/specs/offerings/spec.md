## ADDED Requirements

### Requirement: Hintergrund des Intro-Blocks

Der Intro-Block der Offering-Übersicht (`.offering-intro`, gerendert wenn die
Index-Seite `content` hat) SHALL denselben Hintergrund wie die Hero-Sektion
(`news-hero`) verwenden, damit kein weißes Band zwischen Hero und Karten-Grid
entsteht.

#### Scenario: Intro nahtlos zwischen Hero und Grid

- **WHEN** eine Offering-Übersicht mit gepflegtem Intro-Inhalt angezeigt wird
- **THEN** hat der Intro-Block denselben Hintergrund wie Hero und Karten-Bereich
  (kein weißer Block dazwischen)

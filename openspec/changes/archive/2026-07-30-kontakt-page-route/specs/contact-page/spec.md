## ADDED Requirements

### Requirement: Eigenständige Kontaktseite unter /kontakt

Die App SHALL unter der Route `/kontakt` eine eigenständige Kontaktseite
rendern, die aus Navbar, dem bestehenden Kontaktformular und Footer besteht.
Die Seite SHALL wie andere Nicht-Landing-Seiten gerahmt sein (kein Landing-
spezifisches Layout).

#### Scenario: Kontaktseite direkt aufrufen

- **WHEN** ein Nutzer die URL `/kontakt` öffnet
- **THEN** wird eine Seite mit Navbar, dem Kontaktformular und Footer angezeigt

#### Scenario: Kontaktseite beginnt oben

- **WHEN** die Kontaktseite geladen wird
- **THEN** ist der Seitenanfang sichtbar (kein automatisches Scrollen mitten in
  eine Sektion)

### Requirement: Wiederverwendung des bestehenden Kontaktformulars

Die Kontaktseite SHALL dieselbe `Contact`-Komponente verwenden wie die Landing-
Sektion, ohne die Formular-Logik zu duplizieren. Das Formular SHALL weiterhin an
`/api/contact` senden und dieselben Erfolgs-/Fehlerzustände zeigen.

#### Scenario: Formular auf der Kontaktseite absenden

- **WHEN** ein Nutzer das Formular auf `/kontakt` ausfüllt und absendet
- **THEN** wird die Anfrage an `/api/contact` gesendet und der Erfolgs- bzw.
  Fehlerzustand wie in der Landing-Sektion angezeigt

### Requirement: Landing behält Kontakt-Sektion

Die Landing-Page SHALL die Kontakt-Sektion (`id="kontakt"`) unverändert
beibehalten. Der bestehende Scroll-Weg der Navbar auf `/` SHALL weiterhin
funktionieren.

#### Scenario: Landing-Kontakt-Sektion unverändert erreichbar

- **WHEN** ein Nutzer auf der Startseite `/` in der Navbar „Kontakt" wählt
- **THEN** scrollt die Seite wie bisher zur Kontakt-Sektion (`id="kontakt"`)

### Requirement: CTA-Button erreicht die Kontaktseite

Ein CMS-CTA-Button mit Ziel `/kontakt` SHALL die Kontaktseite über clientseitige
Navigation öffnen (kein Full-Page-Reload, kein 404).

#### Scenario: CTA-Button aus einem Content-Beitrag

- **WHEN** ein Nutzer in einem News-/Blog-/Seminar-/Seiten-Inhalt einen CTA-
  Button `[Beratungsgespräch](/kontakt "button")` anklickt
- **THEN** öffnet sich die Kontaktseite unter `/kontakt` per clientseitiger
  Navigation

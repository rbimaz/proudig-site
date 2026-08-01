## ADDED Requirements

### Requirement: „Über Proudig" verlinkt auf die CMS-Seite

Der Navigations-Eintrag „Über Proudig" SHALL sowohl im Desktop- als auch im
Mobil-Menü der Navbar auf die Seite `/seite/ueber-proudig` navigieren (clientseitig
per Router), statt zum Landing-Anker `#ueber` zu scrollen.

#### Scenario: Klick im Desktop-Menü

- **WHEN** ein Nutzer im Desktop-Navbar auf „Über Proudig" klickt
- **THEN** navigiert die App auf `/seite/ueber-proudig`

#### Scenario: Klick im Mobil-Menü

- **WHEN** ein Nutzer im geöffneten Mobil-Menü auf „Über Proudig" tippt
- **THEN** navigiert die App auf `/seite/ueber-proudig` und das Mobil-Menü schließt

### Requirement: Footer-Link „Über Proudig"

Der Footer SHALL einen Link „Über Proudig" enthalten, der auf `/seite/ueber-proudig`
navigiert.

#### Scenario: Footer-Link vorhanden

- **WHEN** ein Nutzer den Footer betrachtet
- **THEN** ist ein Link „Über Proudig" sichtbar, der auf `/seite/ueber-proudig` führt

## Why

Der Kontakt ist bisher nur eine Sektion (`id="kontakt"`) auf der Landing-Page
und über keine eigene URL erreichbar. CMS-CTA-Buttons aus anderen Routen (News,
Blog, Seminare, statische Seiten) können den Kontakt daher nicht sauber ansteuern:
Ein Link auf `/kontakt` läuft ins Leere (keine Route), und ein Hash-Link
`/#kontakt` landet nur auf der Homepage, ohne zur Sektion zu scrollen (kein
Hash-Handling). Der Kontakt ist der Conversion-Endpunkt und braucht eine echte,
verlinkbare Adresse.

## What Changes

- Neue Route **`/kontakt`**, die eine eigenständige Kontaktseite rendert
  (Navbar + bestehendes `Contact`-Formular + Footer).
- Die bestehende, self-contained `Contact`-Komponente wird wiederverwendet —
  keine Duplizierung der Formular-Logik (postet weiterhin an `/api/contact`).
- Die Landing-Page behält `Contact` unverändert als Abschluss-Sektion; der
  Scroll-Weg der Navbar auf `/` bleibt bestehen.
- CMS-CTA-Buttons erreichen den Kontakt über `[Beschriftung](/kontakt "button")`
  — funktioniert mit dem bestehenden `MarkdownContent`-Renderer ohne Änderung
  (interner Router-Link).

## Capabilities

### New Capabilities
- `contact-page`: Eigenständige Kontaktseite unter der Route `/kontakt`, die das
  bestehende Kontaktformular als vollwertige Seite mit Navbar und Footer
  darstellt und aus beliebigen Inhalten per interner Navigation erreichbar ist.

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. Die Landing-Sektion
     Kontakt und der MarkdownContent-Renderer bleiben unverändert; die neue Route
     ist additiv. -->

## Impact

- Frontend-Routing: `App.jsx` (neue Route `/kontakt`; ggf. `isStaticPage`-artige
  Layout-Behandlung prüfen, damit die Seite wie andere Nicht-Landing-Seiten
  gerahmt wird).
- Neue Komponente `ContactPage` (Wrapper um `Contact`), die `Contact.jsx`
  wiederverwendet.
- Keine Backend-/DB-Änderung; `/api/contact` bleibt unverändert.
- Baut auf dem Change `cms-markdown-cta-button` auf (CTA-Button-Konvention und
  interne Router-Navigation existieren bereits).
- Optional/Folge (nicht Teil dieses Changes): Navbar aus Nicht-Landing-Routen auf
  `/kontakt` statt `navigate('/')`+Scroll umstellen, um den 100-ms-Hack abzulösen.

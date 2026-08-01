## ADDED Requirements

### Requirement: CTA-Button-Größe entspricht dem Navbar-Button

Der CTA-Button (`.btn-cta`, erzeugt über die Markdown-Button-Konvention) SHALL in
seiner Größe dem Navbar-Button (`.nav-cta`) entsprechen (gleiches Padding und
Schriftgröße), damit er nicht überdimensioniert wirkt.

#### Scenario: CTA-Button so groß wie Navbar-Button

- **WHEN** ein CTA-Button in gerendertem Markdown-Inhalt angezeigt wird
- **THEN** hat er dieselbe Größe (Padding, Schriftgröße) wie der Navbar-Button

## ADDED Requirements

### Requirement: Launch-Umschalter in der Admin-Einstellungsseite

Die Admin-Einstellungsseite SHALL einen Umschalter „Website live schalten"
bereitstellen, der die persistente Einstellung `site.launched` liest und setzt. Der
Umschalter SHALL reversibel sein (Site wieder auf „Coming Soon" schalten) und wie
alle Systemeinstellungen ausschließlich der Rolle `ADMIN` zugänglich sein.

#### Scenario: Site über die Einstellungen live schalten

- **WHEN** ein ADMIN den Umschalter aktiviert und speichert
- **THEN** wird `site.launched = true` persistiert und die Website ist ohne
  „Coming Soon"-Sperre öffentlich erreichbar

#### Scenario: Launch zurücknehmen

- **WHEN** ein ADMIN den Umschalter deaktiviert und speichert
- **THEN** wird `site.launched = false` persistiert und die „Coming Soon"-Sperre
  gilt wieder (Preview-Zugang ausgenommen)

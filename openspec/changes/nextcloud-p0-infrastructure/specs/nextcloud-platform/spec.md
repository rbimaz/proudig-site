## ADDED Requirements

### Requirement: NextCloud-Dienste im Compose-Stack

Der Compose-Stack SHALL NextCloud selbst-gehostet bereitstellen: einen
`nextcloud`-Dienst (Apache/PHP-FPM), eine eigene `nextcloud-db` (PostgreSQL), einen
`nextcloud-redis` für Locking/Cache und einen `nextcloud-cron` für Background-Jobs.
Alle SHALL im bestehenden `proudig-network` liegen und NextCloud-Daten sowie die DB
SHALL in persistenten, benannten Volumes gespeichert werden.

#### Scenario: NextCloud-Stack läuft

- **WHEN** der Compose-Stack gestartet wird
- **THEN** sind `nextcloud`, `nextcloud-db`, `nextcloud-redis` und `nextcloud-cron`
  aktiv und NextCloud-Daten/DB liegen auf persistenten Volumes

### Requirement: Keycloak als Identity-Provider im Compose-Stack

Der Compose-Stack SHALL Keycloak als OIDC-Identity-Provider bereitstellen: einen
`keycloak`-Dienst mit eigener `keycloak-db` (PostgreSQL), im `proudig-network`, mit
persistenter DB.

#### Scenario: Keycloak-Stack läuft

- **WHEN** der Compose-Stack gestartet wird
- **THEN** ist `keycloak` mit eigener persistenter Datenbank aktiv

### Requirement: Caddy-Subdomain-Routing für NextCloud und Keycloak

Caddy SHALL NextCloud unter `files.proudig.ai` und Keycloak unter `auth.proudig.ai`
per Reverse Proxy mit automatischem HTTPS ausliefern. Die für NextCloud/Keycloak
nötigen gelockerten Frame-/CSP-Header SHALL nur auf deren eigenen Subdomains gelten;
der bestehende `proudig.ai`-Block der App SHALL mit strikter CSP und
`X-Frame-Options: DENY` unverändert bleiben.

#### Scenario: Dienste über Subdomains erreichbar

- **WHEN** ein Client `https://files.proudig.ai` bzw. `https://auth.proudig.ai`
  aufruft
- **THEN** liefert Caddy NextCloud bzw. Keycloak per HTTPS aus, ohne die
  Security-Header der App-Domain zu verändern

### Requirement: Konfiguration ohne Secrets im Repo

Zugangsdaten und instanzspezifische Werte (DB-Passwörter, Keycloak-Admin,
NextCloud-Trusted-Domains) SHALL über Environment/`.env` bereitgestellt werden; es
SHALL keine Secrets im Repository eingecheckt werden.

#### Scenario: Secrets aus der Umgebung

- **WHEN** der Stack konfiguriert wird
- **THEN** stammen Passwörter/Trusted-Domains aus Environment/`.env` und nicht aus
  eingecheckten Dateien

## Why

Das Konzept `docs/nextcloud-einfuehrung-konzept.md` führt NextCloud (Dokumententeil)
und Keycloak (zentrales SSO) selbst-gehostet ein — ein 6-Phasen-Programm (P0–P5).
Dieser Change deckt **ausschließlich P0 (Infrastruktur)** ab: die neuen Dienste im
bestehenden Docker-/Caddy-Setup lauffähig und über eigene Subdomains erreichbar
machen. Er ist der risikoärmste erste Schritt und **unabhängig** von Auth-Umbau
(P1) und Rückbau des Dokumenten-Moduls (P5).

## What Changes

- **docker-compose**: neue Dienste im `proudig-network`:
  - `keycloak` + `keycloak-db` (PostgreSQL) — Identity-Provider.
  - `nextcloud` + `nextcloud-db` (PostgreSQL) + `nextcloud-redis` (Locking/Cache)
    + `nextcloud-cron` (Background-Jobs) — Dateien/Ordner/Freigaben.
  - Je eigene benannte Volumes für DB- und NextCloud-Daten (Persistenz/Backup).
- **Caddy**: zwei neue Subdomain-Blöcke — `files.proudig.ai` → `nextcloud`,
  `auth.proudig.ai` → `keycloak` (automatisches HTTPS). NextCloud/Keycloak
  benötigen gelockerte Frame-/CSP-Header **nur auf ihren eigenen Subdomains**; der
  `proudig.ai`-Block (App) bleibt mit strikter CSP/`X-Frame-Options: DENY`
  unverändert.
- **Konfiguration** über Environment/`.env` (Secrets, Trusted Domains); keine
  Secrets im Repo.

## Capabilities

### New Capabilities
- `nextcloud-platform`: Selbst-gehostete Betriebs-Infrastruktur für NextCloud und
  Keycloak (Compose-Dienste, Persistenz, Caddy-Subdomain-Routing). P0 stellt die
  Erreichbarkeit her; Realm/Clients/Sharing/Migration folgen in P1–P5.

### Modified Capabilities
<!-- Keine. P0 ändert weder App-Code noch bestehende Auth-/Dokumenten-Capabilities. -->

## Impact

- Repo: `docker-compose.yml` (neue Dienste + Volumes), `deploy/Caddyfile` (zwei
  Subdomain-Blöcke), ggf. `.env.example`/README-Hinweise. Keine Änderung an
  App-Code, `pom.xml`, DB-Schema oder bestehenden Endpunkten.
- Betrieb: zusätzliche Container (Speicher/RAM), zwei DNS-Einträge (`files.`,
  `auth.`), zusätzliche Backups (nextcloud-/keycloak-DB + NextCloud-Daten).
- Abgrenzung: **kein** SSO/OIDC-Umbau (P1), **kein** Sharing/Provisioning (P2/P3),
  **kein** Rückbau (P5). Offene Entscheidungen aus Konzept-Abschnitt 12 bleiben in
  diesem Change bewusst offen (siehe design.md → Open Questions).

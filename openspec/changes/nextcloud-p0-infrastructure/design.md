## Context

Bestehendes Setup: `docker-compose.yml` mit `proudig-db`, `proudig-app`,
`proudig-proxy` (Caddy) im `proudig-network`; `deploy/Caddyfile` mit einem
`proudig.ai`-Block (strikte CSP, `X-Frame-Options: DENY`). Keine OIDC-Deps in der
App. Konzept: `docs/nextcloud-einfuehrung-konzept.md` (P0 = Infrastruktur).

## Goals / Non-Goals

**Goals:**
- NextCloud + Keycloak (je eigene DB, Redis/Cron für NextCloud) im Compose-Stack.
- Erreichbarkeit über `files.` / `auth.`-Subdomains hinter Caddy (HTTPS).
- Persistenz und Backup-Fähigkeit (eigene Volumes je Dienst).

**Non-Goals (spätere Phasen):**
- Kein OIDC/SSO-Umbau der App (P1).
- Kein Realm/Client/Gruppen-Setup, kein Ordner-Sharing, kein Provisioning (P2/P3).
- Keine Datenmigration (P4), kein Rückbau des Dokumenten-Moduls (P5).
- Keine Änderung an App-Code, `pom.xml`, DB-Schema, bestehenden Endpunkten.

## Decisions

- **Ein Compose-File, additive Dienste.** Neue Services im bestehenden
  `proudig-network`, damit App/Caddy sie über Servicenamen erreichen. Keine neuen
  Host-Ports nötig (Caddy proxyt intern).
- **Subdomains statt iframe.** Die App-CSP verbietet Frames (`X-Frame-Options:
  DENY`); NextCloud/Keycloak laufen daher auf eigenen Subdomains mit eigenen
  Header-Blöcken. Der App-Block bleibt unberührt.
- **Lokales Volume als P0-Speicher.** Minimal nötig, um NextCloud erreichbar zu
  machen; S3-kompatibles Backend bleibt offen (siehe Open Questions).
- **Secrets über `.env`.** Nur `.env.example` mit Platzhaltern im Repo.

## Risks / Trade-offs

- Mehr Betrieb (Container, RAM, Updates, Backups) → Ressourcenlimits/Healthchecks
  analog zu den bestehenden Diensten setzen.
- Nicht in dieser Umgebung end-to-end verifizierbar (externe Domains/DNS/Server) →
  Abnahme über Deploy auf dem DE/EU-Server, nicht über die Test-Suite.
- Reihenfolge-/Init-Abhängigkeiten (DB healthy vor App-Diensten) → `depends_on`
  mit Healthchecks.

## Open Questions

Bewusst offen (Konzept Abschnitt 12) — NICHT in P0 entschieden:
- **Storage-Backend**: lokales Volume (P0-Baseline) vs. S3-kompatibel später.
- **Provisioning** (Keycloak Admin-API vs. manuell) — betrifft P1/P3.
- **Feature-Umfang** NextCloud (Sharing/Versionierung/Audit; Talk/Kalender aus?) —
  betrifft P2.
- **Nutzerverwaltungs-UI** (dünne Portal-UI vs. Keycloak-Console) — betrifft P1.
- **Mandanten-Isolation** (getrennte Ordner vs. separate Instanzen) — betrifft P3.

## Migration Plan

- Rein additiv; keine Datenmigration, kein Rückbau in P0. Rollback = neue Dienste
  stoppen/entfernen; bestehende App/DB/Caddy unberührt.

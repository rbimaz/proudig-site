# ProuDig Deployment

Docker-basiertes Deployment mit Caddy Reverse Proxy und automatischem HTTPS.

## Schnellstart

Deploy läuft über **Ansible** (Secrets via Ansible Vault):

```bash
cd deploy/ansible
ansible-playbook -i inventory.yml playbook.yml --tags deploy
```

`deploy.sh` ist nur noch **Ops-Wrapper** (Betrieb), kein Deploy mehr.

## Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `ansible-playbook … --tags deploy` | Deployment (Build + Start), Secrets aus Vault |
| `ansible-playbook … --tags setup` | Server-Setup (Docker installieren) |
| `ansible-playbook … --tags rollback` | Vorheriges Image wiederherstellen |
| `./deploy.sh proudig --restart` | Container neustarten |
| `./deploy.sh proudig --status` | Status pruefen |
| `./deploy.sh proudig --logs` | Live-Logs anzeigen |
| `./deploy.sh proudig --backup` | Datenbank-Backup herunterladen |

### Secrets (Ansible Vault)

Secrets liegen verschlüsselt in `deploy/ansible/group_vars/all/vault.yml`; die
Server-`.env` wird bei jedem Deploy daraus gerendert. Das Vault-Passwort kommt
aus einer gitignored Datei (`~/.proudig-vault-pass`, referenziert in
`deploy/ansible/ansible.cfg`).

> **DB-Parität:** `vault_db_password` muss exakt dem Wert entsprechen, mit dem
> die laufende `proudig-db` initialisiert wurde (PostgreSQL setzt
> `POSTGRES_PASSWORD` nur beim Erst-Init). Aktuellen Wert vor dem ersten
> Ansible-Deploy übernehmen: `ssh proudig 'cat /opt/proudig/.env'`.
>
> **DR:** Die Vault-Passwortdatei extern sichern (Passwortmanager) — ohne sie
> sind die Secrets nicht mehr entschlüsselbar.

Vault anlegen (einmalig): siehe `group_vars/all/vault.yml.example`.

**Erst-Umstellung auf Ansible + Vault:** Vollständiges Server-Runbook (Secrets
auslesen, Vault anlegen, Trockenlauf, Cutover, Verifikation, Rollback) in
[`ansible/CUTOVER.md`](ansible/CUTOVER.md).

## Architektur

### Phase 1: IP-basierter HTTP-Zugriff

```
http://<server-ip>/
        │
        ▼ Port 80
┌──────────┐       ┌──────────────┐       ┌────────────┐
│  Caddy   │──────▶│  Spring Boot │──────▶│ PostgreSQL │
│  Proxy   │ :8081 │  + React SPA │ :5432 │     14     │
└──────────┘       └──────────────┘       └────────────┘
proudig-proxy       proudig-app            proudig-db
```

### Phase 2: Domain-basierter HTTPS-Zugriff

```
https://proudig.de/
https://www.proudig.de/
        │
        ▼ Port 443 (TLS)
┌──────────────────┐       ┌──────────────┐       ┌────────────┐
│      Caddy       │──────▶│  Spring Boot │──────▶│ PostgreSQL │
│  + Let's Encrypt │ :8081 │  + React SPA │ :5432 │     14     │
└──────────────────┘       └──────────────┘       └────────────┘
   proudig-proxy            proudig-app            proudig-db
```

Alle drei laufen als Docker-Container im selben Netzwerk.

## Umschaltung von Phase 1 auf Phase 2

### 1. DNS konfigurieren

Beim Domain-Registrar A-Records anlegen:
- `proudig.de` → `<Server-IP>`
- `www.proudig.de` → `<Server-IP>`

### 2. Caddyfile anpassen

In `deploy/Caddyfile`:
- Phase 1 Block (`:80 { ... }`) auskommentieren
- Phase 2 Block (`proudig.de, www.proudig.de { ... }`) einkommentieren

### 3. docker-compose.yml anpassen

Port 443 einkommentieren:
```yaml
ports:
  - "80:80"
  - "443:443"        # Diese Zeile einkommentieren
```

### 4. Container neu starten

```bash
./deploy.sh proudig --restart
# oder auf dem Server:
docker compose up -d proudig-proxy
```

Caddy holt automatisch Let's Encrypt Zertifikate.

## Vorschau-Passwort

Standard: `proudig2026` — aenderbar in `/opt/proudig/.env` auf dem Server.

## Persistente Daten

| Volume | Inhalt |
|--------|--------|
| `proudig-pgdata` | PostgreSQL Datenbank |
| `keycloak-db-data` | Keycloak-Datenbank |
| `nextcloud-db-data` | NextCloud-Datenbank |
| `nextcloud-redis-data` | NextCloud Redis (Locking/Cache) |
| `nextcloud-data` | NextCloud-Anwendung + hochgeladene Dateien |
| `caddy_data` | Let's Encrypt Zertifikate |
| `caddy_config` | Caddy Konfiguration |
| `./data/files` | Hochgeladene Dokumente (Portal) |

## NextCloud + Keycloak (Subdomains)

Zusätzliche Dienste im selben Compose-Stack, erreichbar über eigene Subdomains
hinter Caddy (TLS automatisch via Let's Encrypt):

- `https://files.proudig.ai` → NextCloud (Dateiablage)
- `https://auth.proudig.ai` → Keycloak (Identity Provider)

### 1. DNS

A-Records beim Registrar auf die Server-IP zeigen lassen:
- `files.proudig.ai` → `<Server-IP>`
- `auth.proudig.ai` → `<Server-IP>`

### 2. Secrets

Die neuen Dienste brauchen Pflicht-Passwörter (`KEYCLOAK_DB_PASSWORD`,
`KEYCLOAK_ADMIN_PASSWORD`, `NEXTCLOUD_DB_PASSWORD`, `NEXTCLOUD_REDIS_PASSWORD`,
`NEXTCLOUD_ADMIN_PASSWORD`); ohne sie bricht `docker compose up` ab (`:?`-Guards).

Diese Secrets liegen im **Ansible Vault** (`deploy/ansible/group_vars/all/vault.yml`,
starke Zufallswerte) und werden beim Deploy in `/opt/proudig/.env` gerendert —
zusammen mit den Portal-Secrets (siehe Abschnitt „Secrets (Ansible Vault)" oben
und `deploy/ansible/CUTOVER.md`). Kein manuelles Passwort-Management, keine
Server-Generierung.

NextCloud-/Keycloak-Admin-Passwort bei Bedarf aus dem Vault lesen:

```bash
ansible-vault view deploy/ansible/group_vars/all/vault.yml
```

### 3. Start

Der Stack startet über den regulären Ansible-Deploy (rendert `.env` aus dem
Vault und führt `docker compose up -d` aus):

```bash
cd deploy/ansible
ansible-playbook -i inventory.yml playbook.yml --tags deploy
```

### 4. Backup

Zusätzlich zur Portal-DB sichern:
```bash
# NextCloud-Dateien + DB
docker compose exec nextcloud-db pg_dump -U nextcloud nextcloud > nextcloud-db.sql
docker run --rm -v nextcloud-data:/data -v "$PWD":/backup alpine \
  tar czf /backup/nextcloud-data.tgz -C /data .
# Keycloak-DB (Realm-/Nutzerdaten)
docker compose exec keycloak-db pg_dump -U keycloak keycloak > keycloak-db.sql
```

## Ausfuehrliche Anleitung

Siehe [ansible/readme-deployment-docker.md](ansible/readme-deployment-docker.md) fuer die vollstaendige Schritt-fuer-Schritt-Anleitung.

# ProuDig Deployment

Docker-basiertes Deployment mit Caddy Reverse Proxy und automatischem HTTPS.

## Schnellstart

```bash
# SSH-Host in ~/.ssh/config einrichten, dann:
./deploy.sh proudig
```

## Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `./deploy.sh proudig` | Voll-Deployment (Docker Build + Start) |
| `./deploy.sh proudig --setup` | Nur Server-Setup (Docker installieren) |
| `./deploy.sh proudig --restart` | Container neustarten |
| `./deploy.sh proudig --status` | Status pruefen |
| `./deploy.sh proudig --logs` | Live-Logs anzeigen |
| `./deploy.sh proudig --rollback` | Vorheriges Image wiederherstellen |
| `./deploy.sh proudig --backup` | Datenbank-Backup herunterladen |

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
| `caddy_data` | Let's Encrypt Zertifikate |
| `caddy_config` | Caddy Konfiguration |
| `./data/files` | Hochgeladene Dokumente |

## Ausfuehrliche Anleitung

Siehe [ansible/readme-deployment-docker.md](ansible/readme-deployment-docker.md) fuer die vollstaendige Schritt-fuer-Schritt-Anleitung.

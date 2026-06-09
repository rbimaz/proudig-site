# ProuDig Deployment

Docker-basiertes Deployment mit Apache Reverse Proxy.

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

```
Port 80 (HTTP)
    │
    ▼
┌──────────┐       ┌──────────────┐       ┌────────────┐
│  Apache   │──────▶│  Spring Boot │──────▶│ PostgreSQL │
│  (httpd)  │ :8081 │  + React SPA │ :5432 │     14     │
└──────────┘       └──────────────┘       └────────────┘
  proudig-web        proudig-app            proudig-db
```

Alle drei laufen als Docker-Container im selben Netzwerk.

## Vorschau-Passwort

Standard: `proudig2026` — aenderbar in `/opt/proudig/.env` auf dem Server.

## Ausfuehrliche Anleitung

Siehe [ansible/DEPLOYMENT.md](ansible/DEPLOYMENT.md) fuer die vollstaendige Schritt-fuer-Schritt-Anleitung inkl. Ansible-Variante und SSL-Setup.

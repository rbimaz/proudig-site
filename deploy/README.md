# ProuDig Deployment

## Voraussetzungen

### Lokal (Entwicklungsrechner)
- Bash-Shell (macOS / Linux / WSL)
- SSH-Zugang zum Server (konfiguriert in `~/.ssh/config`)

### Server
- Linux (Ubuntu/Debian empfohlen)
- SSH-Zugang mit Root-Rechten
- Docker wird automatisch installiert, falls nicht vorhanden

## SSH-Konfiguration

Der Server muss in `~/.ssh/config` eingetragen sein:

```
Host proudig-server
    HostName <IP-Adresse>
    User root
    IdentityFile ~/.ssh/id_rsa
```

> Den Host-Namen (`proudig-server`) kannst du frei wählen.

## Deployment durchführen

```bash
cd deploy/
./deploy.sh proudig-server
```

Das Skript führt automatisch folgende Schritte aus:

1. **Docker prüfen** — Installiert Docker + Compose auf dem Server, falls nötig
2. **Dateien übertragen** — Packt das Projekt und überträgt es per SCP
3. **Docker Build & Start** — Baut das Docker-Image (Java 21 + Maven + Node) und startet die Container
4. **Status prüfen** — Zeigt den Container-Status und die URL an

## Architektur

```
Port 80 (HTTP)
    │
    ▼
┌──────────┐       ┌──────────────┐
│  Apache   │──────▶│  Spring Boot │
│  (httpd)  │ :8081 │  + React SPA │
└──────────┘       └──────────────┘
  Container:         Container:
  proudig-web        proudig-app
```

## Passwort ändern

Die Website zeigt eine "Coming Soon"-Seite. Das Vorschau-Passwort kann über eine Umgebungsvariable geändert werden:

```bash
# In docker-compose.yml oder als .env-Datei:
PREVIEW_PASSWORD=mein-neues-passwort
```

Standard-Passwort: `proudig2026`

## Nützliche Befehle

```bash
# Logs anzeigen
ssh proudig-server "docker compose -f /opt/proudig/docker-compose.yml logs -f"

# Container neu starten
ssh proudig-server "docker compose -f /opt/proudig/docker-compose.yml restart"

# Container stoppen
ssh proudig-server "docker compose -f /opt/proudig/docker-compose.yml down"

# Nur App neu bauen (nach Code-Änderung)
./deploy.sh proudig-server
```

## HTTPS (nach Domain-Registrierung)

Sobald eine Domain verfügbar ist:

1. DNS A-Record auf die Server-IP setzen
2. Certbot im Apache-Container einrichten oder einen separaten Nginx-Proxy mit Let's Encrypt verwenden
3. `ServerName` in der Apache-Konfiguration setzen

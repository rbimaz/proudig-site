# ProuDig — Deployment-Anleitung

##aktuelles deployement:

ansible-playbook -i inventory.yml playbook.yml --tags deploy

Docker-basiertes Deployment auf einem Linux-Server. Zwei Wege: `deploy.sh` (schnell, direkt) oder Ansible (automatisiert, wiederholbar).

## Architektur

```
                    ┌─────────────────────────────────────────┐
                    │            Linux Server                  │
   Browser ──80──►  │  ┌─────────┐    ┌───────────┐    ┌────┐ │
                    │  │ Apache  ├───►│ Spring    ├───►│ PG │ │
                    │  │ (httpd) │8081│ Boot App  │5432│ DB │ │
                    │  └─────────┘    └───────────┘    └────┘ │
                    │         Docker Network                   │
                    └─────────────────────────────────────────┘
```

Drei Container im Docker-Netzwerk:

- **proudig-web** — Apache httpd 2.4 als Reverse Proxy (Port 80)
- **proudig-app** — Spring Boot + React SPA (Java 21, Port 8081)
- **proudig-db** — PostgreSQL 14 (Port 5432 intern)


## Voraussetzungen

**Lokaler Rechner:**
- SSH-Zugang zum Server (Key-basiert empfohlen)
- Fuer deploy.sh: Bash-Shell
- Fuer Ansible: Ansible >= 2.14 (`pip install ansible`)

**Linux Server:**
- Ubuntu 22.04+ oder Debian 12+
- Mindestens 2 GB RAM, 20 GB Speicher
- SSH-Zugang mit sudo-Rechten
- Docker wird automatisch installiert


## Weg 1: deploy.sh (empfohlen fuer schnelle Deployments)

### SSH-Konfiguration

Der Server muss in `~/.ssh/config` eingetragen sein:

```
Host proudig
    HostName 192.168.1.100
    User deploy
    IdentityFile ~/.ssh/id_ed25519
```

### Deployment ausfuehren

```bash
cd deploy/
./deploy.sh proudig
```

Das Skript:
1. Prueft/installiert Docker auf dem Server
2. Sichert das vorherige Image (fuer Rollback)
3. Uebertraegt Projekt-Dateien per tar/scp
4. Baut das Docker-Image auf dem Server (Multi-Stage: JDK + Maven → JRE)
5. Startet alle Container via docker-compose
6. Wartet auf Health-Check

### Weitere Befehle

```bash
./deploy.sh proudig --setup      # Nur Server-Setup (Docker installieren)
./deploy.sh proudig --restart    # Container neustarten
./deploy.sh proudig --status     # Status pruefen
./deploy.sh proudig --logs       # Live-Logs anzeigen
./deploy.sh proudig --rollback   # Vorheriges Image wiederherstellen
./deploy.sh proudig --backup     # Datenbank-Backup herunterladen
```


## Weg 2: Ansible (fuer automatisierte/wiederholbare Deployments)

### Ansible installieren

```bash
pip install ansible
```

### Inventory anpassen

Datei `deploy/ansible/inventory.yml`:

```yaml
all:
  hosts:
    proudig-server:
      ansible_host: 192.168.1.100     # Server-IP
      ansible_user: deploy             # SSH-User
      ansible_ssh_private_key_file: ~/.ssh/id_ed25519
```

### Passwoerter sichern (optional)

```bash
cd deploy/ansible
ansible-vault create group_vars/vault.yml
```

Inhalt:
```yaml
vault_db_password: "sicheres-passwort"
vault_preview_password: "preview-passwort"
```

### Deployment

```bash
cd deploy/ansible

# Erstmaliges Setup (Docker, Firewall, Verzeichnisse)
ansible-playbook -i inventory.yml playbook.yml --tags setup

# App deployen
# Neue Version deployen.
ansible-playbook -i inventory.yml playbook.yml --tags deploy

# Mit Vault-Passwoertern
ansible-playbook -i inventory.yml playbook.yml --tags deploy --ask-vault-pass

# Rollback
ansible-playbook -i inventory.yml playbook.yml --tags rollback
```


## Konfiguration

### Umgebungsvariablen

Nach dem ersten Deployment liegt `/opt/proudig/.env` auf dem Server:

```bash
DB_USER=proudig
DB_PASSWORD=proudig123
PREVIEW_PASSWORD=proudig2026
```

Passwoerter dort aendern, dann `docker compose restart` ausfuehren.

### Apache-Konfiguration

Die Apache-Konfiguration liegt in:
- `deploy/httpd-proxy.conf` — VirtualHost mit Proxy-Regeln
- `deploy/httpd-append.conf` — Module laden (proxy, headers)

Aenderungen werden beim naechsten Deployment automatisch uebertragen.


## Wartung auf dem Server

```bash
ssh deploy@192.168.1.100
cd /opt/proudig

# Container-Status
docker compose ps

# Logs
docker compose logs -f proudig-app

# Neustart
docker compose --env-file .env restart

# Stoppen
docker compose down

# Datenbank-Backup
docker exec proudig-db pg_dump -U proudig proudigdb > backup.sql

# Datenbank-Restore
cat backup.sql | docker exec -i proudig-db psql -U proudig proudigdb

# Speicherplatz freigeben
docker system prune -f
```


## SSL/HTTPS (nach Domain-Registrierung)

1. DNS A-Record auf die Server-IP setzen
2. Certbot auf dem Server installieren:
   ```bash
   sudo apt install certbot python3-certbot-apache
   ```
3. Zertifikat holen (Apache muss auf Port 80 erreichbar sein):
   ```bash
   sudo certbot --apache -d proudig.de
   ```
4. `ServerName` in `deploy/httpd-proxy.conf` setzen und neu deployen


## Dateistruktur

```
deploy/
├── deploy.sh                 # Deployment-Skript
├── httpd-proxy.conf          # Apache VirtualHost-Konfiguration
├── httpd-append.conf         # Apache Module laden
├── proudig-site.conf         # Apache Site-Config (Legacy)
├── proudig-site.service      # Systemd Service (Legacy, vor Docker)
└── ansible/
    ├── DEPLOYMENT.md         # Diese Anleitung
    ├── inventory.yml         # Server-Konfiguration
    ├── playbook.yml          # Haupt-Playbook
    ├── group_vars/
    │   ├── all.yml           # Variablen
    │   └── vault.yml         # Verschluesselte Passwoerter (optional)
    └── roles/proudig/
        ├── tasks/main.yml    # Alle Ansible-Tasks
        └── templates/
            └── env.j2        # .env Template
```

Auf dem Server nach Deployment:
```
/opt/proudig/
├── .env                      # Umgebungsvariablen
├── docker-compose.yml        # Docker Compose
├── Dockerfile                # Multi-Stage Build
├── deploy/                   # Apache-Configs
├── src/                      # Quellcode
└── data/files/               # Uploads (persistent)
```


## Fehlerbehebung

**Container startet nicht:**
```bash
docker logs proudig-app --tail 200
```

**Datenbank-Verbindung fehlgeschlagen:**
```bash
docker exec proudig-db pg_isready -U proudig -d proudigdb
```

**Port 80 bereits belegt:**
```bash
sudo lsof -i :80
# Falls systemd-Apache laeuft:
sudo systemctl stop apache2 && sudo systemctl disable apache2
```

**Build fehlgeschlagen (Speicher):**
```bash
docker system prune -a
# Ggf. Swap hinzufuegen:
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
```

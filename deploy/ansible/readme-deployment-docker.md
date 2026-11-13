# ProuDig — Deployment-Anleitung

##aktuelles deployement:

ansible-playbook -i inventory.yml playbook.yml --tags deploy

> **Erst-Umstellung (deploy.sh → Ansible + Vault):** Schritt-für-Schritt-Runbook
> mit allen Server-Schritten (Secrets auslesen, Vault anlegen, Trockenlauf,
> Cutover, Verifikation, Rollback) in [`CUTOVER.md`](CUTOVER.md).

Docker-basiertes Deployment auf einem Linux-Server. Der Deploy erfolgt über **Ansible** (Secrets via Ansible Vault). `deploy.sh` ist nur noch **Ops-Wrapper** (`--status`/`--logs`/`--backup`/`--restart`) und deployt nicht mehr selbst.

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


## Weg 1: deploy.sh — nur noch Ops (kein Deploy mehr)

> Hinweis: `deploy.sh` deployt nicht mehr selbst. Der eigentliche Deploy läuft
> über Ansible (Weg 2). `deploy.sh` bietet nur noch `--status`/`--logs`/
> `--backup`/`--restart`. Die folgende SSH-Konfiguration gilt für beide Wege.

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

### Secrets (Ansible Vault — erforderlich)

Die Secrets liegen verschluesselt in `group_vars/all/vault.yml`;
`group_vars/all/vars.yml` referenziert sie ohne Default, d. h. **ohne Vault
schlaegt der Deploy fehl**. Wichtig: die Vault-Datei MUSS im Verzeichnis
`group_vars/all/` liegen — eine lose `group_vars/vault.yml` wird NICHT geladen.

```bash
cd deploy/ansible
cp group_vars/all/vault.yml.example group_vars/all/vault.yml
# Werte eintragen, dann verschluesseln (editorfrei, vim-unabhaengig):
ansible-vault encrypt group_vars/all/vault.yml
```

Inhalt (Vorlage: `group_vars/all/vault.yml.example`) — alle Secrets:
```yaml
vault_db_password: "<aktueller-DB-Wert-vom-Server>"        # Parität!
vault_preview_password: "<aktueller-Preview-Wert-vom-Server>"
vault_keycloak_db_password: "<openssl rand -hex 24>"
vault_keycloak_admin_password: "<openssl rand -hex 24>"
vault_nextcloud_db_password: "<openssl rand -hex 24>"
vault_nextcloud_redis_password: "<openssl rand -hex 24>"
vault_nextcloud_admin_password: "<openssl rand -hex 24>"
```

> **DB-Paritaet:** `vault_db_password` MUSS dem Wert entsprechen, mit dem die
> laufende `proudig-db` initialisiert wurde (Postgres wendet POSTGRES_PASSWORD
> nur beim Erst-Init an). Aktuellen Wert uebernehmen:
> `ssh proudig 'cat /opt/proudig/.env'`.

Das Vault-Passwort wird aus `~/.proudig-vault-pass` gelesen (in `ansible.cfg`
als `vault_password_file` konfiguriert, gitignored). Diese Datei extern sichern
(DR) — ohne sie sind die Secrets nicht entschluesselbar. Alternativ interaktiv
mit `--ask-vault-pass`.

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

### Server-Migration (Umzug auf neuen Server)

Vollständiger Umzug aller Daten (PostgreSQL + `data/files/`) mit separatem
Playbook `migrate.yml` und `inventory.migration.yml` (Gruppen `source`/`target`).
Big-Bang-Cutover, direkter Transfer alt→neu:

```bash
cd deploy/ansible

# 1. Export auf dem alten Server (App-Freeze, pg_dump + tar, MANIFEST)
ansible-playbook -i inventory.migration.yml migrate.yml --tags export

# 2. Direkter Transfer alt -> neu (Agent-Forwarding empfohlen)
ansible-playbook -i inventory.migration.yml migrate.yml \
  --tags transfer -e ansible_ssh_extra_args='-o ForwardAgent=yes'

# 3. Import + Verifikation auf dem neuen Server (Restore + Deploy aus Vault)
ansible-playbook -i inventory.migration.yml migrate.yml --tags import,verify
```

Vollständiger Ablauf inkl. Probelauf, DNS-Umstellung und Rollback:
siehe **MIGRATION-RUNBOOK.md**.


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
├── deploy.sh                 # Ops-Wrapper (--status/--logs/--backup/--restart)
├── httpd-proxy.conf          # Apache VirtualHost-Konfiguration
├── httpd-append.conf         # Apache Module laden
├── proudig-site.conf         # Apache Site-Config (Legacy)
├── proudig-site.service      # Systemd Service (Legacy, vor Docker)
└── ansible/
    ├── ansible.cfg          # inventory + vault_password_file
    ├── CUTOVER.md           # Cutover-Runbook (deploy.sh -> Ansible+Vault)
    ├── MIGRATION-RUNBOOK.md  # Runbook Server-Umzug (alt -> neu)
    ├── inventory.yml         # Server-Konfiguration (Deploy)
    ├── inventory.migration.yml # Server-Umzug (Gruppen source/target)
    ├── playbook.yml          # Haupt-Playbook (setup/deploy/rollback)
    ├── migrate.yml           # Migrations-Playbook (export/transfer/import/verify)
    ├── group_vars/
    │   └── all/             # Vars der Gruppe 'all' (Verzeichnis!)
    │       ├── vars.yml     # Nicht-geheime Variablen
    │       ├── vault.yml    # Verschluesselte Secrets (Ansible Vault)
    │       └── vault.yml.example
    └── roles/proudig/
        ├── tasks/
        │   ├── main.yml     # Deploy-Tasks (setup/deploy/rollback)
        │   ├── migrate-export.yml   # Export (Quell-Server)
        │   ├── migrate-transfer.yml # Direkter Transfer alt->neu
        │   ├── migrate-import.yml   # Import + Deploy (Ziel-Server)
        │   └── migrate-verify.yml   # Paritäts-Verifikation
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

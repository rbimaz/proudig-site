#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# ProuDig Deployment — Docker-basiert
#
# Uebertraegt das Projekt auf den Server und startet es via Docker Compose.
# Keine lokalen Build-Abhaengigkeiten (Java/Node) noetig — alles im Container.
#
# Usage:  ./deploy.sh <ssh-host> [optionen]
# Beispiel:
#   ./deploy.sh proudig                  # Voll-Deployment
#   ./deploy.sh proudig --setup          # Nur Server-Setup (Docker installieren)
#   ./deploy.sh proudig --restart        # Nur Container neustarten
#   ./deploy.sh proudig --logs           # Logs anzeigen
#   ./deploy.sh proudig --status         # Status pruefen
#   ./deploy.sh proudig --rollback       # Vorheriges Image wiederherstellen
#   ./deploy.sh proudig --backup         # Datenbank-Backup erstellen
#
# Voraussetzungen:
#   Lokal:  SSH-Zugang (konfiguriert in ~/.ssh/config)
#   Server: Ubuntu/Debian mit SSH + sudo
# ============================================================================

SSH_HOST="${1:?Bitte SSH-Host angeben: ./deploy.sh <ssh-host>}"
ACTION="${2:-deploy}"
REMOTE_DIR="/opt/proudig"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }

# ── Hilfsfunktionen ──────────────────────────────────────────

remote_exec() {
    ssh "${SSH_HOST}" bash -s <<EOF
set -e
run() {
    if [ "\$(id -u)" -ne 0 ] && command -v sudo &> /dev/null; then
        sudo "\$@"
    else
        "\$@"
    fi
}
$1
EOF
}

# ── Befehle ──────────────────────────────────────────────────

do_setup() {
    echo ""
    echo "============================================"
    echo "  ProuDig — Server-Setup"
    echo "============================================"
    echo ""

    info "Docker auf Server pruefen/installieren..."
    remote_exec '
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    echo "       Docker bereits vorhanden: $(docker --version)"
else
    echo "       Docker wird installiert..."
    run apt-get update -qq
    run apt-get install -y -qq ca-certificates curl gnupg lsb-release > /dev/null

    # Docker GPG Key + Repository
    run install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | run tee /etc/apt/keyrings/docker.asc > /dev/null
    run chmod a+r /etc/apt/keyrings/docker.asc
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | run tee /etc/apt/sources.list.d/docker.list > /dev/null

    run apt-get update -qq
    run apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin > /dev/null

    run systemctl enable docker
    run systemctl start docker
    echo "       Docker installiert: $(docker --version)"
fi

# Aktuellen User zur docker-Gruppe hinzufuegen
run usermod -aG docker $(whoami) 2>/dev/null || true

# Verzeichnisse erstellen
run mkdir -p /opt/proudig/data/files
run chown -R $(whoami):$(whoami) /opt/proudig

# Firewall (falls ufw vorhanden)
if command -v ufw &> /dev/null; then
    run ufw allow 22/tcp > /dev/null 2>&1 || true
    run ufw allow 80/tcp > /dev/null 2>&1 || true
    run ufw allow 443/tcp > /dev/null 2>&1 || true
    echo "       Firewall: Ports 22, 80, 443 offen."
fi
'
    info "Server-Setup abgeschlossen."
}

do_deploy() {
    echo ""
    echo "============================================"
    echo "  ProuDig — Deployment laeuft ueber Ansible"
    echo "============================================"
    echo ""
    warn "Der Deploy erfolgt nicht mehr ueber dieses Skript."
    warn "Ansible ist der einzige Deploy-Pfad (Secrets via Ansible Vault)."
    echo ""
    info "Deployen:"
    echo "    cd deploy/ansible"
    echo "    ansible-playbook -i inventory.yml playbook.yml --tags deploy"
    echo ""
    info "deploy.sh bleibt fuer Betriebsaufgaben:"
    echo "    ./deploy.sh ${SSH_HOST} --status    # Container-Status"
    echo "    ./deploy.sh ${SSH_HOST} --logs      # Live-Logs"
    echo "    ./deploy.sh ${SSH_HOST} --backup    # DB-Backup"
    echo "    ./deploy.sh ${SSH_HOST} --restart   # Container neustarten"
    echo ""
    exit 1
}

do_restart() {
    echo ""
    info "Container neustarten..."
    ssh "${SSH_HOST}" "cd /opt/proudig && docker compose --env-file .env restart"
    info "Neustart abgeschlossen."
}

do_status() {
    echo ""
    echo "  ── Container-Status ──"
    ssh "${SSH_HOST}" bash <<'REMOTE_STATUS'
cd /opt/proudig
docker compose ps 2>/dev/null || echo "  Keine Container gefunden."

echo ""
# Health-Checks
APP_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null || echo "000")
WEB_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")

if [ "$APP_OK" = "200" ] || [ "$APP_OK" = "302" ]; then
    echo "  ✓ Spring Boot App (Port 8081): OK"
else
    echo "  ✗ Spring Boot App (Port 8081): nicht erreichbar ($APP_OK)"
fi

if [ "$WEB_OK" = "200" ] || [ "$WEB_OK" = "302" ]; then
    echo "  ✓ Apache Proxy  (Port 80):   OK"
else
    echo "  ✗ Apache Proxy  (Port 80):   nicht erreichbar ($WEB_OK)"
fi

SERVER_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "  Website: http://${SERVER_IP}"
echo ""
REMOTE_STATUS
}

do_logs() {
    echo ""
    info "Logs anzeigen (Ctrl+C zum Beenden)..."
    ssh "${SSH_HOST}" "cd /opt/proudig && docker compose logs -f --tail 100"
}

do_rollback() {
    echo ""
    warn "Rollback auf vorheriges Image..."
    remote_exec '
if docker image inspect proudig-app:previous &>/dev/null; then
    cd /opt/proudig
    docker tag proudig-app:previous proudig-proudig-app:latest 2>/dev/null || true
    docker compose --env-file .env up -d proudig-app
    echo "       Rollback durchgefuehrt."
else
    echo "       FEHLER: Kein vorheriges Image vorhanden!"
    exit 1
fi
'
    do_status
}

do_backup() {
    echo ""
    BACKUP_NAME="proudig-backup-$(date +%Y%m%d-%H%M%S).sql"
    info "Datenbank-Backup: ${BACKUP_NAME}"
    ssh "${SSH_HOST}" "docker exec proudig-db pg_dump -U proudig proudigdb" > "${SCRIPT_DIR}/${BACKUP_NAME}"
    BACKUP_SIZE=$(du -h "${SCRIPT_DIR}/${BACKUP_NAME}" | cut -f1)
    info "Backup gespeichert: deploy/${BACKUP_NAME} (${BACKUP_SIZE})"
}

# ── Main ─────────────────────────────────────────────────────

case "$ACTION" in
    --setup)    do_setup ;;
    --restart)  do_restart ;;
    --status)   do_status ;;
    --logs)     do_logs ;;
    --rollback) do_rollback ;;
    --backup)   do_backup ;;
    deploy|*)   do_deploy ;;
esac

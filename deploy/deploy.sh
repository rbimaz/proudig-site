#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# ProuDig Docker Deployment
#
# Verwendet den SSH-Host aus ~/.ssh/config
#
# Usage:  ./deploy.sh <ssh-host>
# Beispiel: ./deploy.sh mein-server
# ============================================================================

SSH_HOST="${1:?Bitte SSH-Host angeben: ./deploy.sh <ssh-host>}"
REMOTE_DIR="/opt/proudig"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "  ProuDig Docker Deployment"
echo "============================================"
echo "  SSH-Host:  ${SSH_HOST}"
echo "  Projekt:   ${PROJECT_DIR}"
echo ""

# --- 1. Docker auf Server prüfen/installieren ---
echo "[1/4] Docker auf Server prüfen..."
ssh "${SSH_HOST}" bash -s <<'REMOTE_DOCKER'
set -e
if ! command -v docker &> /dev/null; then
    echo "       Docker installieren..."
    curl -fsSL https://get.docker.com | sh
fi
if ! docker compose version &> /dev/null; then
    echo "       Docker Compose Plugin installieren..."
    apt-get update -qq
    apt-get install -y -qq docker-compose-plugin > /dev/null
fi
mkdir -p /opt/proudig
REMOTE_DOCKER
echo "       Docker bereit."

# --- 2. Projektdateien übertragen ---
echo "[2/4] Projektdateien übertragen..."

# Temporäres Archiv erstellen (nur benötigte Dateien)
cd "$PROJECT_DIR"
tar czf /tmp/proudig-deploy.tar.gz \
    --exclude='target' \
    --exclude='src/main/frontend/node_modules' \
    --exclude='.git' \
    --exclude='.idea' \
    --exclude='*.iml' \
    .

scp -q /tmp/proudig-deploy.tar.gz "${SSH_HOST}:${REMOTE_DIR}/deploy.tar.gz"
rm -f /tmp/proudig-deploy.tar.gz
echo "       Dateien übertragen."

# --- 3. Docker Build & Start ---
echo "[3/4] Docker Build & Start..."
ssh "${SSH_HOST}" bash -s <<'REMOTE_START'
set -e
cd /opt/proudig

# Archiv entpacken
tar xzf deploy.tar.gz
rm -f deploy.tar.gz

# Container stoppen (falls vorhanden), neu bauen und starten
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d --build
REMOTE_START

# --- 4. Status prüfen ---
echo "[4/4] Status prüfen..."
sleep 5
ssh "${SSH_HOST}" bash -s <<'REMOTE_CHECK'
echo ""
echo "  Container-Status:"
docker ps --filter "name=proudig" --format "    {{.Names}}: {{.Status}}"
echo ""

# IP-Adresse ermitteln
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "  Website erreichbar unter: http://${SERVER_IP}"
echo ""
REMOTE_CHECK

echo "============================================"
echo "  Deployment abgeschlossen!"
echo "============================================"

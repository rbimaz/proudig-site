#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# ProuDig Deployment (direkt auf Linux-Server)
#
# Verwendet den SSH-Host aus ~/.ssh/config
#
# Usage:  ./deploy.sh <ssh-host>
# Beispiel: ./deploy.sh proudig
#
# Voraussetzungen lokal:
#   - Java 21 JDK + Maven (oder Maven Wrapper im Projekt)
#   - Node.js + npm
#
# Das Skript:
#   1. Baut die Anwendung lokal (Frontend + Backend → JAR)
#   2. Installiert Java 21 JRE auf dem Server (falls nötig)
#   3. Installiert und konfiguriert Apache als Reverse Proxy
#   4. Überträgt das JAR und erstellt einen Systemd-Service
#   5. Startet die Anwendung und prüft den Status
# ============================================================================

SSH_HOST="${1:?Bitte SSH-Host angeben: ./deploy.sh <ssh-host>}"
REMOTE_DIR="/opt/proudig"
SERVICE_NAME="proudig-site"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "  ProuDig Deployment"
echo "============================================"
echo "  SSH-Host:  ${SSH_HOST}"
echo "  Projekt:   ${PROJECT_DIR}"
echo ""

# --- 1. Lokal bauen ---
echo "[1/5] Anwendung lokal bauen..."
cd "$PROJECT_DIR"

# Frontend bauen
echo "       Frontend (npm)..."
cd src/main/frontend
npm install --silent 2>/dev/null
npm run build 2>/dev/null
cd "$PROJECT_DIR"

# Backend bauen (inkl. Frontend in JAR)
echo "       Backend (Maven)..."
./mvnw clean package -DskipTests -q 2>/dev/null

# JAR-Datei finden
JAR_FILE=$(ls target/proudig-site-*.jar 2>/dev/null | head -1)
if [ -z "$JAR_FILE" ]; then
    echo "       FEHLER: JAR-Datei nicht gefunden!"
    exit 1
fi
JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
echo "       Build erfolgreich: ${JAR_FILE} (${JAR_SIZE})"

# --- 2. Java auf Server installieren ---
echo "[2/5] Java auf Server prüfen/installieren..."
ssh "${SSH_HOST}" bash -s <<'REMOTE_JAVA'
set -e

run() {
    if [ "$(id -u)" -ne 0 ] && command -v sudo &> /dev/null; then
        sudo "$@"
    else
        "$@"
    fi
}

if java -version 2>&1 | grep -q 'version "21'; then
    echo "       Java 21 bereits vorhanden."
else
    echo "       Java 21 JRE wird installiert..."
    run apt-get update -qq
    run apt-get install -y -qq openjdk-21-jre-headless > /dev/null
    echo "       Java 21 installiert: $(java -version 2>&1 | head -1)"
fi

run mkdir -p /opt/proudig
REMOTE_JAVA

# --- 3. Apache als Reverse Proxy konfigurieren ---
echo "[3/5] Apache Reverse Proxy konfigurieren..."
ssh "${SSH_HOST}" bash -s <<'REMOTE_APACHE'
set -e

run() {
    if [ "$(id -u)" -ne 0 ] && command -v sudo &> /dev/null; then
        sudo "$@"
    else
        "$@"
    fi
}

# Apache installieren
if ! command -v apache2 &> /dev/null; then
    echo "       Apache2 wird installiert..."
    run apt-get update -qq
    run apt-get install -y -qq apache2 > /dev/null
fi

# Proxy-Module aktivieren
run a2enmod proxy proxy_http headers > /dev/null 2>&1 || true

# VirtualHost-Konfiguration
run tee /etc/apache2/sites-available/proudig.conf > /dev/null <<'APACHE_CONF'
<VirtualHost *:80>
    ProxyPreserveHost On
    ProxyPass / http://localhost:8081/
    ProxyPassReverse / http://localhost:8081/

    # Keine restriktive CSP setzen — React/Vite SPA
    Header unset Content-Security-Policy
</VirtualHost>
APACHE_CONF

# Site aktivieren, Default deaktivieren
run a2dissite 000-default > /dev/null 2>&1 || true
run a2ensite proudig > /dev/null 2>&1 || true

# Apache neustarten
run systemctl enable apache2
run systemctl restart apache2
echo "       Apache konfiguriert und gestartet."
REMOTE_APACHE

# --- 4. JAR übertragen und Systemd-Service einrichten ---
echo "[4/5] JAR übertragen und Service einrichten..."

# JAR auf Server kopieren
scp -q "$JAR_FILE" "${SSH_HOST}:${REMOTE_DIR}/app.jar"
echo "       JAR übertragen."

# Systemd-Service erstellen
ssh "${SSH_HOST}" bash -s <<'REMOTE_SERVICE'
set -e

run() {
    if [ "$(id -u)" -ne 0 ] && command -v sudo &> /dev/null; then
        sudo "$@"
    else
        "$@"
    fi
}

# Service-Datei erstellen
run tee /etc/systemd/system/proudig-site.service > /dev/null <<'SERVICE_CONF'
[Unit]
Description=ProuDig Website (Spring Boot)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/proudig
ExecStart=/usr/bin/java -jar /opt/proudig/app.jar --server.port=8081
Environment=PREVIEW_PASSWORD=proudig2026
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE_CONF

# Service aktivieren und (neu)starten
run systemctl daemon-reload
run systemctl enable proudig-site
run systemctl restart proudig-site
echo "       Service eingerichtet und gestartet."
REMOTE_SERVICE

# --- 5. Status prüfen ---
echo "[5/5] Status prüfen..."
sleep 3
ssh "${SSH_HOST}" bash -s <<'REMOTE_CHECK'
echo ""
echo "  Service-Status:"
systemctl is-active proudig-site && echo "    proudig-site: aktiv" || echo "    proudig-site: NICHT aktiv"
echo ""

# Health-Check: Spring Boot direkt
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null | grep -q "200"; then
    echo "  ✓ Spring Boot antwortet (Port 8081)"
else
    echo "  ⚠ Spring Boot antwortet noch nicht..."
    echo "    Prüfe mit: journalctl -u proudig-site -f"
fi

# Health-Check: Apache Proxy
if curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null | grep -q "200"; then
    echo "  ✓ Apache Proxy antwortet (Port 80)"
else
    echo "  ⚠ Apache Proxy antwortet noch nicht..."
    echo "    Prüfe mit: systemctl status apache2"
fi

# IP-Adresse
SERVER_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "  Website erreichbar unter: http://${SERVER_IP}"
echo ""
REMOTE_CHECK

echo "============================================"
echo "  Deployment abgeschlossen!"
echo "============================================"

# HTTPS und Domain-Setup - Plan

## Übersicht

| Aspekt | Aktuell | Ziel |
|--------|---------|------|
| Zugriff | `http://<server-ip>` | `https://proudig.de` |
| Zertifikat | Keins | Let's Encrypt (kostenlos, automatisch) |
| Reverse Proxy | Apache im Docker-Container | Siehe Optionen |

---

## Voraussetzungen

1. **Domain registriert** (z.B. `proudig.de`)
2. **Server mit fester IP-Adresse** (öffentlich erreichbar)
3. **Ports 80 und 443 offen** (Firewall/Router)
4. **DNS-Zugang** beim Domain-Registrar

---

## Schritt 1: DNS konfigurieren

Beim Domain-Registrar (z.B. IONOS, Strato, Hetzner, Cloudflare):

| Typ | Name | Wert | TTL |
|-----|------|------|-----|
| A | `@` (oder `proudig.de`) | `<Server-IP>` | 300 |
| A | `www` | `<Server-IP>` | 300 |

**Prüfen nach 5-30 Minuten:**
```bash
dig proudig.de +short
# Sollte Server-IP zurückgeben
```

---

## Schritt 2: HTTPS einrichten

### Option A: Traefik (Empfohlen)

**Vorteile:**
- Automatisches Let's Encrypt (Zertifikat-Erneuerung)
- Kein Host-Apache nötig
- Alles in Docker
- Einfache Konfiguration

**Änderungen an docker-compose.yml:**

```yaml
services:
  traefik:
    image: traefik:v3.0
    container_name: proudig-proxy
    restart: unless-stopped
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@proudig.de"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      # HTTP → HTTPS Redirect
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "letsencrypt:/letsencrypt"
    networks:
      - proudig-network

  proudig-app:
    # ... bestehende Konfiguration ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.proudig.rule=Host(`proudig.de`) || Host(`www.proudig.de`)"
      - "traefik.http.routers.proudig.entrypoints=websecure"
      - "traefik.http.routers.proudig.tls.certresolver=letsencrypt"
      - "traefik.http.services.proudig.loadbalancer.server.port=8081"
    networks:
      - proudig-network

  # proudig-web (Apache) ENTFERNEN - nicht mehr benötigt

volumes:
  letsencrypt:
```

**Aufwand:** Mittel
**Wartung:** Automatisch (Zertifikate werden alle 60 Tage erneuert)

---

### Option B: Caddy (Noch einfacher)

**Vorteile:**
- Noch einfachere Konfiguration als Traefik
- Automatisches HTTPS ohne Konfiguration
- Sehr performant

**Änderungen an docker-compose.yml:**

```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: proudig-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - proudig-network

  proudig-app:
    # ... bestehende Konfiguration (ohne ports) ...

  # proudig-web (Apache) ENTFERNEN

volumes:
  caddy_data:
  caddy_config:
```

**Neue Datei `Caddyfile`:**
```
proudig.de, www.proudig.de {
    reverse_proxy proudig-app:8081

    header {
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';"
    }
}
```

**Aufwand:** Gering
**Wartung:** Automatisch

---

### Option C: Host-Certbot (Klassisch)

**Vorteile:**
- Keine Änderungen an Docker-Setup
- Bewährte Methode

**Nachteile:**
- Certbot auf Host installieren
- Manuelle Erneuerung oder Cronjob
- Apache/Nginx auf Host nötig

**Schritte:**

1. Docker-Apache auf anderem Port (8080) oder entfernen
2. Host-Apache installieren:
   ```bash
   sudo apt install apache2
   sudo a2enmod proxy proxy_http ssl headers
   ```

3. VirtualHost konfigurieren (`/etc/apache2/sites-available/proudig.conf`):
   ```apache
   <VirtualHost *:80>
       ServerName proudig.de
       ServerAlias www.proudig.de

       ProxyPreserveHost On
       ProxyPass / http://localhost:8081/
       ProxyPassReverse / http://localhost:8081/
   </VirtualHost>
   ```

4. Certbot installieren und ausführen:
   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d proudig.de -d www.proudig.de
   ```

5. Automatische Erneuerung (bereits eingerichtet durch Certbot):
   ```bash
   sudo systemctl status certbot.timer
   ```

**Aufwand:** Mittel
**Wartung:** Automatisch (Certbot-Timer)

---

## Empfehlung

| Kriterium | Traefik | Caddy | Host-Certbot |
|-----------|---------|-------|--------------|
| Einfachheit | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Alles in Docker | ✓ | ✓ | ✗ |
| Auto-HTTPS | ✓ | ✓ | ✓ |
| Konfiguration | Labels | Caddyfile | Apache-Conf |
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Empfehlung: Option B (Caddy)** - einfachste Lösung, alles in Docker, automatisches HTTPS.

---

## Checkliste

- [ ] Domain registriert
- [ ] DNS A-Record gesetzt
- [ ] DNS-Propagation abwarten (5-30 Min)
- [ ] Option wählen (A, B oder C)
- [ ] docker-compose.yml anpassen
- [ ] Deployment ausführen
- [ ] HTTPS testen: `https://proudig.de`
- [ ] HTTP→HTTPS Redirect testen
- [ ] Zertifikat prüfen (Browser-Schloss)

---

## Nach dem Setup

**Zertifikat-Status prüfen:**
```bash
# Bei Traefik/Caddy
docker logs proudig-proxy | grep -i cert

# Bei Host-Certbot
sudo certbot certificates
```

**SSL-Test:**
```bash
curl -I https://proudig.de
# Sollte "HTTP/2 200" oder "HTTP/1.1 200" zeigen
```

**Online SSL-Check:**
https://www.ssllabs.com/ssltest/analyze.html?d=proudig.de

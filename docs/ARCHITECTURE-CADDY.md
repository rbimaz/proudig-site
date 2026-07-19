# ProuDig - Caddy Reverse-Proxy Architektur

## Übersicht

Diese Dokumentation beschreibt die Infrastruktur-Architektur mit Caddy als Reverse-Proxy für automatisches HTTPS.

---

## Phase 1: IP-basierter Zugriff (HTTP)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Internet                                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  │ HTTP (Port 80)
                                  │ http://<server-ip>/
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Linux Server                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Docker Network                              │  │
│  │                   (proudig-network)                            │  │
│  │                                                                │  │
│  │  ┌─────────────────┐      ┌─────────────────┐                 │  │
│  │  │                 │      │                 │                 │  │
│  │  │     Caddy       │      │  Spring Boot    │                 │  │
│  │  │  (proudig-proxy)│─────►│  (proudig-app)  │                 │  │
│  │  │                 │:8081 │                 │                 │  │
│  │  │    Port 80      │      │   Port 8081     │                 │  │
│  │  │                 │      │   (internal)    │                 │  │
│  │  └─────────────────┘      └────────┬────────┘                 │  │
│  │                                    │                          │  │
│  │                                    │ JDBC                     │  │
│  │                                    │ :5432                    │  │
│  │                                    ▼                          │  │
│  │                           ┌─────────────────┐                 │  │
│  │                           │                 │                 │  │
│  │                           │   PostgreSQL    │                 │  │
│  │                           │  (proudig-db)   │                 │  │
│  │                           │                 │                 │  │
│  │                           │   Port 5432     │                 │  │
│  │                           │   (internal)    │                 │  │
│  │                           └─────────────────┘                 │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Persistente Volumes                         │  │
│  │                                                                │  │
│  │  ./data/files ──────► /app/data/files (Dokumente)             │  │
│  │  proudig-pgdata ────► /var/lib/postgresql/data (DB)           │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Caddyfile (Phase 1)

```
:80 {
    reverse_proxy proudig-app:8081

    header {
        Content-Security-Policy "default-src 'self'; ..."
    }
}
```

---

## Phase 2: Domain-basierter Zugriff (HTTPS)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Internet                                     │
│                                                                      │
│   Browser ──► DNS ──► proudig.de ──► <Server-IP>                    │
│                       www.proudig.de                                 │
└─────────────────────────────────────┬───────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    │ HTTP (80)                         │ HTTPS (443)
                    │ Redirect                          │ TLS 1.3
                    ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Linux Server                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Docker Network                              │  │
│  │                                                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │                                                         │  │  │
│  │  │                      Caddy                              │  │  │
│  │  │                  (proudig-proxy)                        │  │  │
│  │  │                                                         │  │  │
│  │  │  ┌─────────────────────────────────────────────────┐   │  │  │
│  │  │  │  Automatisches Let's Encrypt                     │   │  │  │
│  │  │  │  • Zertifikat für proudig.de                     │   │  │  │
│  │  │  │  • Zertifikat für www.proudig.de                 │   │  │  │
│  │  │  │  • Automatische Erneuerung (alle 60 Tage)        │   │  │  │
│  │  │  └─────────────────────────────────────────────────┘   │  │  │
│  │  │                                                         │  │  │
│  │  │  Port 80 ──► 301 Redirect zu HTTPS                     │  │  │
│  │  │  Port 443 ──► Reverse Proxy zu proudig-app:8081        │  │  │
│  │  │                                                         │  │  │
│  │  └────────────────────────┬────────────────────────────────┘  │  │
│  │                           │                                   │  │
│  │                           │ HTTP :8081                        │  │
│  │                           ▼                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │                                                         │  │  │
│  │  │                   Spring Boot                           │  │  │
│  │  │                  (proudig-app)                          │  │  │
│  │  │                                                         │  │  │
│  │  │  • REST API (/api/*)                                    │  │  │
│  │  │  • React SPA (/)                                        │  │  │
│  │  │  • Static Assets (/assets/*)                            │  │  │
│  │  │                                                         │  │  │
│  │  └────────────────────────┬────────────────────────────────┘  │  │
│  │                           │                                   │  │
│  │                           │ JDBC :5432                        │  │
│  │                           ▼                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │                                                         │  │  │
│  │  │                    PostgreSQL                           │  │  │
│  │  │                   (proudig-db)                          │  │  │
│  │  │                                                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Volumes:                                                            │
│  ├── ./data/files ─────────► Dokument-Uploads                       │
│  ├── proudig-pgdata ───────► PostgreSQL Daten                       │
│  └── caddy_data ───────────► Let's Encrypt Zertifikate              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Caddyfile (Phase 2)

```
proudig.de, www.proudig.de {
    reverse_proxy proudig-app:8081

    header {
        Content-Security-Policy "default-src 'self'; ..."
    }
}
```

---

## Container-Übersicht

| Container | Image | Ports | Funktion |
|-----------|-------|-------|----------|
| `proudig-proxy` | `caddy:2-alpine` | 80, 443 | Reverse Proxy, TLS Termination |
| `proudig-app` | Custom (Dockerfile) | 8081 (intern) | Spring Boot + React SPA |
| `proudig-db` | `postgres:14-alpine` | 5432 (intern) | PostgreSQL Datenbank |

---

## Request-Flow

### Phase 1 (HTTP)

```
Client                    Caddy                    Spring Boot
  │                         │                          │
  │  GET http://<ip>/       │                          │
  │────────────────────────►│                          │
  │                         │  GET http://proudig-app:8081/
  │                         │─────────────────────────►│
  │                         │                          │
  │                         │  200 OK + HTML           │
  │                         │◄─────────────────────────│
  │  200 OK + HTML          │                          │
  │◄────────────────────────│                          │
```

### Phase 2 (HTTPS)

```
Client                    Caddy                    Spring Boot
  │                         │                          │
  │  GET http://proudig.de/ │                          │
  │────────────────────────►│                          │
  │                         │                          │
  │  301 → https://proudig.de/                         │
  │◄────────────────────────│                          │
  │                         │                          │
  │  GET https://proudig.de/│                          │
  │  (TLS Handshake)        │                          │
  │────────────────────────►│                          │
  │                         │  GET http://proudig-app:8081/
  │                         │─────────────────────────►│
  │                         │                          │
  │                         │  200 OK + HTML           │
  │                         │◄─────────────────────────│
  │  200 OK + HTML (TLS)    │                          │
  │◄────────────────────────│                          │
```

---

## Volumes und Persistenz

| Volume | Mount-Pfad | Inhalt |
|--------|------------|--------|
| `./data/files` | `/app/data/files` | Hochgeladene Dokumente |
| `proudig-pgdata` | `/var/lib/postgresql/data` | PostgreSQL Datenbank |
| `caddy_data` | `/data` | Let's Encrypt Zertifikate |
| `caddy_config` | `/config` | Caddy-Konfiguration |

---

## Netzwerk

```
proudig-network (bridge)
│
├── proudig-proxy (Caddy)
│   ├── IP: dynamisch (Docker)
│   └── Erreichbar: Port 80, 443 (Host)
│
├── proudig-app (Spring Boot)
│   ├── IP: dynamisch (Docker)
│   └── Erreichbar: proudig-app:8081 (intern)
│
└── proudig-db (PostgreSQL)
    ├── IP: dynamisch (Docker)
    └── Erreichbar: proudig-db:5432 (intern)
```

---

## Sicherheit

### TLS-Konfiguration (automatisch durch Caddy)

- **Protokoll:** TLS 1.2 und 1.3
- **Zertifikat:** Let's Encrypt (automatisch)
- **OCSP Stapling:** Aktiviert
- **HSTS:** Automatisch gesetzt

### Content-Security-Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
```

---

## Umschaltung Phase 1 → Phase 2

1. **DNS konfigurieren**
   - A-Record: `proudig.de` → `<Server-IP>`
   - A-Record: `www.proudig.de` → `<Server-IP>`

2. **Caddyfile anpassen**
   ```diff
   - :80 {
   + proudig.de, www.proudig.de {
       reverse_proxy proudig-app:8081
       ...
   }
   ```

3. **Deployment ausführen**
   ```bash
   ./deploy.sh proudig
   ```

4. **Caddy holt automatisch Zertifikate**
   - ACME HTTP-01 Challenge
   - Zertifikat wird in `caddy_data` gespeichert

5. **HTTPS ist aktiv**
   - HTTP → HTTPS Redirect automatisch
   - Zertifikat-Erneuerung automatisch

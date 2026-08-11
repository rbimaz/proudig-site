## 1. Compose — Keycloak

- [x] 1.1 `keycloak-db` (PostgreSQL, eigenes Volume, Healthcheck, `proudig-network`) ergänzen.
- [x] 1.2 `keycloak`-Dienst ergänzen (Admin-Env aus `.env`, `depends_on` DB healthy, Ressourcenlimits).

## 2. Compose — NextCloud

- [x] 2.1 `nextcloud-db` (PostgreSQL, eigenes Volume, Healthcheck) ergänzen.
- [x] 2.2 `nextcloud-redis` (Locking/Cache) ergänzen.
- [x] 2.3 `nextcloud`-Dienst ergänzen (Daten-Volume, Trusted-Domains/DB/Redis aus Env, `depends_on`).
- [x] 2.4 `nextcloud-cron`-Dienst (Background-Jobs) ergänzen.
- [x] 2.5 Neue benannte Volumes registrieren (keycloak-db, nextcloud-db, nextcloud-data, redis).

## 3. Caddy — Subdomains

- [x] 3.1 In `deploy/Caddyfile` Block `files.proudig.ai` → `reverse_proxy nextcloud:80` mit NextCloud-tauglichen Headern (kein `X-Frame-Options: DENY` auf dieser Subdomain).
- [x] 3.2 Block `auth.proudig.ai` → `reverse_proxy keycloak:8080` mit passenden Headern.
- [x] 3.3 Sicherstellen, dass der bestehende `proudig.ai`-Block (strikte CSP/DENY) unverändert bleibt.

## 4. Konfiguration & Doku

- [x] 4.1 `.env.example` um NextCloud-/Keycloak-Variablen (DB-Passwörter, Keycloak-Admin, Trusted-Domains) ergänzen; keine echten Secrets committen.
- [x] 4.2 Kurz-Doku (README/Compose-Kommentar): DNS-Einträge `files.`/`auth.`, Start-/Backup-Hinweise.

## 5. Verifikation (Deploy)

- [x] 5.1 `docker compose config` validiert (Syntax/Referenzen); Stack startet ohne Fehler.
- [ ] 5.2 Auf dem DE/EU-Server: `https://files.proudig.ai` (NextCloud-Setup) und `https://auth.proudig.ai` (Keycloak) erreichbar; App unter `proudig.ai` unverändert. — **server-seitig, hier nicht verifizierbar** (DNS + Let's Encrypt). Checkliste: (1) A-Records `files.`/`auth.` → Server-IP; (2) `./deploy.sh proudig` (erzeugt fehlende Secrets automatisch in `/opt/proudig/.env`); (3) beide Subdomains + `proudig.ai` prüfen; (4) Admin-Passwörter bei Bedarf aus `/opt/proudig/.env` auslesen.

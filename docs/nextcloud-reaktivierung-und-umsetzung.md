# NextCloud/Keycloak — Reaktivierung & Umsetzung (Leitfaden)

> Stand: 2026-08-12 · Bezug: `docs/nextcloud-einfuehrung-konzept.md` (Konzept/Phasen),
> `deploy/ansible/CUTOVER.md` (Deploy-Runbook), OpenSpec-Changes
> `nextcloud-p0-infrastructure`, `keycloak-sso-portal`.

Diese Anleitung beschreibt Schritt für Schritt, **wie vorzugehen ist, sobald
NextCloud (und das dazugehörige Keycloak-SSO) im Projekt umgesetzt werden soll.**
Ausgangspunkt ist der aktuell **geparkte** Zustand.

---

## 0. Wo wir stehen (Ist-Zustand)

**Gebaut & in Prod, aber geparkt:**
- Die Compose-Dienste `keycloak`, `keycloak-db`, `nextcloud`, `nextcloud-db`,
  `nextcloud-redis`, `nextcloud-cron` sind in `docker-compose.yml` definiert,
  liegen aber hinter dem **Compose-Profil `future`** → der reguläre Deploy
  (`docker compose up -d`) startet sie **nicht**.
- Die Caddy-Blöcke `files.proudig.ai` / `auth.proudig.ai` in `deploy/Caddyfile`
  sind **auskommentiert**.
- **Volumes** (`keycloak-db-data`, `nextcloud-db-data`, `nextcloud-redis-data`,
  `nextcloud-data`) und **alle Vault-Secrets** (auch `vault_keycloak_*`,
  `vault_nextcloud_*` in `deploy/ansible/group_vars/all/vault.yml`) sind
  **vorhanden** → bei Reaktivierung nichts neu zu erzeugen.

**Deploy-Grundlage (fertig):**
- Deployment läuft über **Ansible + Ansible Vault** (siehe `deploy/ansible/CUTOVER.md`).
  `deploy.sh` ist nur noch Ops-Wrapper.

**Geplant, noch nicht implementiert:**
- OpenSpec-Change `keycloak-sso-portal` (P1 = SSO fürs Portal) ist ausgearbeitet
  (Proposal/Design/Specs/Tasks), aber **nicht** umgesetzt.

**Bereits getroffene Entscheidungen (nicht neu diskutieren):**
- **Subdomains** `files.`/`auth.` (nicht Pfade) — NextCloud-Unterpfad ist fragil.
- **Nutzerverwaltung bleibt im Portal-UI**, intern umverdrahtet auf die
  **Keycloak Admin-API** (Keycloak = Single Source of Truth).
- **Nutzer-Migration inkl. bcrypt-Hash-Import** (nahtlos, kein Passwort-Reset) —
  benötigt einen **bcrypt-PasswordHashProvider im Keycloak-Image**, da Keycloak
  nativ nur pbkdf2 verifiziert.
- **NextCloud-Zugriff nur nach Portal-Login** wird über **SSO** erzwungen (nicht
  durch Verstecken von NextCloud).

**Server:** IP `217.154.13.179`; DNS bei **Strato** (Nameserver `*.rzone.de`).

---

## 1. Reihenfolge im Überblick

```
Phase A  Infrastruktur reaktivieren (P0 wieder aktiv)     ← rein Betrieb/Config
Phase B  P1  SSO fürs Portal (Keycloak)                   ← OpenSpec keycloak-sso-portal
Phase C  P2  NextCloud-OIDC + Ordner-Sharing + Theming    ← neuen Change schneiden
Phase D  P3  Kunden + Provisioning + Austausch-Ordner     ← neuen Change schneiden
Phase E  P4  Datenmigration Portal → NextCloud            ← neuen Change schneiden
Phase F  P5  Rückbau des Portal-Dokumentenmoduls          ← neuen Change schneiden
```

Phase A ist Voraussetzung für alles Weitere. B–F folgen dem Konzept (§11) und
werden **je Phase als eigener OpenSpec-Change** umgesetzt.

---

## 2. Phase A — Infrastruktur reaktivieren

Ziel: `https://files.proudig.ai` (NextCloud-Setup) und `https://auth.proudig.ai`
(Keycloak) sind erreichbar; `proudig.ai` bleibt unverändert.

### A.1 DNS setzen (Strato)

A-Records auf die Server-IP zeigen lassen (eine Variante wählen):

| Typ | Name | Wert |
|-----|------|------|
| A | `files` | `217.154.13.179` |
| A | `auth`  | `217.154.13.179` |

Oder **Wildcard** `A  * → 217.154.13.179` (deckt künftige Subdomains ab, z. B.
`office.` für Collabora). Propagation: Minuten bis Stunden.

Verifizieren:
```bash
dig +short A files.proudig.ai   # muss 217.154.13.179 zeigen
dig +short A auth.proudig.ai
```

### A.2 Parking dauerhaft aufheben (Repo)

Damit der **reguläre** Ansible-Deploy die Dienste wieder startet, das Compose-Profil
entfernen (nicht nur temporär mit `--profile` starten):

1. In `docker-compose.yml` die 6 Zeilen `profiles: ["future"]` bei den Diensten
   `keycloak`, `keycloak-db`, `nextcloud`, `nextcloud-db`, `nextcloud-redis`,
   `nextcloud-cron` **entfernen**.
2. In `deploy/Caddyfile` die beiden Blöcke `files.proudig.ai { … }` und
   `auth.proudig.ai { … }` wieder **einkommentieren** (die `#` entfernen).

   > Alternativ zu (1), falls man vorerst nur testen will, ohne das Repo zu ändern:
   > auf dem Server `docker compose --profile future up -d`. Für den Dauerbetrieb
   > ist das Entfernen der `profiles`-Zeilen aber der saubere Weg.

Prüfen:
```bash
docker compose --env-file .env.example config --services   # muss alle 9 listen
docker run --rm -v "$PWD/deploy/Caddyfile":/etc/caddy/Caddyfile:ro \
  caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

### A.3 Deploy

Vault liefert die NextCloud/Keycloak-Secrets bereits — **kein** neues Secret nötig.

```bash
cd deploy/ansible
ansible-playbook -i inventory.yml playbook.yml --tags deploy
```

Der Deploy rendert `.env` aus dem Vault und startet den vollständigen Stack.

### A.4 Verifikation

```bash
curl -sI https://files.proudig.ai | head -1   # NextCloud-Setup erreichbar (200/302)
curl -sI https://auth.proudig.ai  | head -1   # Keycloak erreichbar
curl -sI https://proudig.ai       | head -1   # unverändert
ssh proudig 'cd /opt/proudig && docker compose ps'
```

Falls die Zert-Ausstellung hakt: `./deploy.sh proudig --logs` (meist DNS noch nicht
propagiert). NextCloud-Admin-Passwort bei Bedarf:
`ansible-vault view deploy/ansible/group_vars/all/vault.yml`.

**Ergebnis Phase A:** P0-Infrastruktur wieder aktiv. Der OpenSpec-Change
`nextcloud-p0-infrastructure` kann nun als abgeschlossen archiviert werden
(`openspec archive nextcloud-p0-infrastructure`).

---

## 3. Phase B — P1: SSO fürs Portal (Keycloak)

Umsetzung des bereits ausgearbeiteten Changes **`keycloak-sso-portal`**. Ziel:
Ein Login für das Portal über Keycloak (OIDC), Login im ProuDig-Theme, Backend
als Resource Server, Nutzerverwaltung über die Keycloak-Admin-API.

**Details & Aufgabenliste:** `openspec/changes/keycloak-sso-portal/{proposal,design,tasks}.md`.
Implementieren mit `/opsx:apply` bzw. „implementiere keycloak-sso-portal".

Kernschritte (aus `tasks.md`):

1. **Keycloak-Realm** `proudig` als versioniertes **Import-JSON** anlegen:
   - Clients: `proudig-app` (public, Authorization-Code + PKCE) und
     `proudig-backend` (confidential, Service-Account mit `manage-users`/`view-users`).
   - Realm-Rollen `ADMIN`/`CONSULTANT`/`CLIENT` + Claim-Mapper (→ `ROLE_*`).
   - **ProuDig-Login-Theme** (Logo, Marken-Orange, Typo).
   - **bcrypt-`PasswordHashProvider`-SPI** ins Keycloak-Image aufnehmen
     (Version pinnen) — Voraussetzung für den nahtlosen Hash-Import.
2. **Migration**: Import-Skript `users`/`roles` → Keycloak (inkl. bcrypt-Credential,
   `forcePasswordChange` → Required-Action `UPDATE_PASSWORD`); Keycloak-`sub` zurück
   in den lokalen Profil-Spiegel. **Verifizieren: Login mit unverändertem Passwort.**
3. **Backend**: `spring-boot-starter-oauth2-resource-server`; `SecurityConfig` →
   `oauth2ResourceServer(jwt)`; Rollen-Claim → Authorities; JIT-Profil-Sync;
   `UserService`/`UserController` auf Admin-API umverdrahten; Alt-Auth entfernen
   (`JwtTokenProvider`, `JwtAuthFilter`, `AuthController`, `RefreshToken`);
   Liquibase-Migration (`sub`-Spalte, `refresh_tokens`/`password` obsolet).
4. **Frontend**: `AuthContext.jsx` → OIDC (Redirect + PKCE, Refresh, Logout);
   `AdminLogin.jsx` → Redirect-Trigger; `authFetch` nutzt OIDC-Token;
   `PortalUsers`/`PortalUserForm` bleiben (sprechen die umverdrahteten `/api/users`).
5. **Cutover-Verifikation**: Test-Login migrierter Nutzer, alle `@PreAuthorize`-Pfade,
   User-CRUD gegen Keycloak, Required-Action greift.

> **Wichtig — Cutover-Sicherheit:** Realm + Import zuerst verifizieren (Test-Login
> mit bestehendem Passwort), **bevor** die alte JWT-Auth entfernt wird. Rollback =
> vorherigen App-Stand redeployen (`./deploy.sh proudig --rollback` bzw.
> `--tags rollback`).

**Offene Design-Fragen (in `design.md`):** Realm per Import-JSON vs. Console;
Realm- vs. Client-Rollen; `/api/auth/me` behalten; BFF-Härtung später.

---

## 4. Phase C — P2: NextCloud-OIDC + Ordner-Sharing + Theming

Neuen OpenSpec-Change schneiden (`openspec propose`). Ziel: NextCloud nutzt Keycloak
als OIDC-Provider; Zugriff nur nach Portal-Login; deine Rollen-/Ordner-Anforderungen.

Inhalte:
- **NextCloud `user_oidc`-App** gegen Keycloak konfigurieren (Discovery, Client).
- **Lokales NextCloud-Login deaktivieren** → Zugriff nur über SSO (erzwingt
  „nur nach vorheriger Portal-Anmeldung").
- **JIT-Provisioning** beim ersten OIDC-Login; **Gruppen-Mapping** ADMIN/CONSULTANT/CLIENT
  aus dem Token → NextCloud-Gruppen.
- **Admins sehen alle Dokumente**: via App **„Group Folders"** ein Team-Ordner mit
  ADMIN-Zugriff (bzw. NextCloud-Admin-Rolle).
- **Ordner-Sharing intern** (VIEW/EDIT, vererbt auf den Teilbaum) — die
  Ausgangsanforderung, nativ in NextCloud.
- **NextCloud-Theming** (ProuDig-Look via Theming-App).
- **Deep-Link „Dateien"** im Portal → `files.proudig.ai` (dank SSO kein zweiter Login).

Referenz: Konzept §5/§6.

---

## 5. Phase D — P3: Kunden + Provisioning + Austausch-Ordner

Neuer OpenSpec-Change. Inhalte (Konzept §5/§12):
- **Kunden-Accounts (CLIENT)**: Anlage im Portal → via Keycloak-Admin-API (die in
  P1 gebaute Umverdrahtung) → NextCloud per JIT.
- Je Kunde ein **dedizierter Austausch-Ordner**, den Consultants read-only oder
  read/write mit dem Kunden teilen. Mandanten-Trennung über getrennte Ordner/Freigaben.
- **Externe Freigabe-Links** (login-frei, Ablauf/Passwort) nativ in NextCloud
  (löst die bestehende `ExternalShareLink`-Funktion ab).

---

## 6. Phase E — P4: Datenmigration Portal → NextCloud

Neuer OpenSpec-Change. Inhalte (Konzept §10):
- **Quelle**: `data/files/` + Metadaten aus `documents`/`folders`.
- **Weg**: Skript-gestützter Import in NextCloud (WebDAV oder `occ files:scan`);
  Zuordnung Eigentümer/Ordner → NextCloud-Nutzer/Ordner.
- **Cutover**: altes Portal-Dokumentmodul während der Migration read-only, dann
  Abschaltung. Vorher **Backup** (NextCloud-DB + `nextcloud-data`, siehe
  `deploy/README.md`).

---

## 7. Phase F — P5: Rückbau des Portal-Dokumentenmoduls

Neuer OpenSpec-Change. Erst **nachdem** NextCloud alle heute genutzten Funktionen
abdeckt. Rückzubauen (Konzept §9):
- Backend: `DocumentController`, `FolderController`, `DocumentService`,
  `FolderService`, `DocumentShare`, `ExternalShareLink` + Repos; Endpunkte
  `/api/documents`, `/api/folders`, `/api/shares`, `/api/portal/*`.
- Frontend: `PortalDocuments`, `InternalShareDialog`, `ShareLinkDialog`,
  Portal-Dashboard-Dokument-Statistiken.
- DB: `documents`, `folders`, `document_shares`, `external_share_links`.

**Bleibt:** CMS (Seiten/Blog/News/Seminare/Offerings), Mediathek, Kontakt-Nachrichten.

---

## 8. Betrieb (ab Reaktivierung dauerhaft)

- **Backup** (zusätzlich zur Portal-DB): NextCloud-DB + `nextcloud-data`, Keycloak-DB
  — Kommandos in `deploy/README.md` (Abschnitt „NextCloud + Keycloak").
- **Updates**: NextCloud- und Keycloak-Images regelmäßig patchen (Sicherheits-Releases);
  bcrypt-Hash-Provider-Version beim Keycloak-Update mitziehen.
- **Monitoring**: Health-Checks, Speicherplatz, NextCloud-Background-Jobs (Cron-Container).
- **Secrets**: bleiben im Vault (`group_vars/all/vault.yml`); Vault-Passwortdatei
  extern gesichert halten (DR).

---

## 9. Schnell-Checkliste (Reaktivierung Phase A)

- [ ] DNS `files.`/`auth.` (oder Wildcard) bei Strato → `217.154.13.179`, propagiert.
- [ ] `profiles: ["future"]` (6×) aus `docker-compose.yml` entfernt.
- [ ] Caddy-Blöcke `files.`/`auth.` in `deploy/Caddyfile` einkommentiert.
- [ ] `docker compose config --services` listet alle 9; `caddy validate` grün.
- [ ] `ansible-playbook … --tags deploy` gelaufen (`failed=0`).
- [ ] `files.`/`auth.`/`proudig.ai` per HTTPS erreichbar.
- [ ] `nextcloud-p0-infrastructure` archiviert.
- [ ] Danach: P1 (`keycloak-sso-portal`) implementieren.

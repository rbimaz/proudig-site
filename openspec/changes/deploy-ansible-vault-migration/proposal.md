## Why

Der reale Produktions-Deploy läuft über `deploy.sh` (Bash, SSH+tar/scp) und erzeugt Secrets direkt auf dem Server (Heredoc-Defaults bzw. `openssl rand`). Das ist nicht reproduzierbar, hat keinen zentralen Ursprung und keinen Rotations-Workflow. Die Ansible-Vorarbeit (`deploy/ansible/`) ist fast vollständig, aber nicht scharf geschaltet. Bevor NextCloud/Keycloak dazukommen, soll der Deploy auf Ansible umgestellt und Secrets mit Ansible Vault zentral, verschlüsselt und versioniert verwaltet werden.

## What Changes

- **Ansible wird der einzige Deploy-Pfad.** `ansible-playbook … --tags deploy` ersetzt die Deploy-Logik von `deploy.sh`.
- **Ansible Vault verwaltet die Secrets.** Neue verschlüsselte `group_vars/all/vault.yml`; `env.j2` rendert `/opt/proudig/.env` deterministisch aus dem Vault.
- **Unsichere Defaults entfernt.** `vault_* | default('proudig123')` in `group_vars/all/vars.yml` fällt weg — fehlender Vault scheitert laut statt still schwach zu werden. **BREAKING** für Deploys ohne Vault.
- **Vault-Zugang über vault-password-file** (gitignored), referenziert in neuer `ansible.cfg`.
- **`deploy.sh` wird auf Ops-Wrapper reduziert** (`--status/--logs/--backup/--restart`); Deploy- und Secret-Erzeugungslogik (Schritt 5/6, inkl. der `openssl rand`-Generierung aus Commit `0b8b976`) entfällt bzw. wandert zu Ansible.
- **DB-Passwort-Parität gewahrt.** Die aktuell laufenden Prod-Werte werden 1:1 in den Vault übernommen (kein Bruch der bestehenden PostgreSQL-Daten).
- **NextCloud/Keycloak-Secrets im Vault (Vorbereitung).** Auch die neuen Dienst-Secrets werden hier in Vault+`env.j2` aufgenommen, damit der Cutover **self-contained** ist (`docker compose up` findet alle Pflicht-Secrets) und die NextCloud-Einführung vorbereitet ist — unabhängig von einem separaten NextCloud-Schritt.

## Capabilities

### New Capabilities
- `deployment`: Wie die Anwendung auf den Produktionsserver ausgeliefert wird und wie Secrets/Umgebungsvariablen dabei verwaltet werden (Ansible als Deploy-Pfad, Ansible Vault als Secret-Quelle, `deploy.sh` als Ops-Wrapper).

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. -->

## Impact

- **Neu:** `deploy/ansible/ansible.cfg`, `deploy/ansible/group_vars/all/vault.yml` (verschlüsselt), `.gitignore`-Eintrag für die Vault-Passwortdatei.
- **Geändert:** `deploy/ansible/group_vars/all/vars.yml` (Defaults entfernt), `deploy/ansible/roles/proudig/templates/env.j2` (Render aus Vault), `deploy/ansible/roles/proudig/tasks/main.yml` (`.env`-Übernahme/`force`-Verhalten), `deploy/deploy.sh` (Rückbau auf Ops-Wrapper), Deploy-Doku (`deploy/README.md`, `deploy/ansible/readme-deployment-docker.md`).
- **Vorbereitung NextCloud:** NextCloud/Keycloak-Secrets werden hier bereits in Vault+`env.j2` verwaltet; der Cutover ist dadurch unabhängig von einem separaten NextCloud-Schritt. Restliches Cleanup im Change `nextcloud-p0-infrastructure`: dessen Doku (`.env.example`, README-NextCloud-Abschnitt) von der alten `deploy.sh`-`openssl`-Generierung auf Vault umschreiben.
- **Nicht betroffen:** `docker-compose.yml`-Dienste, App-Code, DB-Schema. Keine DB-Rotation, keine CI-Anbindung.
- **Betriebsrisiko:** Cutover auf laufendem Server — DB-Passwort-Parität ist Pflicht, sonst verliert die App den DB-Zugang.

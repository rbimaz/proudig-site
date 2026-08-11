## 1. Vault & Ansible-Konfiguration

- [x] 1.1 `deploy/ansible/ansible.cfg` anlegen mit `vault_password_file` (Pfad zur gitignored Passwortdatei) + sinnvollen Defaults (inventory, roles_path).
- [x] 1.2 Vault-Passwortdatei-Muster in `.gitignore` ergänzen (`.proudig-vault-pass`, `*.vault-pass`); keine echte Passwortdatei committen.
- [x] 1.3 Aktuelle Prod-Secrets vom Server ausgelesen und für die Parität übernommen.
- [x] 1.4 `deploy/ansible/group_vars/all/vault.yml` verschlüsselt anlegen (`ansible-vault create`) mit allen Secrets: `vault_db_password`/`vault_preview_password` (reale Prod-Werte, Parität) + `vault_keycloak_db_password`/`vault_keycloak_admin_password`/`vault_nextcloud_db_password`/`vault_nextcloud_redis_password`/`vault_nextcloud_admin_password` (neu, starke Zufallswerte). — **braucht Vault-Passwort; Vorlage + Befehle in `group_vars/all/vault.yml.example`.**

## 2. Variablen & Template scharf schalten

- [x] 2.1 In `group_vars/all/vars.yml` (aus `all.yml` ins `all/`-Verzeichnis verschoben) die `default(...)`-Fallbacks entfernt; `db_password`/`preview_password` strikt aus Vault. Zusätzlich Keycloak-/NextCloud-Konfig ergänzt (nicht-geheim inline, Passwörter aus Vault ohne Default).
- [x] 2.2 `env.j2` rendert den vollen `.env`-Satz (Portal + Keycloak + NextCloud) deterministisch aus group_vars+Vault — damit ist der Cutover self-contained (alle Compose-`:?`-Secrets vorhanden).
- [x] 2.3 `.env`-Task in `roles/proudig/tasks/main.yml` auf `force: yes` gesetzt (Vault = Quelle der Wahrheit) + Paritäts-Kommentar.
- [x] 2.4 group_vars auf Verzeichnis-Layout umgestellt: `group_vars/all.yml` → `group_vars/all/vars.yml`, Vault → `group_vars/all/vault.yml`. Grund: eine lose `group_vars/vault.yml` wird von Ansible nicht geladen (kein Gruppenname „vault") — der Vault war real nie aktiv, die alten Defaults haben es verdeckt. Verifiziert: `vault_db_password`/`vault_nextcloud_admin_password` laden jetzt (`is defined` → True).

## 3. Trockenlauf & Parität

- [x] 3.1 Syntax-Check grün: `bash -n deploy.sh` + `ansible-playbook --syntax-check`.
- [x] 3.2 Parität verifiziert: nach dem Deploy ist `proudig-app` healthy gegen die unveränderte `proudig-db` (Up 4 months) → DB-Passwort stimmt.

## 4. deploy.sh auf Ops-Wrapper zurückbauen

- [x] 4.1 Deploy- und Secret-Logik aus `deploy.sh` entfernt (Schritt 4/5/6 inkl. `openssl rand`-Generierung aus Commit `0b8b976`); `do_deploy` verweist auf Ansible. Orphan `PROJECT_DIR` entfernt.
- [x] 4.2 `--status`, `--logs`, `--backup`, `--restart` in `deploy.sh` unverändert funktionsfähig.
- [x] 4.3 `bash -n deploy/deploy.sh` grün.

## 5. Doku

- [x] 5.1 `deploy/README.md` + `deploy/ansible/readme-deployment-docker.md` aktualisiert: Ansible als Deploy-Pfad, Vault-Nutzung (`ansible.cfg`/Passwortdatei), `deploy.sh` = Ops-Wrapper, Cutover-/Paritäts-Hinweise.
- [x] 5.2 DR-Hinweis dokumentiert (Vault-Passwortdatei extern sichern).

## 6. Cutover & Verifikation (Server)

> Server-Runbook mit konkreten Befehlen für 1.3/1.4 und alle Cutover-Schritte:
> `deploy/ansible/CUTOVER.md`.

- [x] 6.1 Realer Ansible-Deploy gegen Prod ausgeführt: `failed=0`, gesamter Stack (Portal + Keycloak + NextCloud) hochgekommen — self-contained bestätigt.
- [x] 6.2 `proudig-app` healthy gegen unveränderte `proudig-db`; alle DBs/Redis healthy. Rest-Check: `proudig.ai` per HTTPS gegenprüfen (Caddy unverändert, Up 8 weeks).
- [x] 6.3 Rollback-Weg vorhanden: `proudig-app:previous` wurde vor dem Deploy getaggt (Task „Vorheriges Docker-Image taggen" = changed) → `--tags rollback` verfügbar.

## 7. NextCloud-Vorbereitung & Folge-Cleanup

- [x] 7.1 NextCloud/Keycloak-Secrets in diesem Change in Vault+`env.j2` überführt (Cutover unabhängig von einem separaten NextCloud-Schritt; bereitet die Einführung vor). Die `deploy.sh`-Secret-Generierung ist bereits entfernt (Gruppe 4).
- [ ] 7.2 Folge-Cleanup im Change `nextcloud-p0-infrastructure`: dort ist die Doku (`deploy/README.md`-NextCloud-Abschnitt, `.env.example`) noch auf die alte `deploy.sh`-`openssl`-Generierung formuliert — auf „Secrets via Ansible Vault" umstellen. (Separater Change, nicht hier.)

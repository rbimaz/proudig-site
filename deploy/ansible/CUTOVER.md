# Cutover-Runbook: deploy.sh → Ansible + Vault

Schritt-für-Schritt-Anleitung für die einmalige Umstellung des Produktions-Deploys
auf Ansible mit Ansible Vault. Alle Befehle laufen lokal aus `deploy/ansible/`,
sofern nicht anders angegeben. Ersetzt die verstreuten Hinweise in `README.md` /
`readme-deployment-docker.md` / `vault.yml.example` durch einen linearen Ablauf.

> **Kritische Randbedingung — DB-Parität:** PostgreSQL wendet `POSTGRES_PASSWORD`
> nur beim Erst-Init eines leeren Datenverzeichnisses an. Die laufende
> `proudig-db` hat ihr Passwort bereits. `vault_db_password` MUSS exakt diesem
> Wert entsprechen, sonst sperrt der Cutover die App aus.

---

## 0. Voraussetzungen

- Ansible ≥ 2.14 lokal (`ansible --version`).
- SSH-Zugang zum Server als `proudig` (Eintrag in `~/.ssh/config`).
- `inventory.yml` zeigt auf den richtigen Host/User/Key.

---

## 1. Aktuelle Prod-Secrets auslesen  *(Task 1.3)*

```bash
ssh proudig 'cat /opt/proudig/.env'
```

Werte notieren — mindestens `DB_PASSWORD` und `PREVIEW_PASSWORD`. Diese exakten
Werte kommen in den Vault (Parität).

---

## 2. Vault-Passwortdatei anlegen  *(einmalig, gitignored)*

```bash
# Starkes Passwort in die von ansible.cfg erwartete Datei schreiben:
printf '%s\n' 'DEIN-STARKES-VAULT-PASSWORT' > ~/.proudig-vault-pass
chmod 600 ~/.proudig-vault-pass
```

> **DR:** Dieses Passwort zusätzlich im Passwortmanager sichern — ohne es sind
> die Vault-Secrets unwiderruflich verschlüsselt.

---

## 3. Verschlüsselten Vault anlegen  *(Task 1.4)*

Die Vault-Datei MUSS in `group_vars/all/` liegen (Verzeichnis der Gruppe `all`) —
eine lose `group_vars/vault.yml` wird von Ansible **nicht** geladen.

**Editorfrei (empfohlen — unabhängig von `$EDITOR`/vim):**

```bash
cd deploy/ansible
cp group_vars/all/vault.yml.example group_vars/all/vault.yml
#   -> group_vars/all/vault.yml in der IDE ausfüllen (Werte s. u.)
ansible-vault encrypt group_vars/all/vault.yml   # nutzt ~/.proudig-vault-pass
```

Kontrolle: `head -1 group_vars/all/vault.yml` muss `$ANSIBLE_VAULT;1.1;AES256`
zeigen. Erst **danach** committen — vorher stünden Klartext-Secrets in Git.

Alternativ interaktiv: `ansible-vault create group_vars/all/vault.yml` (öffnet
`$EDITOR`; bei kaputtem vim z. B. `EDITOR=nano ansible-vault create …`).

Inhalt (Vorlage: `group_vars/all/vault.yml.example`):

```yaml
# Bestehende Dienste — reale Werte aus Schritt 1 (Parität!):
vault_db_password: "<DB_PASSWORD vom Server>"
vault_preview_password: "<PREVIEW_PASSWORD vom Server>"

# Keycloak + NextCloud — neu, starke Zufallswerte (openssl rand -hex 24):
vault_keycloak_db_password: "<random>"
vault_keycloak_admin_password: "<random>"
vault_nextcloud_db_password: "<random>"
vault_nextcloud_redis_password: "<random>"
vault_nextcloud_admin_password: "<random>"
```

Prüfen/Editieren später: `ansible-vault view group_vars/all/vault.yml` bzw.
`ansible-vault edit group_vars/all/vault.yml`. Die verschlüsselte Datei WIRD committet.

> Die Keycloak-/NextCloud-Passwörter unterliegen KEINER Parität (neue Dienste,
> noch kein initialisiertes Volume) — hier bewusst starke Zufallswerte.

---

## 4. Trockenlauf & Paritäts-Check  *(Task 3.1 / 3.2)*

```bash
cd deploy/ansible
ansible-playbook -i inventory.yml playbook.yml --syntax-check
ansible-playbook -i inventory.yml playbook.yml --tags deploy --check --diff
```

Im `--diff` prüfen: die gerenderte `/opt/proudig/.env` erzeugt **byte-gleiche**
`DB_PASSWORD`/`PREVIEW_PASSWORD`-Werte wie das Server-Ist aus Schritt 1. Jede
Abweichung bei `DB_PASSWORD` hier stoppen und korrigieren — sonst DB-Aussperrung.

---

## 5. Cutover: realer Deploy  *(Task 6.1)*

Self-contained — der Vault liefert auch die Keycloak-/NextCloud-Secrets, daher
startet `docker compose up` den gesamten Stack ohne fehlende `:?`-Variablen.

```bash
cd deploy/ansible
ansible-playbook -i inventory.yml playbook.yml --tags deploy
```

> **Hinweis:** Der Deploy startet auch die neuen NextCloud/Keycloak-Container
> (Vorbereitung der Einführung). Fehlen noch DNS-A-Records für
> `files.`/`auth.proudig.ai`, versucht Caddy dort vergeblich ein Zertifikat —
> das ist unkritisch und beeinträchtigt `proudig.ai` nicht.

---

## 6. Verifikation  *(Task 6.2)*

```bash
# App healthy?
ssh proudig "docker inspect --format='{{.State.Health.Status}}' proudig-app"
# DB-Verbindung ok?
ssh proudig 'docker exec proudig-db pg_isready -U proudig -d proudigdb'
# Website unverändert erreichbar?
curl -sS -o /dev/null -w '%{http_code}\n' https://proudig.ai/
```

Erwartung: `healthy`, `accepting connections`, HTTP `200`/`302`.

---

## 7. Rollback  *(Task 6.3)*

Falls die App nach dem Cutover den DB-Zugang verliert (Paritätsfehler):

```bash
# Vorheriges .env wiederherstellen (Backup vor dem Deploy anlegen!):
ssh proudig 'cp /opt/proudig/.env.bak /opt/proudig/.env && cd /opt/proudig && docker compose --env-file .env up -d proudig-app'
# oder vorheriges Image:
ansible-playbook -i inventory.yml playbook.yml --tags rollback
```

> Tipp: Vor Schritt 5 ein Backup ziehen: `ssh proudig 'cp /opt/proudig/.env /opt/proudig/.env.bak'`.

---

## Nach dem Cutover

- `deploy.sh` nur noch für Betrieb (`--status`/`--logs`/`--backup`/`--restart`).
- Folgeschritt: NextCloud/Keycloak-Secrets in Vault+`env.j2` überführen
  (Change `nextcloud-p0-infrastructure`), dann NextCloud-Cutover.

## ADDED Requirements

### Requirement: Ansible als einziger Deploy-Pfad

Das Produktions-Deployment SHALL über Ansible erfolgen (`ansible-playbook -i inventory.yml playbook.yml --tags deploy`). Die Deploy-Logik (Dateien übertragen, Image bauen, Container starten, Health-Check) SHALL in der Ansible-Rolle `proudig` liegen; `deploy.sh` SHALL diese Logik nicht mehr duplizieren.

#### Scenario: Deploy über Ansible

- **WHEN** ein Betreiber `ansible-playbook -i inventory.yml playbook.yml --tags deploy` ausführt
- **THEN** werden Projektdateien übertragen, das Image gebaut, alle Container via `docker compose --env-file .env up -d` gestartet und auf `proudig-app` = healthy gewartet

#### Scenario: deploy.sh deployt nicht mehr selbst

- **WHEN** `./deploy.sh proudig` ohne Ops-Flag aufgerufen wird
- **THEN** verweist das Skript auf den Ansible-Deploy und führt selbst keinen eigenständigen Datei-/Build-/Start-Ablauf mehr aus

### Requirement: Secrets über Ansible Vault

Alle Deploy-Secrets (mindestens `DB_PASSWORD`, `PREVIEW_PASSWORD` sowie künftige Dienst-Secrets) SHALL in einer verschlüsselten `group_vars/all/vault.yml` liegen (im `all/`-Verzeichnis, damit Ansible sie für die Gruppe `all` lädt). Die Server-`.env` SHALL deterministisch aus diesen Vault-Werten über `env.j2` gerendert werden. Klartext-Secrets SHALL nicht in Git liegen.

#### Scenario: .env aus Vault gerendert

- **WHEN** der Deploy-Task läuft
- **THEN** wird `/opt/proudig/.env` aus den entschlüsselten Vault-Werten erzeugt und enthält für jeden Dienst die vorgesehenen Zugangsdaten

#### Scenario: Kein Secret im Klartext im Repo

- **WHEN** das Repository durchsucht wird
- **THEN** enthält keine versionierte Datei ein Klartext-Produktions-Secret; `vault.yml` ist verschlüsselt und die Vault-Passwortdatei ist gitignored

### Requirement: Kein stiller Fallback auf schwache Defaults

Fehlt der Vault (bzw. eine Secret-Variable), SHALL der Deploy mit einem Fehler abbrechen. Es SHALL keine unsicheren Default-Passwörter (`proudig123`, `proudig2026`) mehr als stiller Ersatz greifen.

#### Scenario: Deploy ohne Vault-Passwort scheitert

- **WHEN** ein Deploy ohne verfügbares Vault-Passwort gestartet wird
- **THEN** bricht Ansible mit einem Vault-/Fehlerhinweis ab, statt mit schwachen Defaults fortzufahren

### Requirement: DB-Passwort-Parität beim Cutover

Der Umstieg SHALL die bestehenden PostgreSQL-Daten nicht brechen. Der Vault SHALL für bereits initialisierte Datenbanken exakt den aktuell laufenden Passwortwert enthalten (kein Neu-Erzeugen), da PostgreSQL `POSTGRES_PASSWORD` nur beim Erst-Init anwendet.

#### Scenario: App bleibt nach Cutover mit DB verbunden

- **WHEN** nach der Umstellung `docker compose up -d` mit der aus dem Vault gerenderten `.env` läuft
- **THEN** kann sich `proudig-app` weiterhin an der bestehenden `proudig-db` anmelden (identisches Passwort), und die Website ist unverändert erreichbar

### Requirement: Cutover unabhängig von NextCloud

Der Übergang auf Ansible SHALL self-contained sein: Der Vault SHALL die Secrets aller im Compose-Stack definierten Dienste liefern (Portal, Keycloak, NextCloud), sodass `docker compose up` beim Deploy keine Pflicht-Variable (`:?`) vermisst. Der Cutover SHALL nicht von einem separaten NextCloud-Schritt abhängen; die NextCloud-Einführung wird dadurch vorbereitet.

#### Scenario: Gesamter Stack startet ohne fehlende Secrets

- **WHEN** der Ansible-Deploy die aus dem Vault gerenderte `.env` verwendet und `docker compose up -d` ausführt
- **THEN** finden auch die NextCloud-/Keycloak-Dienste ihre Pflicht-Secrets, und der Start bricht nicht wegen fehlender Variablen ab

### Requirement: deploy.sh als Ops-Wrapper

`deploy.sh` SHALL als Komfort-Werkzeug für Betriebsaufgaben erhalten bleiben und die Befehle `--status`, `--logs`, `--backup`, `--restart` weiter bereitstellen.

#### Scenario: Ops-Befehle funktionieren weiter

- **WHEN** ein Betreiber `./deploy.sh proudig --status` (oder `--logs`/`--backup`/`--restart`) ausführt
- **THEN** liefert das Skript den jeweiligen Betriebs-Output, ohne einen Deploy auszulösen

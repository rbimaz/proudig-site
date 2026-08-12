## Context

Produktions-Deploy heute: `./deploy.sh proudig` (self-contained Bash, SSH + tar/scp). Es schreibt `/opt/proudig/.env` selbst (Heredoc-Defaults `proudig123`/`proudig2026`) und startet alle Container mit `docker compose --env-file .env up -d`. Der Ansible-Pfad unter `deploy/ansible/` ist fast vollständig (playbook, inventory, Rolle mit setup/deploy/rollback, `env.j2`, `group_vars/all.yml` (Datei) mit `vault_* | default(...)`), aber nicht scharf: keine `vault.yml`, keine `ansible.cfg`, kein Vault-Passwort-Mechanismus; `env.j2` läuft mit `force: no`.

Kritische Randbedingung: Der laufende `proudig-db`-Volume hat sein Passwort beim Erst-Init erhalten; PostgreSQL wendet `POSTGRES_PASSWORD` bei vorhandenem Datenverzeichnis nicht erneut an. Ein Cutover, der ein anderes `DB_PASSWORD` setzt, würde die App vom DB-Zugang abschneiden.

## Goals / Non-Goals

**Goals:**
- Ansible = einziger Deploy-Pfad; `deploy.sh` = Ops-Wrapper.
- Secrets zentral, verschlüsselt und versioniert per Ansible Vault; `.env` deterministisch daraus gerendert.
- Cutover auf laufendem Prod-Server ohne DB-Bruch (Passwort-Parität).

**Non-Goals:**
- Kein Umbau der `docker-compose.yml`-Dienste, kein App-/DB-Schema-Eingriff.
- Kein NextCloud/Keycloak-Setup in diesem Change (nur Deploy-/Secret-Mechanik).
- Keine DB-Passwort-Rotation, keine CI-Anbindung.

## Decisions

- **Ansible statt Bash für den Deploy.** Die Rolle deckt setup/deploy/rollback bereits ab; wir schalten sie scharf, statt die Bash-Logik weiter zu pflegen. Alternative „deploy.sh behalten und härten" verworfen: zwei Deploy-Pfade = Doppelpflege und Drift.
- **Vault-Passwort über `vault_password_file`.** Referenziert in neuer `ansible.cfg`; Datei gitignored. Ermöglicht unbeaufsichtigte Läufe. Alternative `--ask-vault-pass` verworfen (kein CI/unbeaufsichtigter Lauf), bleibt aber als manueller Notnagel möglich.
- **Secrets in verschlüsselter `group_vars/all/vault.yml`; Defaults raus.** `all/vars.yml` referenziert die Vault-Variablen ohne `default(...)`, damit fehlender Vault laut scheitert. `env.j2` rendert alle Variablen aus dem Vault.
- **`group_vars/all/`-Verzeichnis-Layout (Bugfix).** Die bisherige lose `group_vars/vault.yml` wurde von Ansible NIE geladen (kein Gruppenname „vault") — die alten `default(...)` haben das verdeckt, d. h. der Vault war real nie aktiv. Korrekt: `group_vars/all.yml` → `group_vars/all/vars.yml` und die Vault-Datei → `group_vars/all/vault.yml`; beide werden für die Gruppe `all` geladen. Alternative `vars_files` im Playbook verworfen (weniger idiomatisch).
- **DB-Parität: aktuelle Prod-Werte 1:1 übernehmen.** Vor dem Cutover `/opt/proudig/.env` auf dem Server auslesen und die realen Werte in `vault.yml` schreiben. Kein Neu-Würfeln für bereits initialisierte DBs.
- **`deploy.sh` auf Ops-Wrapper reduzieren.** Deploy-/Secret-Erzeugungslogik (Schritt 5/6, inkl. `openssl rand` aus Commit `0b8b976`) entfernen; `--status/--logs/--backup/--restart` bleiben.
- **NextCloud/Keycloak-Secrets hier in den Vault falten.** Die committete `docker-compose.yml` enthält bereits NextCloud/Keycloak mit `:?`-Guards; würde der Ansible-Deploy diese Secrets nicht liefern, bräche `docker compose up`. Statt den Cutover an einen separaten NextCloud-Schritt zu koppeln, verwaltet dieser Change die neuen Secrets direkt in Vault+`env.j2`. Ergebnis: **Cutover self-contained** und NextCloud-Einführung vorbereitet. Alternative „NextCloud erst später verdrahten" verworfen (würde den Cutover blockieren oder das Entfernen der Dienste aus dem Stack erzwingen). Neue Dienst-Secrets unterliegen keiner Parität → starke Zufallswerte.

## Risks / Trade-offs

- **DB-Passwort-Mismatch bricht App-Zugang** → Vor Cutover realen Wert auslesen und exakt in Vault übernehmen; nach Deploy `pg_isready`/App-Health prüfen; Rollback = alte `.env` wiederherstellen.
- **`env.j2` mit `force: no` überschreibt bestehende `.env` nicht** → Cutover-Verhalten bewusst wählen: `.env` einmalig aus Vault neu schreiben, dabei sicherstellen, dass die Werte identisch zum Ist sind (kein Bruch). Danach ist der Vault die Quelle der Wahrheit.
- **Vault-Passwort geht verloren** → ohne Passwort sind die Secrets nicht entschlüsselbar; Passwortdatei sicher außerhalb Git sichern (Passwortmanager). Bewusst kein Klartext-Fallback.
- **Nicht in dieser Umgebung end-to-end verifizierbar** (echter Server/SSH) → Abnahme per Checkliste auf dem Prod-Server, nicht über Tests.

## Migration Plan

1. Vault + `ansible.cfg` + `.gitignore`-Eintrag anlegen; reale Prod-Secrets aus `/opt/proudig/.env` in `vault.yml` übernehmen.
2. `all.yml`-Defaults entfernen, `env.j2` aus Vault rendern.
3. Trockenlauf (`--check`/Diff) gegen Prod; `.env`-Werte müssen identisch zum Ist sein.
4. Realer Ansible-Deploy; App-Health + DB-Verbindung + Website prüfen (Parität beweisen).
5. `deploy.sh` auf Ops-Wrapper zurückbauen.
6. Rollback: bestehende `.env` und vorheriges Image (`proudig-app:previous`) wiederherstellen.

Folge-Cleanup (separat, `nextcloud-p0-infrastructure`): dessen Doku (`.env.example`, README-NextCloud-Abschnitt) von der alten `deploy.sh`-`openssl`-Generierung auf Vault umschreiben. Die Secret-Verwaltung selbst ist bereits hier erledigt.

## Open Questions

- Wird die Vault-Passwortdatei zusätzlich zentral gesichert (Passwortmanager/anderer Kanal), damit DR möglich bleibt?
- Bleibt der Ansible-`rollback`-Tag die primäre Rollback-Methode, oder weiterhin `deploy.sh --rollback`?

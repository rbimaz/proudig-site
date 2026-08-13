# ProuDig — Server-Migration (Runbook)

Vollständiger Umzug des Produktions-Servers auf einen neuen Server. Überträgt
die beiden einzigen zustandsbehafteten Datenbestände — **PostgreSQL `proudigdb`**
und die **Uploads unter `data/files/`** — so, dass sich hinterher **jeder
Benutzer unverändert anmeldet und alle seine Daten sieht, ohne selbst etwas zu
tun**.

Tooling: Ansible (`migrate.yml` + `inventory.migration.yml`). Strategie:
**Big-Bang-Cutover** mit kurzer geplanter Downtime, direkter Transfer alt→neu.

> **Voraussetzung:** Vault-basierter Deploy (Change
> `deploy-ansible-vault-migration`). Der neue Server rendert dieselbe `.env` aus
> **demselben Ansible Vault** wie der alte → das Passwort der frisch
> initialisierten `proudig`-Rolle stimmt mit den migrierten Daten überein
> (DB-Passwort-Parität). Ohne diese Parität startet die App nicht.

---

## 0. Vorbereitung

1. **Neuen Server** provisionieren und im Setup grundinstallieren:
   ```bash
   # inventory.migration.yml: OLD_SERVER_IP / NEW_SERVER_IP eintragen
   ansible-playbook -i inventory.migration.yml migrate.yml --limit target --tags setup
   # (Docker etc. — nutzt die regulären Setup-Tasks; alternativ inventory.yml)
   ```
   > Hinweis: `--tags setup` gehört zum regulären `playbook.yml`. Für das
   > Grund-Setup des Ziel-Servers `playbook.yml` mit einem auf den neuen Server
   > zeigenden Inventar verwenden. `migrate.yml` selbst deckt Export/Transfer/
   > Import/Verify ab.

2. **SSH-Erreichbarkeit alt→neu** sicherstellen (für den direkten Transfer).
   Am einfachsten via Agent-Forwarding:
   ```bash
   ssh-add ~/.ssh/instance1.pem ~/.ssh/instance2.pem
   ```

3. **DNS-TTL senken** (z. B. auf 300 s) für `proudig.ai`, damit die Umstellung
   später schnell greift.

4. **Probelauf (empfohlen):** Export ohne Freeze + Transfer + Import + Verify auf
   den neuen Server, um den Ablauf zu testen (die Live-Site bleibt online):
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml \
     --tags export -e freeze_app=false
   ansible-playbook -i inventory.migration.yml migrate.yml \
     --tags transfer -e ansible_ssh_extra_args='-o ForwardAgent=yes'
   ansible-playbook -i inventory.migration.yml migrate.yml --tags import,verify
   ```
   Danach das Ziel-Volume wieder leeren, um den echten Cutover sauber zu starten:
   ```bash
   ssh <neu> 'cd /opt/proudig && docker compose down && docker volume rm proudig-pgdata'
   ```

---

## 1. Cutover (Wartungsfenster)

Reihenfolge strikt einhalten:

1. **Wartungsfenster ankündigen.**

2. **Finaler Export (mit Freeze).** Stoppt `proudig-app` auf dem alten Server
   (keine Schreibzugriffe mehr), dumpt DB + Dateien, schreibt `MANIFEST`:
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml --tags export
   ```
   → ab hier ist die alte Site offline (Downtime-Start).

3. **Transfer** direkt alt→neu:
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml \
     --tags transfer -e ansible_ssh_extra_args='-o ForwardAgent=yes'
   ```

4. **Import + Verify** auf dem neuen Server (Restore DB + Dateien, Deploy aus
   Vault, Paritätsprüfung):
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml --tags import,verify
   ```
   Optionaler automatischer Test-Login (bekannter Account):
   ```bash
   ... --tags verify -e verify_login_email=admin@proudig.de -e verify_login_password=…
   ```

5. **DNS umstellen:** A-Record `proudig.ai` → neue Server-IP.
   (`files.` / `auth.` bleiben geparkt — NextCloud/Keycloak sind nicht aktiv.)
   Caddy holt auf dem neuen Server automatisch neue TLS-Zertifikate.

6. **Beobachten:** Nach DNS-Durchlauf einige echte Logins/Downloads prüfen.

---

## 2. Verifikations-Checkliste (automatisch via `--tags verify`)

- [ ] App-Container `healthy`.
- [ ] DB-Zeilenzahlen `users` / `documents` / `folders` == `MANIFEST`.
- [ ] Beispiel-Dokument existiert unter `data/files/`.
- [ ] (optional) Test-Login liefert HTTP 200.
- [ ] Manuell: echter Benutzer meldet sich an und sieht seine Ordner/Freigaben.

---

## 3. Rollback

- **Vor der DNS-Umstellung:** trivial — alten `proudig-app` wieder starten:
  ```bash
  ssh <alt> 'cd /opt/proudig && docker compose start proudig-app'
  ```
  Der alte Server ist unangetastet (nur App gestoppt) → kein Datenverlust.

- **Nach der DNS-Umstellung:** A-Record wieder auf die alte IP zeigen, alten
  `proudig-app` starten. Wegen niedriger TTL schnell wirksam.

- **Neuer Server fehlerhaft:** Ziel verwerfen und neu importieren:
  ```bash
  ssh <neu> 'cd /opt/proudig && docker compose down && docker volume rm proudig-pgdata'
  ansible-playbook -i inventory.migration.yml migrate.yml --tags import,verify
  ```

---

## 4. Abschluss

- Erst **nach bestätigtem Betrieb** auf dem neuen Server den alten Server
  stilllegen (nicht automatisiert — bewusste Ops-Entscheidung).
- DNS-TTL wieder auf den regulären Wert anheben.
- Migrations-Bundles (`{{ migration_dir }}/…`, Default `/opt/proudig-migration/`)
  auf beiden Servern nach dem Umzug aufräumen (enthalten einen DB-Dump).

---

## Parameter (Überschreiben via `-e`)

| Variable | Default | Zweck |
|---|---|---|
| `migration_dir` | `/opt/proudig-migration` | Ablage der Bundles |
| `db_name` | `proudigdb` | Datenbankname |
| `freeze_app` | `true` | `false` für Probelauf im Live-Betrieb |
| `force_import` | `false` | Versions-/Volume-Guards übergehen (Vorsicht) |
| `verify_login_email` / `verify_login_password` | — | optionaler Test-Login in `verify` |

## Risiken (Kurzfassung)

- **DB-Passwort-Divergenz** → App-Start scheitert. *Schutz:* gemeinsamer Vault
  (Voraussetzung `deploy-ansible-vault-migration`).
- **Versions-Mismatch** (Deploy ≠ gedumptes Schema) → Liquibase-Konflikt.
  *Schutz:* `source_git` im MANIFEST, Import bricht bei Abweichung ab.
- **Schreibzugriff während Export** → inkonsistenter Dump. *Schutz:* Freeze.
- **Belegtes Ziel-Volume** → Restore-Konflikt. *Schutz:* Volume-Guard beim Import.

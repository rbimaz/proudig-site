# ProuDig — Server-Migration (Runbook)

Vollständiger Umzug des Produktions-Servers auf einen neuen Server. Überträgt
die beiden einzigen zustandsbehafteten Datenbestände — **PostgreSQL `proudigdb`**
und die **Uploads unter `data/files/`** — so, dass sich hinterher **jeder
Benutzer unverändert anmeldet und alle seine Daten sieht, ohne selbst etwas zu
tun**.

Tooling: Ansible (`migrate.yml` + `inventory.migration.yml`). Strategie:
**Big-Bang-Cutover ohne Downtime**, direkter Transfer alt→neu. Die alte Site
bleibt bis zur DNS-Umstellung online; die Schreibruhe während Export/Transfer
wird **organisatorisch** sichergestellt (Anwender informiert, keine Uploads/
Speicherungen), nicht durch einen technischen App-Stop.

> **Voraussetzung:** Vault-basierter Deploy (Change
> `deploy-ansible-vault-migration`). Der neue Server rendert dieselbe `.env` aus
> **demselben Ansible Vault** wie der alte → das Passwort der frisch
> initialisierten `proudig`-Rolle stimmt mit den migrierten Daten überein
> (DB-Passwort-Parität). Ohne diese Parität startet die App nicht.

---

## 0. Vorbereitung

1. **Neuen Server** provisionieren und grundinstallieren (Docker, Docker-Gruppe,
   Firewall, Verzeichnisse). `setup` steckt im regulären `playbook.yml`:
   ```bash
   # inventory.migration.yml: IPs, ansible_user + SSH-Key je Host eintragen.
   # Ziel-Server ist i.d.R. ein non-root-Cloud-User (z.B. 'ubuntu') mit sudo;
   # Root-SSH ist bei Cloud-Images oft gesperrt.
   ansible-playbook -i inventory.migration.yml playbook.yml --limit proudig-new --tags setup
   ```
   > Dieser Schritt installiert Docker und fügt den Deploy-User der `docker`-Gruppe
   > hinzu. **Die Gruppenmitgliedschaft greift erst bei einer NEUEN SSH-Session** —
   > die folgenden Schritte daher als separaten Aufruf starten (nicht im selben
   > Lauf), und beim ersten Folgeaufruf `-o ControlPath=none` erzwingen (s.u.),
   > damit nicht die alte, gecachte Verbindung ohne `docker`-Gruppe wiederverwendet
   > wird. `migrate.yml` selbst deckt nur Export/Transfer/Import/Verify ab.

2. **SSH-Erreichbarkeit alt→neu** sicherstellen (für den direkten Transfer).
   Am einfachsten via Agent-Forwarding:
   ```bash
   ssh-add ~/.ssh/instance1.pem ~/.ssh/KeyPairProudigHomePage.pem
   ```

3. **DNS-TTL senken** (z. B. auf 300 s) für `proudig.ai`, damit die Umstellung
   später schnell greift.

4. **Probelauf (empfohlen):** Export ohne Freeze + Transfer + Import + Verify auf
   den neuen Server, um den Ablauf zu testen (die Live-Site bleibt online):
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml \
     --tags export -e freeze_app=false
   
   ansible-playbook -i inventory.migration.yml migrate.yml --tags transfer \                                                                                         
    -e '{"ansible_ssh_extra_args":"-o ForwardAgent=yes"}'   
   
   ansible-playbook -i inventory.migration.yml migrate.yml --tags import,verify \
     -e '{"ansible_ssh_extra_args":"-o ControlPath=none"}'
   ```
   > `ControlPath=none` = frische SSH-Verbindung, nötig direkt nach `setup`, damit
   > der Deploy-User die neue `docker`-Gruppe hat (sonst "permission denied
   > /var/run/docker.sock" beim ersten `docker compose`).

   Danach das Ziel-Volume wieder leeren, um den echten Cutover sauber zu starten
   (Compose präfixt den Namen mit dem Projekt → `proudig_proudig-pgdata`):
   ```bash
   ssh <neu> 'cd /opt/proudig && docker compose down && docker volume rm proudig_proudig-pgdata'
   ```

---

## 1. Cutover (Wartungsfenster)

Reihenfolge strikt einhalten:

1. **Wartungsfenster ankündigen.**

2. **Finaler Export (ohne Freeze).** `proudig-app` bleibt laufen, die alte Site
   bleibt **online** — dumpt DB + Dateien, schreibt `MANIFEST`:
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml --tags export -e freeze_app=false
   ```
   > **Konsistenz ist jetzt organisatorisch, nicht technisch:** Ohne Freeze gibt
   > es keinen Schreibschutz. Voraussetzung ist, dass die Anwender informiert sind
   > und ab jetzt bis zur DNS-Umstellung **nichts mehr speichern/hochladen**.
   > Schreibzugriffe während Export/Transfer landen sonst nicht auf dem neuen
   > Server. Keine Downtime der alten Site.

3. **Transfer** direkt alt→neu:
   ```bash
   ansible-playbook -i inventory.migration.yml migrate.yml \
     --tags transfer -e '{"ansible_ssh_extra_args":"-o ForwardAgent=yes"}'
   ```
   > Agent vorher laden: `ssh-add ~/.ssh/instance1.pem ~/.ssh/KeyPairProudigHomePage.pem`.

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
- [ ] Dateianzahl auf der Platte (`data/files/`) == Bundle (`files.tgz`).
- [ ] (optional) Test-Login liefert HTTP 200.
- [ ] Manuell: echter Benutzer meldet sich an und sieht seine Ordner/Freigaben.

---

## 3. Rollback

- **Vor der DNS-Umstellung:** trivial — es gibt nichts zurückzurollen. Ohne
  Freeze läuft die alte Site unverändert weiter; einfach die DNS **nicht**
  umstellen. Der alte Server ist unangetastet → kein Datenverlust.

- **Nach der DNS-Umstellung:** A-Record wieder auf die alte IP zeigen, alten
  `proudig-app` starten. Wegen niedriger TTL schnell wirksam.

- **Neuer Server fehlerhaft:** Ziel verwerfen und neu importieren:
  ```bash
  ssh <neu> 'cd /opt/proudig && docker compose down && docker volume rm proudig_proudig-pgdata'
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
| `freeze_app` | `true` | `false` = kein App-Stop (Probelauf **und** Cutover ohne Downtime); Schreibruhe dann organisatorisch |
| `force_import` | `false` | Versions-/Volume-Guards übergehen (Vorsicht) |
| `verify_login_email` / `verify_login_password` | — | optionaler Test-Login in `verify` |

## Risiken (Kurzfassung)

- **DB-Passwort-Divergenz** → App-Start scheitert. *Schutz:* gemeinsamer Vault
  (Voraussetzung `deploy-ansible-vault-migration`).
- **Versions-Mismatch** (Deploy ≠ gedumptes Schema) → Liquibase-Konflikt.
  *Schutz:* `source_git` im MANIFEST, Import bricht bei Abweichung ab.
- **Schreibzugriff während Export/Transfer** → geht verloren (landet nicht auf
  dem neuen Server) bzw. macht den Dump inkonsistent. *Schutz:* organisatorische
  Schreibruhe (Anwender informiert) — da bewusst **ohne** Freeze gefahren wird.
  Technischer Freeze optional via `-e freeze_app=true`.
- **Belegtes Ziel-Volume** → Restore-Konflikt. *Schutz:* Volume-Guard beim Import.

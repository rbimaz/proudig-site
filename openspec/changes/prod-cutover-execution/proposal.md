## Why

Das Migrations-Werkzeug für den Umzug auf einen neuen Produktions-Server ist
fertig gebaut (Changes `prod-server-migration` und `deploy-ansible-vault-migration`:
Ansible `migrate.yml` mit Tags `export`/`transfer`/`import`/`verify`,
`MIGRATION-RUNBOOK.md`, `CUTOVER.md`). Was fehlt, ist die **tatsächliche,
nachvollziehbare Durchführung** auf den echten Servern — mit echten Prod-Secrets,
Probelauf, Wartungsfenster, DNS-Umstellung und Stilllegung des alten Servers.
Dieser Change macht diese Durchführung zu einer verifizierbaren, schrittweise
abhakbaren Checkliste.

## What Changes

- **Keine** neue Automatisierung und **kein** Umbau des bestehenden Toolings —
  dieser Change *nutzt* `migrate.yml`/`playbook.yml` und die Runbooks unverändert.
- **Zielserver bereitstellen**: neuen Server provisionieren und per
  `playbook.yml --tags setup` (Docker etc.) grundinstallieren.
- **Vault mit echten Prod-Werten befüllen**: `group_vars/all/vault.yml` mit den
  tatsächlichen Produktionswerten füllen. **Kritisch:** `vault_db_password` muss
  **exakt** dem aktuell laufenden Prod-Wert entsprechen (DB-Passwort-Parität —
  sonst startet die App auf dem neuen Server nicht). Vault-Passwort sicher ablegen.
- **Probelauf (Dry-Run)** auf dem echten Zielserver: `export` ohne Freeze
  (`freeze_app=false`) → `transfer` → `import,verify`, während die Live-Site online
  bleibt; anschließend Ziel-Volume wieder leeren.
- **DNS vorbereiten**: TTL für `proudig.ai` rechtzeitig senken.
- **Echter Big-Bang-Cutover** im Wartungsfenster: Ankündigung → Freeze+Export →
  Transfer → Import+Verify → DNS A-Record auf neue IP → Beobachtung echter
  Logins/Downloads.
- **Rollback-Readiness** vor Start geprüft und griffbereit (vor DNS: alten
  `proudig-app` wieder starten; nach DNS: A-Record zurückzeigen).
- **Abschluss**: Betrieb bestätigen, DNS-TTL zurücksetzen, Migrations-Bundles
  (enthalten einen DB-Dump!) auf beiden Servern aufräumen, Alt-Server erst nach
  Bestätigung stilllegen, kurzer Durchführungs-/Lessons-Learned-Vermerk.

## Capabilities

### New Capabilities
<!-- Keine. Dieser Change führt eine bestehende Fähigkeit (server-migration)
     operativ aus; er führt kein neues Software-Verhalten und keine neuen
     Requirements ein. -->

### Modified Capabilities
<!-- Keine. Das Anwendungs- und Tooling-Verhalten bleibt unverändert; es wird nur
     ausgeführt. Daher skip_specs: true in .openspec.yaml. -->

## Impact

- **Rein operativ/manuell** durch den Betreiber: SSH-Zugänge, echte Prod-Secrets
  und DNS-Panel sind erforderlich — nichts davon ist Teil des Repos und nichts
  wird neu automatisiert.
- **Berührte Artefakte (nur lesend/ausführend)**: `deploy/ansible/migrate.yml`,
  `deploy/ansible/playbook.yml`, `inventory.migration.yml`,
  `group_vars/all/vault.yml`, `MIGRATION-RUNBOOK.md`, `CUTOVER.md`.
- **Abhängigkeiten**: `prod-server-migration` (liefert das Migrations-Tooling) und
  `deploy-ansible-vault-migration` (Vault-gerenderte `.env`, DB-Passwort-Parität)
  müssen vorhanden/deployt sein.
- **Kein** Anwendungscode (Backend/Frontend), **kein** Schema-/Liquibase-Change,
  **kein** Umbau von `docker-compose.yml`.
- **Nicht betroffen**: geparkte NextCloud/Keycloak-Dienste (`profile: future`);
  Caddy-TLS wird auf dem neuen Server automatisch neu ausgestellt.

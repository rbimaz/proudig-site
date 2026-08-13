## Why

Der aktuelle Produktions-Server soll durch einen neuen ersetzt werden. Alle
Fachdaten (Benutzerkonten inkl. Passwörter, Ordner, Dokumente, Freigaben,
Gruppen, CMS-Inhalte) müssen vollständig auf den neuen Server übertragen werden,
sodass **jeder Benutzer sich danach unverändert anmeldet und auf alle seine
Daten zugreift — ohne selbst etwas tun zu müssen**. Heute existiert nur ein
DB-Backup (`deploy.sh --backup`), aber kein vollständiges, wiederholbares
Migrations-Werkzeug (Dateien fehlen, kein automatisierter Import).

## What Changes

- **Neues Ansible-Migrations-Tooling** unter `deploy/ansible/` mit den Tags
  `export` (alter Server) und `import` (neuer Server), das die beiden einzigen
  zustandsbehafteten Datenbestände überträgt:
  1. **PostgreSQL `proudigdb`** (`proudig-pgdata`-Volume) — enthält alle
     Fachdaten inkl. BCrypt-Passwörter und Liquibase-Changelog.
  2. **Hochgeladene Dateien** (`data/files/`-Bind-Mount) — die eigentlichen
     Dokument-/Media-Binärdateien.
- **Export**: `pg_dump` der Datenbank + `tar`-Archiv von `data/files/` auf dem
  alten Server, in ein zeitgestempeltes Migrations-Bundle.
- **Transfer**: direkt Server→Server (SSH/rsync), kein Umweg über Dritt-Systeme.
- **Import**: Restore des Dumps in eine frische `proudig-db` + Entpacken von
  `data/files/` auf dem neuen Server, anschließend regulärer Ansible-Deploy
  (rendert dieselbe `.env` aus dem **Vault** → DB-Passwort-Parität).
- **Big-Bang-Cutover mit kurzer geplanter Downtime**: alten `proudig-app`
  einfrieren (stoppen) → finaler Export → Import → DNS-Umstellung → Verifikation.
- **Verifikations-Checkliste** als Bestandteil des Tooling-Laufs: App healthy,
  DB-Zeilenzahlen (Benutzer/Dokumente) stimmen überein, Beispiel-Dokument
  herunterladbar, Test-Login erfolgreich.
- **Doku**: Migrations-Runbook (`deploy/ansible/`), erweitert um Freeze,
  Transfer, Restore, Cutover, Rollback und Alt-Server-Stilllegung.

## Capabilities

### New Capabilities
- `server-migration`: Wiederholbares Ansible-Tooling zur vollständigen Übertragung
  aller Produktionsdaten (PostgreSQL + `data/files/`) von einem Server auf einen
  neuen — mit garantierter Datenparität, DB-Passwort-Parität über den Vault und
  ohne jeglichen Benutzer-Eingriff.

### Modified Capabilities
<!-- Keine bestehende Capability ändert ihre Requirements. Das Anwendungsverhalten
     (Auth, Portal, CMS) bleibt unverändert; nur Deployment-/Betriebs-Mechanik
     kommt hinzu. -->

## Impact

- **Neu** unter `deploy/ansible/`: Migrations-Playbook/Tasks (Tags `export`/
  `import`), Templates für Bundle-Erstellung/Restore, Runbook.
- **Berührt** die bestehende Ansible-Deploy-Kette (`roles/proudig/tasks/`,
  `env.j2`, Vault): der Import endet mit einem normalen Deploy; **Voraussetzung**
  ist der Vault-basierte Deploy aus Change `deploy-ansible-vault-migration`
  (DB-Passwort-Parität).
- **Kein** Anwendungscode (Backend/Frontend), **kein** Schema-/Liquibase-Change,
  **kein** Umbau von `docker-compose.yml`.
- **Nicht betroffen**: geparkte NextCloud/Keycloak-Volumes (`profile: future`),
  Caddy-TLS-Zertifikate (werden auf dem neuen Server automatisch neu ausgestellt).

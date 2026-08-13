## 1. Export-Tooling (Quell-Server)

- [x] 1.1 Ansible-Tag `export` in `deploy/ansible/` anlegen (eigenes Playbook oder Tag-gebundene Tasks unter `roles/proudig/tasks/`).
- [x] 1.2 `proudig-app` auf dem Quell-Server stoppen (Freeze), `proudig-db` weiterlaufen lassen → verify: `docker ps` zeigt db up, app down.
- [x] 1.3 `pg_dump -U proudig proudigdb` als `db.sql` erzeugen (Plain-SQL inkl. `databasechangelog`).
- [x] 1.4 `tar czf files.tgz` von `data/files/` mit relativen Pfaden.
- [x] 1.5 `MANIFEST` schreiben: Quell-Host, Zeitstempel, App-Commit/Image-Tag, Zeilenzahlen users/documents/folders (via `psql -c "select count(*)"`).
- [x] 1.6 Bundle als zeitgestempeltes Verzeichnis `proudig-migration-<ts>/` ablegen → verify: alle drei Artefakte vorhanden.

## 2. Transfer (Server→Server)

- [x] 2.1 Direkten Transfer alt→neu per `synchronize`/`rsync` über SSH implementieren (Agent-Forwarding oder temporärer Deploy-Key).
- [x] 2.2 Integritätsprüfung nach Transfer (Größen-/Prüfsummenvergleich des Bundles) → verify: Bundle auf Ziel identisch.

## 3. Import-Tooling (Ziel-Server)

- [x] 3.1 Ansible-Tag `import` anlegen; als Voraussetzung die Vault-gerenderte `.env` sicherstellen (Abhängigkeit `deploy-ansible-vault-migration`).
- [x] 3.2 Leere des Ziel-`proudig-pgdata`-Volumes prüfen; bei Belegung abbrechen → verify: Abbruch-Pfad greift.
- [x] 3.3 Frische `proudig-db` starten und `db.sql` per `psql -U proudig -d proudigdb` einspielen → verify: Restore ohne Fehler.
- [x] 3.4 `files.tgz` nach `data/files/` entpacken und Ownership/Permissions für den `proudig-app`-Container setzen → verify: Container liest Dateien.
- [x] 3.5 App-Version aus `MANIFEST` gegen zu deployende Version prüfen; bei Abweichung warnen/abbrechen.
- [x] 3.6 Regulären Ansible-Deploy anstoßen (rendert `.env` aus Vault) → verify: App startet, keine erneute Liquibase-Migration.

## 4. Paritäts-Verifikation

- [x] 4.1 Health-Endpoint prüfen (`200`).
- [x] 4.2 DB-Zeilenzahlen users/documents/folders gegen `MANIFEST` vergleichen → verify: Gleichstand.
- [x] 4.3 Beispiel-Dokument-Download testen (Datei existiert unter `data/files/`).
- [x] 4.4 Test-Login mit bekanntem Account → verify: gültiges Token.
- [x] 4.5 Ergebnisse gesammelt im Lauf-Log ausgeben; bei Fehlschlag deutlich melden.

## 5. Cutover & Rollback

- [x] 5.1 DNS-Vorbereitung dokumentieren (TTL vor dem Fenster senken).
- [x] 5.2 Rollback-Pfad implementieren/dokumentieren: vor DNS-Umstellung alten `proudig-app` wieder starten; nach Umstellung DNS zurückzeigen.
- [x] 5.3 Stilllegung des alten Servers erst nach Bestätigung (nicht automatisiert).

## 6. Dokumentation

- [x] 6.1 Migrations-Runbook unter `deploy/ansible/` schreiben: Probelauf, Wartungsfenster, Freeze, Export, Transfer, Import, Verifikation, DNS-Umstellung, Rollback, Stilllegung.
- [x] 6.2 Verweis auf Abhängigkeit `deploy-ansible-vault-migration` (Vault/`.env`, DB-Passwort-Parität) aufnehmen.
- [x] 6.3 `deploy/README.md` / `readme-deployment-docker.md` um die neuen Tags `export`/`import` ergänzen.

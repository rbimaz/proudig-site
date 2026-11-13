## 1. Zielserver bereitstellen

- [ ] 1.1 Neuen Server provisionieren (Hoster/VM, OS, SSH-Zugang) → verify: `ssh <neu>` gelingt als Deploy-User.
- [ ] 1.2 `inventory.migration.yml` mit OLD_SERVER_IP (source) und NEW_SERVER_IP (target) füllen → verify: `ansible -i inventory.migration.yml target -m ping` liefert `pong`.
- [ ] 1.3 Grund-Setup auf dem Ziel: `ansible-playbook -i <ziel-inventar> playbook.yml --tags setup` → verify: `ssh <neu> 'docker --version && docker compose version'` erfolgreich.
- [ ] 1.4 SSH-Erreichbarkeit source→target für den Direkt-Transfer sicherstellen (Agent-Forwarding: `ssh-add <alt-key> <neu-key>`) → verify: vom alten Server aus `ssh <neu> true` gelingt.

## 2. Vault mit echten Prod-Werten kalibrieren

- [ ] 2.1 Tatsächlichen Prod-DB-Wert vom laufenden alten Server auslesen (`/opt/proudig/.env` → `DB_PASSWORD`/`POSTGRES_PASSWORD`) → verify: Wert notiert, sicher abgelegt.
- [ ] 2.2 `group_vars/all/vault.yml` befüllen; `vault_db_password` EXAKT auf den Prod-Wert aus 2.1 setzen, übrige Secrets (preview/keycloak/nextcloud) auf starke Werte → verify: `ansible-vault view group_vars/all/vault.yml` zeigt die erwarteten Keys.
- [ ] 2.3 Vault-Passwortdatei (`~/.proudig-vault-pass`, 0600) anlegen und zusätzlich im Passwortmanager sichern → verify: `ansible-vault view` ohne interaktive Passwortabfrage möglich.

## 3. Probelauf (Dry-Run) gegen den echten Zielserver

- [ ] 3.1 Export ohne Freeze: `ansible-playbook -i inventory.migration.yml migrate.yml --tags export -e freeze_app=false` → verify: Live-Site bleibt online; Bundle (`db.sql`, `files.tgz`, `MANIFEST`, `SHA256SUMS`) auf dem alten Server vorhanden.
- [ ] 3.2 Transfer: `... migrate.yml --tags transfer -e ansible_ssh_extra_args='-o ForwardAgent=yes'` → verify: Bundle auf dem Zielserver identisch (Prüfsummen stimmen).
- [ ] 3.3 Import + Verify: `... migrate.yml --tags import,verify` → verify: `verify` grün — App healthy, Zeilenzahlen users/documents/folders == MANIFEST, Beispiel-Download ok.
- [ ] 3.4 **Paritätsbeweis**: App startet auf dem Ziel mit den migrierten Daten (bestätigt DB-Passwort-Parität aus Schritt 2.2) → verify: Health-Endpoint `200`, optionaler Test-Login liefert Token.
- [ ] 3.5 Ziel-Volume nach dem Dry-Run leeren: `ssh <neu> 'cd /opt/proudig && docker compose down && docker volume rm proudig-pgdata'` → verify: Volume existiert nicht mehr (`docker volume ls` ohne `proudig-pgdata`).

## 4. Cutover-Vorbereitung

- [ ] 4.1 DNS-TTL für `proudig.ai` senken (z. B. 300 s), mind. eine alte TTL-Periode vor dem Fenster → verify: `dig +nocmd proudig.ai a +noall +answer` zeigt die neue TTL.
- [ ] 4.2 Versions-Gleichstand prüfen: zu deployende App-Version == `source_git` im (erwarteten) MANIFEST → verify: Git-Checkout des Ziel-Deploys entspricht dem Prod-Stand des alten Servers.
- [ ] 4.3 Wartungsfenster festlegen und Benutzer ankündigen → verify: Ankündigung versendet/veröffentlicht.
- [ ] 4.4 Rollback-Kommandos bereitlegen und durchgehen (vor DNS: `ssh <alt> 'cd /opt/proudig && docker compose start proudig-app'`; nach DNS: A-Record zurück auf alte IP) → verify: beide Kommandopfade dokumentiert und griffbereit.

## 5. Echter Big-Bang-Cutover (Wartungsfenster)

- [ ] 5.1 Wartungsfenster starten und ankündigen → verify: Hinweis aktiv.
- [ ] 5.2 Finaler Export mit Freeze: `ansible-playbook -i inventory.migration.yml migrate.yml --tags export` (stoppt `proudig-app` alt, dumpt DB+Dateien) → verify: alte Site offline (Downtime-Start), Bundle vollständig.
- [ ] 5.3 Transfer alt→neu: `... migrate.yml --tags transfer -e ansible_ssh_extra_args='-o ForwardAgent=yes'` → verify: Bundle-Prüfsummen auf dem Ziel stimmen.
- [ ] 5.4 Import + Verify: `... migrate.yml --tags import,verify` (optional `-e verify_login_email=… -e verify_login_password=…`) → verify: alle Verify-Checks grün (healthy, Zeilenzahl-Parität, Download, Test-Login).
- [ ] 5.5 DNS umstellen: A-Record `proudig.ai` → neue Server-IP → verify: `dig proudig.ai a` liefert die neue IP; Caddy stellt TLS automatisch aus (HTTPS erreichbar).
- [ ] 5.6 Beobachtung: echte Logins/Downloads nach DNS-Durchlauf prüfen; ein realer Benutzer sieht seine Ordner/Freigaben → verify: manueller End-to-End-Login erfolgreich.

## 6. Abschluss

- [ ] 6.1 Betrieb auf dem neuen Server über eine Beobachtungsphase bestätigen (Logs/Health/Benutzer-Feedback) → verify: keine kritischen Fehler im App-Log, Health dauerhaft `200`.
- [ ] 6.2 DNS-TTL wieder auf den regulären Wert anheben → verify: `dig proudig.ai a` zeigt die reguläre TTL.
- [ ] 6.3 Migrations-Bundles auf BEIDEN Servern löschen (enthalten DB-Dump) → verify: `migration_dir` (Default `/opt/proudig-migration/`) auf alt und neu leer.
- [ ] 6.4 Alten Server erst nach bestätigtem Betrieb stilllegen (manuelle Ops-Entscheidung) → verify: Abschaltung dokumentiert, keine Rückfall-Abhängigkeit mehr nötig.
- [ ] 6.5 Kurzer Durchführungs-/Lessons-Learned-Vermerk schreiben (Zeitpunkt, Downtime-Dauer, Auffälligkeiten) → verify: Vermerk in `deploy/ansible/` bzw. Change-Dokumentation abgelegt.

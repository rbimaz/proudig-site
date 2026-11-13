## Context

Siehe `proposal.md` — Why. Das Migrations-Tooling (`deploy/ansible/migrate.yml`
mit Tags `export`/`transfer`/`import`/`verify`) und die Runbooks
(`MIGRATION-RUNBOOK.md`, `CUTOVER.md`) sind fertig und getestet-dokumentiert, aber
noch nie gegen die echten Prod-Server mit echten Secrets gelaufen. Zwei einzige
zustandsbehaftete Datenbestände sind zu übertragen: PostgreSQL `proudigdb`
(Volume `proudig-pgdata`) und die Uploads unter `data/files/`.

Harte Randbedingung: Die frisch initialisierte `proudig`-DB-Rolle auf dem neuen
Server bekommt ihr Passwort aus `POSTGRES_PASSWORD` (gerendert aus dem Vault). Der
migrierte Dump enthält aber die Daten der *alten* Rolle. Nur wenn beide Passwörter
identisch sind, startet die App — deshalb ist **DB-Passwort-Parität** die zentrale
operative Vorbedingung, nicht ein Implementierungsdetail.

Die Durchführung selbst ist **manuell durch den Betreiber** (SSH, echte Secrets,
DNS-Panel). Dieser Change liefert die verifizierbare Reihenfolge und die
Abbruch-/Rollback-Kriterien, nicht neuen Code.

## Goals / Non-Goals

**Goals:**
- Einen einmaligen, nachvollziehbaren Produktions-Cutover auf den neuen Server
  durchführen, nach dem sich jeder Benutzer unverändert anmeldet und alle Daten
  sieht — ohne eigenen Aufwand.
- Jeden operativen Schritt an ein konkretes, beobachtbares Verifikationskriterium
  binden (App healthy, Zeilenzahl-Parität, Test-Login, echter Benutzer-Login).
- Downtime auf das Wartungsfenster (Freeze → Cutover → DNS) begrenzen und einen
  jederzeit greifbaren Rollback-Pfad bereithalten.

**Non-Goals:**
- Keine neue Automatisierung, kein Umbau von `migrate.yml`/`playbook.yml`/Compose.
- Keine Aktivierung der geparkten Dienste (NextCloud/Keycloak, `profile: future`).
- Keine automatisierte Stilllegung des Alt-Servers (bewusste manuelle Ops-
  Entscheidung nach bestätigtem Betrieb).
- Kein Null-Downtime-Verfahren — Big-Bang-Cutover mit kurzer geplanter Downtime
  ist akzeptiert (siehe `prod-server-migration`/design.md).

## Decisions

- **D1 — Vorab-Probelauf gegen den echten Zielserver (nicht nur Staging).**
  Der Dry-Run läuft mit `freeze_app=false` gegen den tatsächlichen neuen Server,
  während die Live-Site online bleibt, danach wird `proudig-pgdata` wieder
  geleert. *Warum:* deckt echte Umgebungsfehler (SSH, Vault-Rendering, Volume-
  Guards, Permissions) auf, bevor das Wartungsfenster läuft. *Alternative:*
  separater Staging-Server — verworfen, weil er Umgebungsunterschiede verstecken
  kann und zusätzliche Infrastruktur braucht.

- **D2 — DB-Passwort-Parität wird VOR dem Cutover explizit kalibriert und
  verifiziert.** Der tatsächliche Prod-Wert wird aus dem laufenden alten Server
  ausgelesen und als `vault_db_password` eingetragen; der erfolgreiche Dry-Run
  (App startet mit migrierten Daten) ist der Paritätsbeweis. *Warum:* häufigste
  und App-blockierende Fehlerquelle. *Alternative:* Passwort nach Import im Dump
  umschreiben — verworfen als fehleranfällig und gegen die Vault-Single-Source.

- **D3 — Reihenfolge strikt seriell, jeder Schritt mit Gate.** Kein Schritt
  startet, bevor der vorige verifiziert ist (Export vollständig → Transfer-
  Integrität → Import ohne Fehler → Verify grün → DNS). *Warum:* ein
  Big-Bang-Cutover verzeiht keine übersprungene Prüfung.

- **D4 — Rollback-Entscheidung an der DNS-Grenze.** Vor DNS-Umstellung ist
  Rollback trivial (alter Server unangetastet, nur App gestoppt → wieder
  starten). Nach DNS-Umstellung: A-Record zurück auf alte IP (schnell wirksam
  dank gesenkter TTL). *Warum:* klare, geprobte Umkehrpunkte statt Ad-hoc-
  Entscheidung unter Druck.

- **D5 — Durchführung bleibt manuell, Change = Checkliste.** Die Tasks bilden
  1:1 die Runbook-Schritte mit Verifikation ab; sie ersetzen das Runbook nicht,
  sondern verankern seine Ausführung prüfbar. *Warum:* SSH-Zugänge, echte
  Secrets und DNS sind außerhalb des Repos; Automatisierung hier brächte Risiko
  ohne Nutzen.

## Risks / Trade-offs

- **DB-Passwort-Divergenz → App startet nicht.** → Mitigation: D2 (Kalibrierung
  + Dry-Run als Paritätsbeweis vor dem echten Fenster).
- **Versions-Mismatch (deployte App ≠ gedumptes Schema) → Liquibase-Konflikt.**
  → Mitigation: `source_git` im MANIFEST; Import bricht bei Abweichung ab
  (Guard aus `prod-server-migration`). Vor Cutover Versions-Gleichstand prüfen.
- **Schreibzugriff während des finalen Exports → inkonsistenter Dump.** →
  Mitigation: Freeze (`freeze_app=true`) stoppt die App vor dem Dump.
- **DNS-Propagation langsamer als erwartet → verlängerte Mischphase.** →
  Mitigation: TTL rechtzeitig (≥ eine alte TTL-Periode vorher) senken; nach
  Umstellung aktiv beobachten.
- **Belegtes Ziel-Volume aus dem Dry-Run → Restore-Konflikt beim echten Lauf.**
  → Mitigation: Volume-Guard beim Import + explizites Leeren nach dem Dry-Run.
- **Migrations-Bundle enthält DB-Dump (Klartext-Fachdaten) → Datenabfluss.** →
  Mitigation: Bundles auf beiden Servern nach bestätigtem Betrieb löschen;
  Übertragung nur direkt Server→Server (kein Dritt-System).

## Context

Der Produktions-Server wird durch einen neuen ersetzt. Das laufende System ist
ein Docker-Monolith mit genau **zwei zustandsbehafteten Datenbeständen**:

1. **PostgreSQL `proudigdb`** im Docker-Volume `proudig-pgdata` — enthält alle
   Fachdaten: Benutzer (mit BCrypt-Hashes), Rollen, Ordner, Dokument-Metadaten,
   Ordner-/Dokument-Freigaben, Gruppen, CMS-Inhalte, News/Seminare/Angebote,
   Kontaktnachrichten, Activity-Log, Settings, externe Freigabe-Links sowie die
   Liquibase-`databasechangelog`-Tabelle.
2. **Hochgeladene Dateien** im Bind-Mount `./data/files` → `/app/data/files` —
   die eigentlichen Dokument-/Media-Binärdateien. Die DB referenziert sie über
   Storage-Pfade (`FileStorageService` → `fileStorageProperties.getLocation()`).

Alles Übrige ist zustandslos oder reproduzierbar: Die `.env`/Secrets werden aus
dem **Ansible Vault** gerendert; Caddy-TLS-Zertifikate holt der neue Server via
Let's Encrypt selbst; NextCloud/Keycloak-Volumes sind geparkt (`profile:
future`) und ungenutzt.

Bereits vorhanden: `deploy.sh --backup` macht heute `ssh host "docker exec
proudig-db pg_dump -U proudig proudigdb"`. Das ist die halbe Export-Seite —
**es fehlen die Dateien und ein automatisierter Import**.

Auth ist lokal (JWT + BCrypt in der `users`-Tabelle) — kein externes IdP.
Deshalb genügt die DB-Übernahme, damit sich alle Benutzer unverändert anmelden.

## Goals / Non-Goals

**Goals:**
- Vollständige, **beweisbare Datenparität** (DB + Dateien) vom alten auf den
  neuen Server.
- **Null Benutzer-Eingriff**: gleiche Logins, gleiche Dokumente, gleiche
  Freigaben nach dem Umzug.
- **Wiederholbares** Tooling in Ansible (Tags `export`/`import`), idempotent
  genug für Probeläufe.
- Klarer **Big-Bang-Cutover** mit definierter kurzer Downtime und Rollback.

**Non-Goals:**
- Kein In-App-Export/Import-Feature (keine Entitäts-Serialisierung nach JSON).
- Keine Near-Zero-Downtime-Replikation / logische Replikation.
- Kein Schema-/Liquibase-Change, kein Anwendungscode, kein `docker-compose.yml`-
  Umbau.
- Keine Migration der geparkten NextCloud/Keycloak-Volumes.
- Keine DB-Passwort-Rotation (Parität ist gewünscht).

## Decisions

### D1: Infrastruktur-Migration statt In-App-Feature
`pg_dump` + Datei-Archiv übertragen *alle* Entitäten samt Beziehungen/IDs/
Sequenzen robust und vollständig. Eine In-App-Serialisierung müsste FKs,
Auto-IDs und Storage-Pfade selbst konsistent halten — mehr Code, mehr Risiko,
identisches Ergebnis. **Gewählt: Infra.** (Alternative In-App verworfen.)

### D2: Bundle-Format
Ein zeitgestempeltes Verzeichnis/Tar `proudig-migration-<ts>/` mit:
- `db.sql` — `pg_dump -U proudig proudigdb` (Plain-SQL, inkl. `databasechangelog`).
- `files.tgz` — `tar czf` von `data/files/` (relative Pfade, damit
  Storage-Pfade portabel bleiben).
- `MANIFEST` — Quell-Host, Zeitstempel, App-Commit/Image-Tag, DB-Zeilenzahlen
  (users, documents, folders) für die spätere Paritätsprüfung.

### D3: Transfer direkt Server→Server
`rsync -a` (bzw. `scp`) direkt vom alten auf den neuen Server über SSH. Umsetzung
per Ansible `delegate_to`/`synchronize`; SSH-Erreichbarkeit alt→neu via
Agent-Forwarding oder temporärem Deploy-Key. Kein Umweg über die lokale Maschine
oder Objektspeicher (schneller, ein Schritt).

### D4: Restore in eine FRISCHE Datenbank + DB-Passwort-Parität
Der neue Server startet ein **leeres** `proudig-db` (frisches
`proudig-pgdata`-Volume). Postgres wendet `POSTGRES_PASSWORD` nur beim Erst-Init
an — da die `.env` auf beiden Servern aus **demselben Vault** gerendert wird, hat
die frische Rolle `proudig` dasselbe Passwort wie der Dump-Inhalt es erwartet.
Restore per `psql -U proudig -d proudigdb < db.sql`. **Voraussetzung: Change
`deploy-ansible-vault-migration`** (Vault-basierter `.env`-Render).

### D5: Liquibase — kein Re-Run
Der Dump enthält `databasechangelog` im aktuellen Stand. Die App auf dem neuen
Server sieht das Schema als bereits migriert → Liquibase führt nichts erneut aus.
**Bedingung:** Es wird derselbe App-Commit/Image-Tag deployt, der auf dem alten
Server läuft (im `MANIFEST` festgehalten und beim Import verifiziert).

### D6: Big-Bang-Cutover mit Freeze
Konsistenz ohne Delta-Sync: Vor dem finalen Export **`proudig-app` auf dem alten
Server stoppen** (`docker compose stop proudig-app`), `proudig-db` bleibt für den
Dump oben. Dadurch keine Schreibzugriffe während Dump/Kopie. Ablauf:
1. (Optional) Probelauf export→import auf den neuen Server, verifizieren.
2. Wartungsfenster ankündigen.
3. Alt: `proudig-app` stoppen (Freeze).
4. Alt: finaler `export` (db.sql + files.tgz + MANIFEST).
5. Transfer → Neu: `import` (Restore DB, Entpacken files, Deploy via Ansible).
6. Verifikation (siehe D7).
7. DNS auf neue Server-IP umstellen (proudig.ai; files./auth. bleiben geparkt).
8. Beobachten; alten Server erst nach Bestätigung stilllegen.

### D7: Verifikation als Teil des Laufs
Nach dem Import automatisiert prüfen und im Lauf-Log ausgeben:
- App-Health-Endpoint `200`.
- DB-Zeilenzahlen (users/documents/folders) == `MANIFEST`-Werte.
- Ein Beispiel-Dokument ist herunterladbar (Datei existiert unter `data/files/`).
- Ein Test-Login (bekannter Account) liefert ein Token.

### D8: Rollback
Solange DNS noch nicht umgestellt ist, ist Rollback trivial: alten `proudig-app`
wieder starten. Nach DNS-Umstellung: DNS zurückzeigen. Da der alte Server
unangetastet weiterläuft (nur App gestoppt, dann wieder startbar), gibt es keinen
Datenverlust-Pfad. Der neue Server wird bei Fehlschlag verworfen und neu
importiert.

## Risks / Trade-offs

- **DB-Passwort-Divergenz** (Rolle vs. `.env`) → App startet nicht. *Mitigation:*
  D4 — gemeinsamer Vault; Import bricht ab, wenn `.env` nicht aus dem Vault
  gerendert wurde (Abhängigkeit auf `deploy-ansible-vault-migration`).
- **Schema-/App-Versions-Mismatch** (neuer Deploy ≠ gedumptes Schema) → Liquibase
  will migrieren/scheitert. *Mitigation:* D5 — Commit/Tag im MANIFEST, Import
  verifiziert Gleichstand vor Deploy.
- **Schreibzugriffe während des Exports** → inkonsistenter Dump. *Mitigation:*
  D6 — App-Freeze vor finalem Export.
- **Nicht-leeres Ziel-Volume** (Import auf bereits benutztes `proudig-db`) →
  Restore-Konflikte. *Mitigation:* Import setzt frisches Volume voraus / prüft
  Leere und bricht sonst ab.
- **Storage-Pfad-Inkonsistenz** (unterschiedliche `location` alt/neu) → tote
  Datei-Referenzen. *Mitigation:* identischer Bind-Mount `./data/files` +
  relative Pfade im Tar; Verifikation lädt ein Beispiel-Dokument.
- **Datei-Rechte nach Entpacken** (Container-User kann nicht lesen) →
  Download-Fehler. *Mitigation:* Ownership/Permissions im Import-Task setzen.
- **DNS-TTL** verlängert die effektive Downtime. *Mitigation:* TTL vor dem
  Fenster senken.
- **Server-zu-Server-SSH nicht erlaubt** → D3 nicht durchführbar. *Mitigation:*
  Fallback über lokale Maschine dokumentieren (nicht Default).

## ADDED Requirements

### Requirement: Vollständiger Datenexport auf dem Quell-Server
Das Migrations-Tooling SHALL auf dem alten (Quell-)Server ein wiederholbares,
zeitgestempeltes Migrations-Bundle erzeugen, das **beide** zustandsbehafteten
Datenbestände enthält: einen vollständigen `pg_dump` der Datenbank `proudigdb`
(Plain-SQL inkl. `databasechangelog`) und ein `tar`-Archiv des Verzeichnisses
`data/files/` mit relativen Pfaden. Das Bundle SHALL ein `MANIFEST` mit
Quell-Host, Zeitstempel, deployter App-Version (Commit/Image-Tag) und den
DB-Zeilenzahlen für `users`, `documents` und `folders` enthalten.

#### Scenario: Bundle wird vollständig erzeugt
- **WHEN** der `export`-Tag gegen den Quell-Server ausgeführt wird
- **THEN** entsteht ein Bundle mit `db.sql`, `files.tgz` und `MANIFEST`
- **AND** `db.sql` enthält alle Tabellen inklusive `databasechangelog`
- **AND** `files.tgz` enthält den gesamten Inhalt von `data/files/` mit relativen Pfaden

#### Scenario: MANIFEST hält Paritäts-Referenzwerte fest
- **WHEN** das Bundle erzeugt wird
- **THEN** enthält `MANIFEST` die Zeilenzahlen von `users`, `documents` und `folders` zum Export-Zeitpunkt
- **AND** die deployte App-Version (Commit/Image-Tag) des Quell-Servers

### Requirement: Konsistenter Export durch App-Freeze
Vor dem finalen Export SHALL das Tooling den Anwendungs-Container `proudig-app`
auf dem Quell-Server stoppen, während `proudig-db` für den Dump weiterläuft,
sodass während Dump und Datei-Archivierung keine Schreibzugriffe erfolgen. Der
Freeze SHALL reversibel sein (App wieder startbar).

#### Scenario: App wird vor dem finalen Export eingefroren
- **WHEN** der finale Export im Cutover ausgeführt wird
- **THEN** ist `proudig-app` gestoppt, bevor `pg_dump` und `tar` laufen
- **AND** `proudig-db` bleibt für den Dump verfügbar

#### Scenario: Freeze ist umkehrbar (Rollback vor DNS-Umstellung)
- **WHEN** der Umzug vor der DNS-Umstellung abgebrochen wird
- **THEN** kann `proudig-app` auf dem Quell-Server wieder gestartet werden
- **AND** es sind keine Quelldaten verändert oder gelöscht worden

### Requirement: Direkter Transfer vom Quell- zum Ziel-Server
Das Tooling SHALL das Migrations-Bundle direkt vom Quell- zum Ziel-Server
übertragen (SSH/rsync), ohne Umweg über die lokale Maschine oder einen
Objektspeicher.

#### Scenario: Bundle wird direkt übertragen
- **WHEN** der Transfer-Schritt ausgeführt wird
- **THEN** liegt das vollständige Bundle auf dem Ziel-Server vor
- **AND** die Übertragung erfolgte direkt zwischen den beiden Servern

### Requirement: Restore in eine frische Datenbank mit Passwort-Parität
Das Tooling SHALL auf dem Ziel-Server eine **leere** `proudig-db` (frisches
`proudig-pgdata`-Volume) starten und `db.sql` hineinspielen. Die `.env` SHALL auf
dem Ziel-Server aus demselben Ansible Vault gerendert werden wie auf dem
Quell-Server, sodass das Passwort der frisch initialisierten Rolle `proudig` mit
den migrierten Daten übereinstimmt. Ist das Ziel-`proudig-pgdata`-Volume nicht
leer, SHALL der Import abbrechen.

#### Scenario: Restore in leeres Volume
- **WHEN** der `import`-Tag auf einem frischen Ziel-Server ausgeführt wird
- **THEN** wird `db.sql` vollständig in `proudigdb` eingespielt
- **AND** die App verbindet sich anschließend erfolgreich mit der Datenbank

#### Scenario: Abbruch bei bereits belegtem Ziel-Volume
- **WHEN** das Ziel-`proudig-pgdata`-Volume bereits Daten enthält
- **THEN** bricht der Import mit einer Fehlermeldung ab, ohne zu überschreiben

### Requirement: Wiederherstellung der hochgeladenen Dateien
Das Tooling SHALL `files.tgz` auf dem Ziel-Server nach `data/files/` entpacken und
Eigentümer/Berechtigungen so setzen, dass der Anwendungs-Container die Dateien
lesen kann.

#### Scenario: Dateien werden wiederhergestellt und sind lesbar
- **WHEN** der Import die Dateien entpackt
- **THEN** existiert der gesamte Inhalt von `data/files/` auf dem Ziel-Server
- **AND** die Datei-Berechtigungen erlauben dem `proudig-app`-Container den Lesezugriff

### Requirement: Kein erneuter Liquibase-Lauf durch Versions-Gleichstand
Der Import SHALL sicherstellen, dass auf dem Ziel-Server dieselbe App-Version
(Commit/Image-Tag) deployt wird, die im `MANIFEST` vermerkt ist, damit das aus
dem Dump wiederhergestellte Liquibase-Changelog dem deployten Schema entspricht
und keine erneute Migration ausgelöst wird. Bei Versions-Abweichung SHALL der
Import warnen bzw. abbrechen.

#### Scenario: Deploy mit passender Version
- **WHEN** der Import den regulären Ansible-Deploy anstößt
- **THEN** entspricht die deployte App-Version der im `MANIFEST` festgehaltenen
- **AND** Liquibase führt keine erneute Migration aus

#### Scenario: Versions-Abweichung wird erkannt
- **WHEN** die zu deployende App-Version von der `MANIFEST`-Version abweicht
- **THEN** meldet der Import die Abweichung und stoppt vor dem Deploy

### Requirement: Automatisierte Paritäts-Verifikation nach dem Import
Nach dem Import SHALL das Tooling die Datenparität automatisiert prüfen und das
Ergebnis im Lauf-Log ausgeben: Health-Endpoint der App liefert `200`, die
DB-Zeilenzahlen für `users`/`documents`/`folders` stimmen mit dem `MANIFEST`
überein, ein Beispiel-Dokument ist herunterladbar, und ein Test-Login liefert ein
gültiges Token.

#### Scenario: Verifikation bestätigt Parität
- **WHEN** der Import abgeschlossen ist
- **THEN** liefert der Health-Endpoint `200`
- **AND** die DB-Zeilenzahlen entsprechen den `MANIFEST`-Werten
- **AND** ein Beispiel-Dokument lässt sich herunterladen
- **AND** ein Test-Login liefert ein gültiges Token

#### Scenario: Verifikation schlägt fehl
- **WHEN** eine der Paritäts-Prüfungen fehlschlägt
- **THEN** meldet der Lauf den Fehler deutlich, sodass vor der DNS-Umstellung reagiert werden kann

### Requirement: Benutzerzugriff ohne manuellen Eingriff nach der Migration
Nach der Migration SHALL sich jeder Benutzer mit seinen bisherigen Zugangsdaten
anmelden und auf alle seine Ordner, Dokumente und Freigaben zugreifen können,
ohne dass ein Benutzer selbst eine Aktion ausführen muss.

#### Scenario: Unveränderte Anmeldung
- **WHEN** ein Benutzer sich nach der Migration mit seinen bisherigen Zugangsdaten anmeldet
- **THEN** ist die Anmeldung erfolgreich (BCrypt-Hashes wurden mit der DB übernommen)

#### Scenario: Vollständiger Datenzugriff
- **WHEN** ein Benutzer nach der Migration sein Portal öffnet
- **THEN** sieht er dieselben Ordner, Dokumente, Gruppen und Freigaben wie vor der Migration

### Requirement: Dokumentiertes Cutover-Runbook
Das Tooling SHALL von einem Runbook begleitet sein, das den Big-Bang-Cutover
Schritt für Schritt beschreibt: optionaler Probelauf, Wartungsfenster, App-Freeze,
finaler Export, Transfer, Import, Verifikation, DNS-Umstellung, Rollback und
Stilllegung des alten Servers.

#### Scenario: Runbook deckt den vollständigen Ablauf ab
- **WHEN** ein Operator die Migration durchführt
- **THEN** findet er im Runbook alle Schritte inklusive Freeze, Transfer, Restore, Verifikation, DNS-Umstellung und Rollback

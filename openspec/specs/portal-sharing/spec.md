# portal-sharing Specification

## Purpose
Freigabe von Dokumenten an andere Benutzer: Erstellen (mit Berechtigung VIEW/EDIT
und optionalem Ablaufdatum), Einsehen eigener und empfangener Freigaben,
Widerrufen sowie freigabe-basierter Zugriff (steuert den Download in
`portal-documents`).
## Requirements
### Requirement: Externen Freigabe-Link erstellen
Ein ADMIN SHALL für **ein Dokument oder einen Ordner** einen externen Freigabe-Link mit unerratbarem
Token erzeugen können. Ein Link SHALL genau ein Ziel haben (Dokument **oder** Ordner). Optional SHALL
ein Passwort, ein Ablaufdatum und eine Empfänger-E-Mail hinterlegt werden können. Das Passwort SHALL
ausschließlich als BCrypt-Hash gespeichert werden. Das Erstellen SHALL im Activity-Log protokolliert
werden.

#### Scenario: Dokument-Link erstellen
- **WHEN** ein ADMIN für ein Dokument „Extern teilen" auslöst
- **THEN** wird ein `ExternalShareLink` mit Ziel-Typ Dokument und zufälligem Token angelegt und die Freigabe-URL (`/s/{token}`) zurückgegeben

#### Scenario: Ordner-Link erstellen
- **WHEN** ein ADMIN für einen Ordner „Extern teilen" auslöst
- **THEN** wird ein `ExternalShareLink` mit Ziel-Typ Ordner und zufälligem Token angelegt und die Freigabe-URL zurückgegeben

#### Scenario: Link mit Passwort und Ablauf
- **WHEN** ein ADMIN beim Erstellen ein Passwort und ein Ablaufdatum angibt
- **THEN** wird das Passwort als BCrypt-Hash und das Ablaufdatum am Link gespeichert

### Requirement: Externe Freigabe-Links verwalten
Ein ADMIN SHALL die zu einem Dokument bestehenden Freigabe-Links einsehen und einen Link widerrufen
können. Ein widerrufener Link SHALL keinen Zugriff mehr gewähren. Das Widerrufen SHALL protokolliert
werden.

#### Scenario: Link widerrufen
- **WHEN** ein ADMIN einen bestehenden Freigabe-Link widerruft
- **THEN** wird der Link als widerrufen markiert und ein anschließender öffentlicher Abruf schlägt fehl

### Requirement: Login-freier Zugriff über Freigabe-Link
Ein Empfänger SHALL ein Dokument über den Token-Link ohne Account und ohne Portal-Zugang herunterladen
können. Der öffentliche Endpunkt SHALL Metadaten (Dateiname, ob Passwort nötig, Gültigkeit) liefern und
die Datei nur bei gültigem, nicht widerrufenem und nicht abgelaufenem Link ausliefern; ist ein Passwort
gesetzt, SHALL der Download nur bei korrektem Passwort erfolgen. Jeder erfolgreiche Zugriff SHALL im
Activity-Log protokolliert und `access_count`/`last_accessed_at` aktualisiert werden. Die öffentliche
Freigabe-Seite SHALL trotz des Coming-Soon-Gates erreichbar sein.

#### Scenario: Download über gültigen Link ohne Passwort
- **WHEN** ein Empfänger `/s/{token}` eines gültigen Links ohne Passwortschutz öffnet und herunterlädt
- **THEN** wird die Datei ausgeliefert, ohne dass ein Login erforderlich ist

#### Scenario: Passwortgeschützter Link
- **WHEN** ein Empfänger einen passwortgeschützten Link öffnet
- **THEN** wird der Download erst nach Eingabe des korrekten Passworts ausgeliefert

#### Scenario: Abgelaufener oder widerrufener Link
- **WHEN** ein Empfänger einen abgelaufenen oder widerrufenen Link aufruft
- **THEN** wird kein Datei-Download ausgeliefert und ein entsprechender Fehler angezeigt

### Requirement: Ordner-Link — Dateiliste und Teilbaum-Beschränkung
Bei einem Ordner-Link SHALL die öffentliche Seite die Dateien des freigegebenen Ordners und aller
Unterordner (rekursiv) auflisten und deren Download einzeln ermöglichen. Der Server SHALL beim
Download prüfen, dass die angeforderte Datei innerhalb des freigegebenen Ordner-Teilbaums liegt; ist
das nicht der Fall, SHALL der Download verweigert werden. Über einen Ordner-Link SHALL ausschließlich
auf Dateien dieses Teilbaums zugegriffen werden können.

#### Scenario: Dateiliste eines Ordner-Links
- **WHEN** ein Empfänger einen gültigen Ordner-Link öffnet
- **THEN** werden die Dateien des Ordners und seiner Unterordner mit Namen und relativem Pfad aufgelistet

#### Scenario: Download einer Datei aus dem Ordner
- **WHEN** ein Empfänger in einem Ordner-Link eine gelistete Datei herunterlädt
- **THEN** wird die Datei ausgeliefert, sofern der Link gültig (und ggf. das Passwort korrekt) ist

#### Scenario: Zugriff auf Datei außerhalb des Ordners wird verweigert
- **WHEN** über einen Ordner-Link ein Dokument angefragt wird, das nicht im freigegebenen Teilbaum liegt
- **THEN** wird der Download mit HTTP 403 verweigert


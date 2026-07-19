# Caddy HTTPS-Umstellung - Spezifikation

## Übersicht

Diese Spezifikation beschreibt das Verhalten des Systems in zwei Phasen:
- **Phase 1:** IP-basierter HTTP-Zugriff (vor DNS-Konfiguration)
- **Phase 2:** Domain-basierter HTTPS-Zugriff (nach DNS-Konfiguration)

---

## Phase 1: IP-basierter Zugriff (HTTP)

### 1.1 Grundlegende Erreichbarkeit

```gherkin
Given der Server läuft mit Caddy als Reverse-Proxy
And die DNS-Konfiguration ist noch nicht erfolgt
When ein Benutzer http://<server-ip>/ aufruft
Then wird die Startseite angezeigt
And der HTTP-Statuscode ist 200
And der Response-Header "Server" enthält "Caddy"
```

### 1.2 API-Endpunkte erreichbar

```gherkin
Given der Server läuft mit Caddy
When ein Benutzer http://<server-ip>/api/blog aufruft
Then wird eine JSON-Antwort zurückgegeben
And der HTTP-Statuscode ist 200
And der Content-Type ist "application/json"
```

### 1.3 Admin-Bereich erreichbar

```gherkin
Given der Server läuft mit Caddy
When ein Benutzer http://<server-ip>/admin/login aufruft
Then wird die Login-Seite angezeigt
And der HTTP-Statuscode ist 200
```

### 1.4 Statische Assets werden geladen

```gherkin
Given der Server läuft mit Caddy
When ein Benutzer http://<server-ip>/assets/index-<hash>.js aufruft
Then wird die JavaScript-Datei zurückgegeben
And der HTTP-Statuscode ist 200
And der Content-Type enthält "javascript"
```

### 1.5 SPA-Routing funktioniert

```gherkin
Given der Server läuft mit Caddy
When ein Benutzer http://<server-ip>/blog aufruft
Then wird die Startseite (index.html) zurückgegeben
And der HTTP-Statuscode ist 200
And React Router übernimmt das clientseitige Routing
```

### 1.6 Health-Check

```gherkin
Given der Server läuft mit Caddy
When der Health-Check http://<server-ip>/ aufgerufen wird
Then ist der HTTP-Statuscode 200
And die Antwortzeit ist unter 5 Sekunden
```

---

## Phase 2: Domain-basierter Zugriff (HTTPS)

### 2.1 HTTPS-Zugriff funktioniert

```gherkin
Given die DNS-Konfiguration ist abgeschlossen
And Caddy hat ein Let's Encrypt Zertifikat ausgestellt
When ein Benutzer https://proudig.de/ aufruft
Then wird die Startseite angezeigt
And der HTTP-Statuscode ist 200
And die Verbindung ist TLS-verschlüsselt
```

### 2.2 HTTP wird zu HTTPS weitergeleitet

```gherkin
Given die DNS-Konfiguration ist abgeschlossen
And HTTPS ist aktiv
When ein Benutzer http://proudig.de/ aufruft
Then wird eine Weiterleitung ausgeführt
And der HTTP-Statuscode ist 301 oder 308 (Permanent Redirect)
And der Location-Header ist "https://proudig.de/"
```

### 2.3 www-Domain ist erreichbar

```gherkin
Given die DNS-Konfiguration ist abgeschlossen
And HTTPS ist aktiv
When ein Benutzer https://www.proudig.de/ aufruft
Then wird die Startseite angezeigt
And der HTTP-Statuscode ist 200
And die Verbindung ist TLS-verschlüsselt
```

### 2.4 www mit HTTP wird zu HTTPS weitergeleitet

```gherkin
Given die DNS-Konfiguration ist abgeschlossen
And HTTPS ist aktiv
When ein Benutzer http://www.proudig.de/ aufruft
Then wird eine Weiterleitung ausgeführt
And der HTTP-Statuscode ist 301 oder 308
And der Location-Header beginnt mit "https://"
```

### 2.5 SSL-Zertifikat ist gültig

```gherkin
Given HTTPS ist aktiv
When das SSL-Zertifikat von proudig.de geprüft wird
Then ist das Zertifikat gültig
And der Aussteller ist "Let's Encrypt"
And das Zertifikat läuft nicht innerhalb der nächsten 7 Tage ab
And das Zertifikat gilt für "proudig.de" und "www.proudig.de"
```

### 2.6 Security-Header sind gesetzt

```gherkin
Given HTTPS ist aktiv
When ein Benutzer https://proudig.de/ aufruft
Then enthält die Antwort den Header "Content-Security-Policy"
And der CSP-Header erlaubt 'self' für default-src
And der CSP-Header erlaubt 'unsafe-inline' und 'unsafe-eval' für script-src
```

### 2.7 API-Endpunkte über HTTPS

```gherkin
Given HTTPS ist aktiv
When ein Benutzer https://proudig.de/api/blog aufruft
Then wird eine JSON-Antwort zurückgegeben
And der HTTP-Statuscode ist 200
And die Verbindung ist TLS-verschlüsselt
```

---

## Integrationstests

### 3.1 Caddy zu Spring Boot Kommunikation

```gherkin
Given Caddy-Container läuft
And proudig-app Container läuft
When Caddy eine Anfrage an proudig-app:8081 weiterleitet
Then antwortet proudig-app erfolgreich
And Caddy gibt die Antwort an den Client weiter
```

### 3.2 Spring Boot zu PostgreSQL Kommunikation

```gherkin
Given proudig-app Container läuft
And proudig-db Container läuft
When ein API-Aufruf Datenbankzugriff erfordert (z.B. GET /api/blog)
Then werden Daten aus der Datenbank geladen
And eine erfolgreiche Antwort wird zurückgegeben
```

### 3.3 Container-Netzwerk

```gherkin
Given alle Container im proudig-network laufen
When proudig-app den Hostnamen "proudig-db" auflöst
Then wird die interne Container-IP zurückgegeben
And die Datenbankverbindung kann hergestellt werden
```

---

## Fehlerszenarien

### 4.1 App-Container nicht erreichbar

```gherkin
Given Caddy-Container läuft
And proudig-app Container ist gestoppt
When ein Benutzer http://<server-ip>/ aufruft
Then wird ein Fehler zurückgegeben
And der HTTP-Statuscode ist 502 (Bad Gateway) oder 503 (Service Unavailable)
```

### 4.2 Ungültige Route

```gherkin
Given der Server läuft
When ein Benutzer /api/nicht-existent aufruft
Then wird ein Fehler zurückgegeben
And der HTTP-Statuscode ist 404
```

### 4.3 Zertifikat kann nicht ausgestellt werden (vor DNS)

```gherkin
Given die DNS-Konfiguration ist NICHT abgeschlossen
And Caddy ist für Domain-Modus konfiguriert
When Caddy versucht ein Zertifikat zu holen
Then schlägt die ACME-Challenge fehl
And Caddy loggt einen Fehler
And HTTPS ist nicht verfügbar
```

---

## Nicht-funktionale Anforderungen

### 5.1 Performance

```gherkin
Given der Server läuft im Normalbetrieb
When 10 gleichzeitige Anfragen gestellt werden
Then werden alle Anfragen innerhalb von 2 Sekunden beantwortet
And kein Request schlägt fehl
```

### 5.2 Verfügbarkeit nach Neustart

```gherkin
Given alle Container laufen
When "docker compose restart" ausgeführt wird
Then sind alle Container nach maximal 60 Sekunden wieder healthy
And die Website ist erreichbar
```

### 5.3 Zertifikat-Erneuerung

```gherkin
Given HTTPS ist aktiv
And das Zertifikat läuft in 30 Tagen ab
When Caddy den automatischen Erneuerungsprozess startet
Then wird ein neues Zertifikat von Let's Encrypt geholt
And das neue Zertifikat ist gültig für weitere 90 Tage
```

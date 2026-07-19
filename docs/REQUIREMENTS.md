# ProuDig Site - Anforderungsdokument

## 1. Einleitung

### 1.1 Zweck

Dieses Dokument beschreibt die funktionalen und nicht-funktionalen Anforderungen an die ProuDig-Site-Anwendung, bestehend aus einer öffentlichen Website, einem Content-Management-System (CMS) und einem Dokumentenportal.

### 1.2 Scope

Die Anwendung dient:
- Der Präsentation von Unternehmensdienstleistungen (Website)
- Der Verwaltung von Webinhalten (CMS)
- Dem sicheren Dokumentenaustausch zwischen Beratern und Kunden (Portal)

### 1.3 Zielgruppen

| Rolle | Beschreibung |
|-------|--------------|
| **Besucher** | Öffentliche Website-Besucher |
| **Administrator** | Vollzugriff auf alle Systembereiche |
| **Berater (Consultant)** | CMS- und Portal-Zugriff |
| **Kunde (Client)** | Nur Portal-Zugriff |

---

## 2. Funktionale Anforderungen

### 2.1 Öffentliche Website

#### 2.1.1 Startseite

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| WEB-001 | Die Startseite zeigt eine Hero-Sektion mit Kernbotschaft | Muss |
| WEB-002 | Editierbare Content-Blöcke für Dienstleistungen, Qualität, Expertise | Muss |
| WEB-003 | Kontaktsektion mit Kontaktinformationen | Muss |
| WEB-004 | Navigation zu allen öffentlichen Bereichen | Muss |
| WEB-005 | Responsive Design für Desktop, Tablet, Mobile | Muss |

#### 2.1.2 Blog

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| BLOG-001 | Übersichtsseite mit allen veröffentlichten Blog-Beiträgen | Muss |
| BLOG-002 | Einzelansicht eines Blog-Beitrags mit vollständigem Inhalt | Muss |
| BLOG-003 | Markdown-Rendering für Blog-Inhalte | Muss |
| BLOG-004 | Anzeige von Titelbild, Autor, Datum, Tags | Soll |
| BLOG-005 | RSS-Feed für Blog-Beiträge | Soll |

#### 2.1.3 Seminare

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| SEM-001 | Übersichtsseite aller Seminare/Kurse | Muss |
| SEM-002 | Detailseite pro Seminar mit Beschreibung | Muss |
| SEM-003 | Kategorisierung und Filterung von Seminaren | Kann |

#### 2.1.4 Statische Seiten

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| STAT-001 | Impressum-Seite (rechtlich erforderlich) | Muss |
| STAT-002 | Datenschutzseite (DSGVO-konform) | Muss |
| STAT-003 | Dynamische statische Seiten über Slug erreichbar | Muss |

#### 2.1.5 SEO

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| SEO-001 | Meta-Title und Meta-Description pro Seite | Soll |
| SEO-002 | Open Graph Tags für Social-Media-Sharing | Kann |
| SEO-003 | Sitemap-Generierung | Kann |

---

### 2.2 Content-Management-System (CMS)

#### 2.2.1 Authentifizierung

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| CMS-AUTH-001 | Login mit E-Mail und Passwort | Muss |
| CMS-AUTH-002 | JWT-basierte Session-Verwaltung | Muss |
| CMS-AUTH-003 | Automatische Token-Erneuerung | Muss |
| CMS-AUTH-004 | Logout-Funktion | Muss |
| CMS-AUTH-005 | Passwort-Änderung durch Benutzer | Muss |
| CMS-AUTH-006 | Erzwungene Passwort-Änderung bei Erstanmeldung | Soll |

#### 2.2.2 Seitenverwaltung

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| CMS-PAGE-001 | Erstellen neuer Seiten (Blog, Seminar, Statisch) | Muss |
| CMS-PAGE-002 | Bearbeiten bestehender Seiten | Muss |
| CMS-PAGE-003 | Löschen von Seiten | Muss |
| CMS-PAGE-004 | Entwurf-/Veröffentlichungs-Workflow | Muss |
| CMS-PAGE-005 | Archivieren von Seiten | Soll |
| CMS-PAGE-006 | Vorschau unveröffentlichter Seiten | Soll |
| CMS-PAGE-007 | Markdown-Editor für Seiteninhalte | Muss |
| CMS-PAGE-008 | Titelbild-Auswahl aus Medienbibliothek | Soll |
| CMS-PAGE-009 | Tag-Verwaltung für Seiten | Soll |
| CMS-PAGE-010 | URL-Slug automatisch generieren | Muss |

#### 2.2.3 Content-Block-Verwaltung

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| CMS-CB-001 | Bearbeiten von Content-Blöcken (Startseite) | Muss |
| CMS-CB-002 | Entwurf speichern ohne Veröffentlichung | Muss |
| CMS-CB-003 | Veröffentlichen von Content-Blöcken | Muss |

#### 2.2.4 Medienbibliothek

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| CMS-MED-001 | Upload von Bildern | Muss |
| CMS-MED-002 | Übersicht aller Medien | Muss |
| CMS-MED-003 | Löschen von Medien | Muss |
| CMS-MED-004 | Anzeige von Dateiname, Größe, Typ | Soll |
| CMS-MED-005 | Bildvorschau in der Bibliothek | Soll |

#### 2.2.5 Berechtigungen

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| CMS-PERM-001 | Nur ADMIN und CONSULTANT haben CMS-Zugriff | Muss |
| CMS-PERM-002 | Benutzer mit Rolle CLIENT werden abgewiesen | Muss |

---

### 2.3 Dokumentenportal

#### 2.3.1 Dokumentenverwaltung

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| DOC-001 | Upload von Dokumenten | Muss |
| DOC-002 | Download von Dokumenten | Muss |
| DOC-003 | Löschen eigener Dokumente | Muss |
| DOC-004 | Umbenennen von Dokumenten (Beschreibung ändern) | Soll |
| DOC-005 | Anzeige von Dateiname, Größe, Typ, Datum | Muss |
| DOC-006 | Drag-and-Drop-Upload | Soll |
| DOC-007 | Mehrfach-Upload | Soll |
| DOC-008 | Dateitypfilterung (Icons je nach Typ) | Soll |

#### 2.3.2 Ordnerverwaltung

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| FOLD-001 | Erstellen von Ordnern | Muss |
| FOLD-002 | Umbenennen von Ordnern | Muss |
| FOLD-003 | Löschen von Ordnern (nur wenn leer) | Muss |
| FOLD-004 | Hierarchische Ordnerstruktur (Unterordner) | Muss |
| FOLD-005 | Navigation durch Ordner (Breadcrumb) | Muss |
| FOLD-006 | Verschieben von Dokumenten zwischen Ordnern | Kann |

#### 2.3.3 Dokumenten-Freigabe

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| SHARE-001 | Freigeben von Dokumenten an andere Benutzer | Muss |
| SHARE-002 | Festlegen von Berechtigungen (VIEW, DOWNLOAD, EDIT) | Soll |
| SHARE-003 | Ablaufdatum für Freigaben | Kann |
| SHARE-004 | Anzeige von Dokumenten, die mit mir geteilt wurden | Muss |
| SHARE-005 | Widerrufen von Freigaben | Muss |

#### 2.3.4 Aktivitätsprotokoll

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| LOG-001 | Protokollierung von Upload-Aktivitäten | Muss |
| LOG-002 | Protokollierung von Download-Aktivitäten | Muss |
| LOG-003 | Protokollierung von Lösch-Aktivitäten | Muss |
| LOG-004 | Anzeige des Aktivitätsprotokolls | Soll |

#### 2.3.5 Portal-Berechtigungen

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| PORT-PERM-001 | Alle authentifizierten Benutzer haben Portal-Zugriff | Muss |
| PORT-PERM-002 | Benutzer sehen nur eigene Dokumente + freigegebene | Muss |
| PORT-PERM-003 | Löschen nur für eigene Dokumente/Ordner | Muss |

---

### 2.4 Benutzerverwaltung

#### 2.4.1 Benutzer-CRUD

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| USER-001 | Anlegen neuer Benutzer (nur ADMIN) | Muss |
| USER-002 | Bearbeiten von Benutzerdaten | Muss |
| USER-003 | Löschen von Benutzern | Muss |
| USER-004 | Zuweisen von Rollen (ADMIN, CONSULTANT, CLIENT) | Muss |
| USER-005 | Anzeige aller Benutzer | Muss |
| USER-006 | Zurücksetzen von Passwörtern | Soll |

#### 2.4.2 Benutzerfelder

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| USER-FIELD-001 | E-Mail-Adresse (eindeutig, Login-Kennung) | Muss |
| USER-FIELD-002 | Vorname und Nachname | Muss |
| USER-FIELD-003 | Unternehmenszugehörigkeit | Soll |
| USER-FIELD-004 | Erstellungsdatum | Muss |
| USER-FIELD-005 | Letztes Login-Datum | Soll |

---

### 2.5 Vorschau-Funktionalität

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| PREV-001 | Passwortgeschützte Vorschau für nicht-öffentliche Seiten | Soll |
| PREV-002 | Vorschau-Passwort zentral konfigurierbar | Soll |

---

## 3. Nicht-funktionale Anforderungen

### 3.1 Performance

| ID | Anforderung | Zielwert |
|----|-------------|----------|
| PERF-001 | Initiale Seitenladezeit | < 3 Sekunden |
| PERF-002 | API-Antwortzeit (einfache Abfragen) | < 200 ms |
| PERF-003 | Datei-Upload bis 50 MB | Unterstützt |
| PERF-004 | Gleichzeitige Benutzer | >= 50 |

### 3.2 Sicherheit

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| SEC-001 | Verschlüsselte Passwort-Speicherung (BCrypt) | Muss |
| SEC-002 | HTTPS-Verschlüsselung (TLS) | Muss |
| SEC-003 | JWT-basierte zustandslose Authentifizierung | Muss |
| SEC-004 | CSRF-Schutz für API-Endpunkte | Muss |
| SEC-005 | Content Security Policy (CSP) Header | Soll |
| SEC-006 | Rollenbasierte Zugriffskontrolle (RBAC) | Muss |
| SEC-007 | Token-Ablauf (Access: 2h, Refresh: 7d) | Muss |
| SEC-008 | Schutz vor SQL-Injection (JPA/PreparedStatements) | Muss |
| SEC-009 | Schutz vor XSS (React Auto-Escaping) | Muss |

### 3.3 Verfügbarkeit

| ID | Anforderung | Zielwert |
|----|-------------|----------|
| AVAIL-001 | System-Verfügbarkeit | 99% |
| AVAIL-002 | Geplante Wartungsfenster | Außerhalb Geschäftszeiten |
| AVAIL-003 | Recovery Time Objective (RTO) | < 4 Stunden |
| AVAIL-004 | Recovery Point Objective (RPO) | < 24 Stunden |

### 3.4 Skalierbarkeit

| ID | Anforderung | Beschreibung |
|----|-------------|--------------|
| SCALE-001 | Horizontale Skalierung | Zustandslose Backend-Architektur ermöglicht mehrere Instanzen |
| SCALE-002 | Datenbankwachstum | PostgreSQL unterstützt große Datenmengen |
| SCALE-003 | Dateispeicher | Erweiterbar auf Cloud-Storage (S3, etc.) |

### 3.5 Wartbarkeit

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| MAINT-001 | Versionierte Datenbankmigrationen (Liquibase) | Muss |
| MAINT-002 | Logging für Debugging und Audit | Muss |
| MAINT-003 | Konfiguration über Umgebungsvariablen | Muss |
| MAINT-004 | Trennung von Frontend und Backend-Code | Muss |
| MAINT-005 | Unit- und Integrationstests | Soll |

### 3.6 Benutzerfreundlichkeit

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| UX-001 | Responsive Design (Mobile-First) | Muss |
| UX-002 | Intuitive Navigation | Muss |
| UX-003 | Feedback bei Aktionen (Lade-Indikatoren, Erfolg/Fehler) | Muss |
| UX-004 | Bestätigungsdialoge bei destruktiven Aktionen | Muss |
| UX-005 | Konsistente UI-Sprache (Deutsch) | Muss |
| UX-006 | Barrierefreundlichkeit (WCAG 2.1 AA) | Soll |

### 3.7 Kompatibilität

| ID | Anforderung | Zielwert |
|----|-------------|----------|
| COMPAT-001 | Browser-Unterstützung | Chrome, Firefox, Safari, Edge (letzte 2 Versionen) |
| COMPAT-002 | Mobile Browser | iOS Safari, Android Chrome |
| COMPAT-003 | JavaScript erforderlich | Ja (SPA) |

### 3.8 Datenschutz (DSGVO)

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| GDPR-001 | Impressum mit vollständigen Angaben | Muss |
| GDPR-002 | Datenschutzerklärung | Muss |
| GDPR-003 | Löschung von Benutzerdaten möglich | Muss |
| GDPR-004 | Keine unnötige Datenerhebung | Muss |
| GDPR-005 | Sichere Datenübertragung (HTTPS) | Muss |

---

## 4. Technische Anforderungen

### 4.1 Backend

| ID | Anforderung | Spezifikation |
|----|-------------|---------------|
| TECH-BE-001 | Framework | Spring Boot 4.x |
| TECH-BE-002 | Programmiersprache | Java 21 |
| TECH-BE-003 | Datenbank | PostgreSQL 14+ |
| TECH-BE-004 | ORM | Spring Data JPA / Hibernate |
| TECH-BE-005 | Build-Tool | Maven |
| TECH-BE-006 | Migrationen | Liquibase |

### 4.2 Frontend

| ID | Anforderung | Spezifikation |
|----|-------------|---------------|
| TECH-FE-001 | Framework | React 19 |
| TECH-FE-002 | Build-Tool | Vite 6 |
| TECH-FE-003 | Routing | React Router 7 |
| TECH-FE-004 | Styling | CSS (eigene Stylesheets) |
| TECH-FE-005 | Icons | Bootstrap Icons |

### 4.3 Infrastruktur

| ID | Anforderung | Spezifikation |
|----|-------------|---------------|
| TECH-INF-001 | Containerisierung | Docker |
| TECH-INF-002 | Deployment | JAR-Artefakt |
| TECH-INF-003 | Reverse Proxy | Nginx (empfohlen) |
| TECH-INF-004 | Dateispeicher | Lokales Dateisystem oder S3-kompatibel |

---

## 5. Einschränkungen

| ID | Einschränkung |
|----|---------------|
| CONSTR-001 | JavaScript muss im Browser aktiviert sein (SPA) |
| CONSTR-002 | Maximale Dateigröße für Uploads: 50 MB |
| CONSTR-003 | Keine Offline-Funktionalität |
| CONSTR-004 | Keine Echtzeit-Kollaboration bei Dokumentenbearbeitung |
| CONSTR-005 | Einzelne Datenbankinstanz (kein Clustering in Basisversion) |

---

## 6. Anforderungs-Traceability

### Prioritätslegende

| Priorität | Bedeutung |
|-----------|-----------|
| **Muss** | Zwingend erforderlich für Go-Live |
| **Soll** | Wichtig, aber nicht kritisch |
| **Kann** | Nice-to-have, für zukünftige Versionen |

### Zusammenfassung

| Kategorie | Muss | Soll | Kann | Gesamt |
|-----------|------|------|------|--------|
| Öffentliche Website | 12 | 5 | 3 | 20 |
| CMS | 14 | 8 | 0 | 22 |
| Portal | 15 | 7 | 3 | 25 |
| Benutzerverwaltung | 5 | 3 | 0 | 8 |
| Nicht-funktional | 20 | 8 | 0 | 28 |
| **Gesamt** | **66** | **31** | **6** | **103** |

---

## 7. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2025-06-10 | Claude | Initiale Erstellung |
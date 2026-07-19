# ProuDig Site - Architekturbeschreibung

## 1. Übersicht

**ProuDig Site** ist eine Full-Stack-Webanwendung bestehend aus einem Content-Management-System (CMS) und einem Dokumentenportal. Die Anwendung ermöglicht die Verwaltung von Webseiteninhalten sowie den sicheren Austausch von Dokumenten zwischen Beratern und Kunden.

### Technologie-Stack

| Komponente | Technologie | Version |
|------------|-------------|---------|
| **Backend** | Spring Boot | 4.0.3 |
| **Programmiersprache** | Java | 21 |
| **Datenbank** | PostgreSQL | 14 |
| **Frontend** | React | 19 |
| **Build-Tool (Frontend)** | Vite | 6 |
| **Routing** | React Router | 7 |
| **Authentifizierung** | JWT (JJWT) | 0.12.6 |
| **DB-Migrationen** | Liquibase | - |
| **Build-Tool (Backend)** | Maven | - |

---

## 2. Systemarchitektur

### 2.1 Schichtenarchitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│   React 19 + Vite + React Router                                │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │ Public Site │  │  Admin CMS  │  │   Portal    │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│   Spring Boot 4.0.3                                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Controller Layer                      │   │
│   │  AuthController | ContentController | DocumentController │   │
│   │  AdminPageController | FolderController | UserController │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                     Service Layer                        │   │
│   │  PageService | DocumentService | FileStorageService      │   │
│   │  UserService | RefreshTokenService | ActivityLogService  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   Repository Layer                       │   │
│   │           Spring Data JPA Repositories                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Security Layer                        │   │
│   │  JWT Authentication | Role-Based Access Control          │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │ Filesystem  │  │  Liquibase      │
│   Database      │  │  Storage    │  │  Migrations     │
└─────────────────┘  └─────────────┘  └─────────────────┘
```

### 2.2 Monolithische Deployment-Architektur

Die Anwendung wird als einzelnes JAR-Artefakt deployt:

```
proudig-site.jar
├── Spring Boot Backend (kompilierte Java-Klassen)
├── React Frontend (in /static/ gebündelt)
├── Liquibase Migrationen
└── Konfigurationsdateien
```

**Vorteile:**
- Einfaches Deployment
- Keine Netzwerk-Latenz zwischen Frontend und Backend
- Vereinfachte Konfiguration

---

## 3. Projektstruktur

```
proudig-site/
├── pom.xml                              # Maven-Konfiguration
├── docker-compose.dev.yml               # Lokale PostgreSQL-Datenbank
│
├── src/main/java/de/proudig/site/
│   ├── ProudigSiteApplication.java      # Anwendungs-Einstiegspunkt
│   ├── WebConfig.java                   # Web-Konfiguration
│   ├── SpaForwardController.java        # SPA-Routing
│   ├── PreviewController.java           # Vorschau-Funktionalität
│   │
│   ├── config/                          # Konfigurationsklassen
│   │   └── SecurityConfig.java
│   │
│   ├── controller/                      # REST-Endpunkte (15 Controller)
│   │   ├── AuthController.java
│   │   ├── AdminPageController.java
│   │   ├── ContentController.java
│   │   ├── DocumentController.java
│   │   ├── FolderController.java
│   │   └── ...
│   │
│   ├── domain/                          # JPA-Entitäten (10+ Modelle)
│   │   ├── User.java
│   │   ├── Page.java
│   │   ├── Document.java
│   │   ├── Folder.java
│   │   └── ...
│   │
│   ├── dto/                             # Data Transfer Objects
│   ├── repository/                      # Spring Data Repositories
│   ├── service/                         # Geschäftslogik
│   └── security/                        # JWT & Authentifizierung
│
├── src/main/resources/
│   ├── application.properties           # Anwendungskonfiguration
│   └── db/changelog/                    # Liquibase-Migrationen
│       ├── db.changelog-master.xml
│       ├── 001-users-roles.xml
│       ├── 002-refresh-tokens.xml
│       ├── 003-content-blocks.xml
│       ├── 004-media.xml
│       ├── 005-pages.xml
│       ├── 006-documents-portal.xml
│       ├── 007-activity-log.xml
│       └── 008-reset-admin-password.xml
│
├── src/main/frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                      # Haupt-Router
│       ├── main.jsx                     # React-Einstiegspunkt
│       ├── components/                  # Wiederverwendbare Komponenten
│       ├── pages/                       # Seitenkomponenten
│       │   ├── admin/                   # CMS-Seiten
│       │   └── portal/                  # Portal-Seiten
│       ├── contexts/                    # React Context Provider
│       ├── hooks/                       # Custom React Hooks
│       └── utils/                       # Hilfsfunktionen
│
├── data/files/                          # Datei-Speicherort
│   └── documents/                       # Hochgeladene Dokumente
│
└── docs/                                # Dokumentation
```

---

## 4. Backend-Architektur

### 4.1 Controller (REST API)

Die Anwendung bietet 15 REST-Controller:

| Controller | Pfad | Beschreibung |
|------------|------|--------------|
| `AuthController` | `/api/auth` | Authentifizierung (Login, Logout, Refresh) |
| `AdminPageController` | `/api/admin/pages` | Seitenverwaltung im CMS |
| `AdminContentController` | `/api/admin/content` | Content-Block-Verwaltung |
| `ContentController` | `/api/content` | Öffentliche Content-Blöcke |
| `BlogController` | `/api/blog` | Blog-Beiträge |
| `SeminarController` | `/api/seminare` | Seminare/Kurse |
| `StaticPageController` | `/api/pages` | Statische Seiten |
| `MediaController` | `/api/media` | Medienverwaltung |
| `DocumentController` | `/api/documents` | Dokumenten-Upload/Download |
| `FolderController` | `/api/folders` | Ordnerverwaltung |
| `DocumentShareController` | `/api/shares` | Dokumenten-Freigaben |
| `UserController` | `/api/users` | Benutzerverwaltung |
| `ActivityLogController` | `/api/activity-log` | Aktivitätsprotokoll |
| `SeoController` | `/api/seo` | SEO-Metadaten |
| `RssFeedController` | `/api/rss` | RSS-Feed |

### 4.2 Domain-Modelle

```
┌─────────────────────────────────────────────────────────────┐
│                    Benutzerverwaltung                        │
├─────────────────────────────────────────────────────────────┤
│  User                    Role                RefreshToken   │
│  ├── id                  ├── id              ├── id         │
│  ├── email               └── name            ├── token      │
│  ├── password                                ├── user       │
│  ├── firstName                               └── expiryDate │
│  ├── lastName                                               │
│  ├── company                                                │
│  └── roles[]                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Content Management                        │
├─────────────────────────────────────────────────────────────┤
│  Page                              ContentBlock              │
│  ├── id                            ├── id                   │
│  ├── slug                          ├── sectionKey           │
│  ├── title                         ├── content              │
│  ├── category (BLOG|SEMINAR|...)   ├── draftContent         │
│  ├── content                       └── publishedAt          │
│  ├── status (DRAFT|PUBLISHED|...)                           │
│  └── author                                                 │
│                                                             │
│  Media                                                      │
│  ├── id                                                     │
│  ├── name                                                   │
│  ├── contentType                                            │
│  └── storagePath                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Dokumentenportal                          │
├─────────────────────────────────────────────────────────────┤
│  Folder                  Document               DocumentShare│
│  ├── id                  ├── id                 ├── id       │
│  ├── name                ├── fileName           ├── document │
│  ├── parent              ├── storagePath        ├── sharedWith│
│  └── owner               ├── folder             ├── sharedBy │
│                          ├── uploadedBy         ├── permission│
│                          └── description        └── expiresAt │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Service-Schicht

| Service | Verantwortlichkeit |
|---------|-------------------|
| `UserService` | Benutzer CRUD, Passwort-Management |
| `PageService` | Seiten erstellen, veröffentlichen, archivieren |
| `ContentService` | Content-Block-Verwaltung |
| `MediaService` | Medien-Upload und -Verwaltung |
| `DocumentService` | Dokument-Upload, -Abruf, -Löschung |
| `FolderService` | Ordner-Hierarchie-Verwaltung |
| `DocumentShareService` | Freigabe und Berechtigungen |
| `FileStorageService` | Dateisystem-Operationen |
| `ActivityLogService` | Aktivitätsprotokollierung |
| `RefreshTokenService` | JWT Refresh-Token-Verwaltung |

---

## 5. Frontend-Architektur

### 5.1 Routing-Struktur

```
PUBLIC ROUTES (Öffentlich zugänglich)
├── /                           → HomePage
├── /impressum                  → StaticPageRenderer
├── /datenschutz                → StaticPageRenderer
├── /seite/:slug                → StaticPageRenderer
├── /blog                       → BlogPage
├── /blog/:slug                 → BlogPostPage
├── /seminare                   → SeminarePage
└── /seminare/:slug             → SeminarDetailPage

ADMIN CMS (Erfordert ADMIN oder CONSULTANT)
├── /admin/login                → AdminLogin
├── /admin                      → AdminHome
└── /admin/cms
    ├── /                       → AdminDashboard
    ├── /seiten                 → StaticPageList
    ├── /seiten/new             → StaticPageEditor
    ├── /seiten/:id             → StaticPageEditor
    ├── /blog                   → BlogList
    ├── /blog/new               → PageEditor
    ├── /blog/:id               → PageEditor
    ├── /seminare               → SeminarList
    └── /media                  → MediaLibrary

PORTAL (Erfordert Authentifizierung)
├── /admin/portal/change-password → ChangePassword
└── /admin/portal
    ├── /                       → PortalDashboard
    ├── /documents              → PortalDocuments
    ├── /shared                 → PortalShared
    └── /users                  → PortalUsers (nur ADMIN)
```

### 5.2 React Context Provider

| Context | Funktion |
|---------|----------|
| `AuthContext` | Authentifizierungsstatus, JWT-Token-Verwaltung |
| `ContentContext` | Allgemeiner Content-State |
| `FolderTreeContext` | Ordner-Navigation für Dokumentenportal |

### 5.3 Komponentenstruktur

```
src/components/
├── Layout & Navigation
│   ├── Navbar.jsx
│   ├── ThemeToggle.jsx
│   └── ProtectedRoute.jsx
│
├── UI-Komponenten
│   ├── ActionButton.jsx
│   ├── ConfirmDialog.jsx
│   └── FolderTree.jsx
│
└── Content/Hero-Sektionen
    ├── Hero.jsx, HeroImage.jsx, ...
    ├── Quality.jsx, Expertise.jsx
    ├── Contact.jsx, Footer.jsx
    └── ...
```

---

## 6. Sicherheitsarchitektur

### 6.1 Authentifizierung (JWT)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Client     │       │   Backend    │       │   Database   │
└──────┬───────┘       └──────┬───────┘       └──────┬───────┘
       │                      │                      │
       │  POST /api/auth/login                       │
       │  {email, password}   │                      │
       │─────────────────────►│                      │
       │                      │  Validate user       │
       │                      │─────────────────────►│
       │                      │◄─────────────────────│
       │                      │                      │
       │  {accessToken,       │  Store RefreshToken  │
       │   refreshToken}      │─────────────────────►│
       │◄─────────────────────│                      │
       │                      │                      │
       │  GET /api/documents  │                      │
       │  Authorization: Bearer {accessToken}        │
       │─────────────────────►│                      │
       │                      │  Validate JWT        │
       │  {documents}         │                      │
       │◄─────────────────────│                      │
```

### 6.2 Token-Konfiguration

| Token-Typ | Gültigkeit | Verwendung |
|-----------|------------|------------|
| Access Token | 2 Stunden | API-Anfragen |
| Refresh Token | 7 Tage | Token-Erneuerung |

### 6.3 Rollenbasierte Zugriffskontrolle

| Rolle | Berechtigung |
|-------|--------------|
| `ADMIN` | Voller Zugriff auf CMS, Portal, Benutzerverwaltung |
| `CONSULTANT` | CMS-Zugriff, Portal-Zugriff |
| `CLIENT` | Nur Portal-Zugriff |

### 6.4 Endpoint-Sicherheit

| Pfad | Zugriff |
|------|---------|
| `/api/auth/**` | Öffentlich |
| `/api/content/**`, `/api/blog/**`, `/api/seminare/**` | Öffentlich |
| `/api/admin/**` | ADMIN, CONSULTANT |
| `/api/documents/**`, `/api/folders/**` | Authentifiziert |
| `/api/users/**` | Nur ADMIN |

---

## 7. Datenbank-Schema

### 7.1 ER-Diagramm (vereinfacht)

```
┌───────────┐     ┌─────────────┐     ┌───────────┐
│   users   │────►│ user_roles  │◄────│   roles   │
└───────────┘     └─────────────┘     └───────────┘
      │
      │    ┌────────────────┐
      └───►│ refresh_tokens │
           └────────────────┘

┌───────────┐     ┌───────────────┐
│   pages   │────►│    media      │
└───────────┘     └───────────────┘

┌───────────────┐
│ content_blocks│
└───────────────┘

┌───────────┐     ┌───────────────┐     ┌──────────────────┐
│  folders  │◄────│   documents   │────►│ document_shares  │
└───────────┘     └───────────────┘     └──────────────────┘
      │                   │
      └───────────────────┴──────────────►┌──────────────┐
                                          │ activity_log │
                                          └──────────────┘
```

### 7.2 Liquibase-Migrationen

| Nr. | Datei | Beschreibung |
|-----|-------|--------------|
| 001 | `users-roles.xml` | Benutzer, Rollen, Standard-Admin |
| 002 | `refresh-tokens.xml` | JWT Refresh-Tokens |
| 003 | `content-blocks.xml` | Editierbare Content-Blöcke |
| 004 | `media.xml` | Medienbibliothek |
| 005 | `pages.xml` | Blog, Seminare, statische Seiten |
| 006 | `documents-portal.xml` | Ordner, Dokumente, Freigaben |
| 007 | `activity-log.xml` | Aktivitätsprotokoll |
| 008 | `reset-admin-password.xml` | Admin-Passwort-Reset |

---

## 8. Dateispeicherung

### 8.1 Speicherstruktur

```
data/files/
└── documents/
    ├── {uuid1}.pdf
    ├── {uuid2}.docx
    └── ...
```

### 8.2 Konfiguration

```properties
filestorage.location=data/files
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

---

## 9. Build und Deployment

### 9.1 Entwicklungsumgebung

```bash
# 1. PostgreSQL starten
docker compose -f docker-compose.dev.yml up -d

# 2. Backend starten (Port 8081)
./mvnw spring-boot:run

# 3. Frontend-Entwicklungsserver (optional)
cd src/main/frontend
npm run dev
```

### 9.2 Produktions-Build

```bash
# Maven baut Backend + Frontend zusammen
./mvnw clean package

# Ergebnis: target/proudig-site-*.jar
```

### 9.3 Umgebungsvariablen

| Variable | Beschreibung |
|----------|--------------|
| `SPRING_DATASOURCE_URL` | Datenbank-URL |
| `SPRING_DATASOURCE_USERNAME` | DB-Benutzername |
| `SPRING_DATASOURCE_PASSWORD` | DB-Passwort |
| `APP_JWT_SECRET` | JWT-Signaturschlüssel |
| `FILESTORAGE_LOCATION` | Dateispeicher-Pfad |
| `PREVIEW_PASSWORD` | Vorschau-Passwort |

---

## 10. Design-Entscheidungen

1. **Monolithische Architektur**: Vereinfachtes Deployment und Betrieb für ein kleines bis mittleres System.

2. **JWT mit Refresh-Tokens**: Balance zwischen Sicherheit (kurze Access-Token-Gültigkeit) und Benutzerfreundlichkeit (lange Sessions).

3. **Dateisystem-Speicherung**: Dokumente werden im Dateisystem gespeichert, Metadaten in der Datenbank. Einfach und effizient, erweiterbar auf Cloud-Storage.

4. **DTO-Pattern**: Klare Trennung zwischen Domain-Modellen und API-Responses.

5. **Liquibase-Migrationen**: Versionierte Datenbankänderungen für reproduzierbare Deployments.

6. **SPA-Routing**: React übernimmt das Frontend-Routing; Backend leitet alle nicht-API-Anfragen an `index.html` weiter.

7. **Aktivitätsprotokoll**: Audit-Trail für alle Dokumentenoperationen.

8. **Hierarchische Ordnerstruktur**: Benutzer können eigene Ordner erstellen und Dokumente organisieren.
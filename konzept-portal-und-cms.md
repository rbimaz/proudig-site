# ProuDig — Konzept: Portal & CMS

---

## Ausgangslage

Die aktuelle ProuDig-Website ist eine reine Marketing-Seite ohne Datenbank, ohne Authentifizierung (nur ein Preview-Passwort) und ohne dynamische Inhalte. Das Backend besteht aus Spring Boot 4.0.3 (Java 21) mit zwei Controllern: einem SPA-Forward-Controller und einem Preview-Auth-Controller. Das Frontend ist eine React 19 SPA (Vite).

Als Referenz dient das Projekt **bissmain-backend**, das bereits ein funktionierendes CMS (Page/Media-Entitäten), JWT-basierte Authentifizierung mit Spring Security, PostgreSQL mit Liquibase-Migrationen und einen Multi-Tenant-File-Storage implementiert hat.

---

## Konzept 1: Portal zur Dokumentenverwaltung

### 1.1 Zweck

Ein geschützter Bereich innerhalb der ProuDig-Webapp, in dem authentifizierte Benutzer Dokumente hochladen, organisieren und gezielt mit anderen Benutzern teilen können. Typische Anwendungsfälle: Projektdokumentation an Kunden übergeben, Verträge/Angebote austauschen, Schulungsunterlagen bereitstellen.

### 1.2 Architektur-Erweiterungen

**Was neu hinzukommt (Backend):**

- **PostgreSQL-Datenbank** mit Liquibase-Migrationen (analog bissmain-backend)
- **Spring Security** mit JWT-Authentifizierung (Access-Token 2h, Refresh-Token 7 Tage)
- **Neue Entitäten**: User, Role, Document, Folder, DocumentShare
- **File-Storage-Service** für die physische Ablage auf dem Server (nicht als BLOB in der DB, um Performance bei großen Dateien zu gewährleisten)
- **REST-API** für alle Portal-Operationen

**Was neu hinzukommt (Frontend):**

- **Login-Seite** unter `/portal/login`
- **Portal-Dashboard** unter `/portal` (geschützt)
- **React-Context** für Auth-State (Token-Verwaltung, Auto-Refresh)
- **Axios-Interceptor** für automatisches Token-Handling

### 1.3 Datenmodell

```
User
├── id (UUID)
├── email (unique)
├── password (BCrypt)
├── firstName
├── lastName
├── company (optional, String)
├── roles → Role (ManyToMany)
├── createdAt
└── lastLoginAt

Role
├── id
└── name (ADMIN, CONSULTANT, CLIENT)

Folder
├── id (UUID)
├── name
├── parentFolder → Folder (nullable, für Verschachtelung)
├── owner → User
├── createdAt
└── updatedAt

Document
├── id (UUID)
├── fileName (Originalname)
├── storagePath (interner Pfad)
├── fileSize (Bytes)
├── contentType (MIME)
├── folder → Folder (nullable)
├── uploadedBy → User
├── description (optional)
├── createdAt
└── updatedAt

DocumentShare
├── id (UUID)
├── document → Document
├── sharedWith → User
├── sharedBy → User
├── permission (VIEW, DOWNLOAD)
├── expiresAt (optional)
└── createdAt
```

### 1.4 Rollen & Berechtigungen

| Aktion | ADMIN | CONSULTANT | CLIENT |
|--------|-------|------------|--------|
| Benutzer anlegen/verwalten | Ja | Nein | Nein |
| Eigene Dokumente hochladen | Ja | Ja | Nein |
| Dokumente mit Benutzern teilen | Ja | Ja | Nein |
| Ordner erstellen/verwalten | Ja | Ja | Nein |
| Geteilte Dokumente einsehen | Ja | Ja | Ja |
| Geteilte Dokumente herunterladen | Ja | Ja | Je nach Share-Permission |

Kunden (CLIENT) sehen ausschließlich Dokumente, die explizit mit ihnen geteilt wurden. Sie haben keinen Zugriff auf die Ordnerstruktur anderer Benutzer.

### 1.5 API-Endpunkte

```
Authentifizierung:
  POST   /api/auth/login          → JWT-Token-Paar
  POST   /api/auth/refresh        → Neues Access-Token
  POST   /api/auth/logout         → Refresh-Token invalidieren

Benutzerverwaltung (ADMIN):
  GET    /api/users               → Alle Benutzer
  POST   /api/users               → Benutzer anlegen
  PUT    /api/users/{id}          → Benutzer bearbeiten
  DELETE /api/users/{id}          → Benutzer löschen

Ordner:
  GET    /api/folders              → Eigene Ordner (Baumstruktur)
  POST   /api/folders              → Ordner erstellen
  PUT    /api/folders/{id}         → Umbenennen/verschieben
  DELETE /api/folders/{id}         → Löschen (nur wenn leer)

Dokumente:
  GET    /api/documents            → Eigene + geteilte Dokumente
  POST   /api/documents            → Upload (Multipart, max 50MB)
  GET    /api/documents/{id}       → Metadaten
  GET    /api/documents/{id}/download → Datei-Download (Stream)
  DELETE /api/documents/{id}       → Löschen (nur eigene)

Sharing:
  POST   /api/documents/{id}/share → Mit Benutzer teilen
  GET    /api/documents/shared-with-me → Erhaltene Dokumente
  DELETE /api/shares/{id}          → Freigabe entziehen
```

### 1.6 File-Storage

Dokumente werden nicht in der Datenbank, sondern im Dateisystem gespeichert — analog zum bissmain-backend FileStorageService, aber ohne Multi-Tenancy (nicht benötigt bei ProuDig).

```
/data/documents/
  ├── {userId}/
  │   ├── {uuid}-originalname.pdf
  │   ├── {uuid}-vertrag.docx
  │   └── ...
```

Vorteile gegenüber BLOB-Speicherung: performanter bei großen Dateien, einfacher Backup, kein DB-Bloat.

### 1.7 Frontend-Struktur

```
/portal/login          → Login-Formular
/portal                → Dashboard (Übersicht: letzte Uploads, geteilte Dokumente)
/portal/documents      → Eigene Dokumente mit Ordner-Navigation
/portal/shared         → "Mit mir geteilt" Ansicht
/portal/users          → Benutzerverwaltung (nur ADMIN)
```

Das Portal wird als eigener Bereich innerhalb der bestehenden React-App implementiert, mit einem separaten Layout (keine Marketing-Navigation, stattdessen Portal-Sidebar). Protected Routes prüfen den Auth-State und leiten auf `/portal/login` um, wenn kein gültiges Token vorhanden ist.

### 1.8 Sicherheitsmaßnahmen

- Passwörter: BCrypt (Strength 12)
- JWT-Secret: mindestens 256-Bit, konfigurierbar via Umgebungsvariable
- File-Upload: Whitelist erlaubter MIME-Types (PDF, DOCX, XLSX, PNG, JPG)
- Dateinamen: UUID-basiert gespeichert, Originalnamen nur in der DB
- CORS: Restriktiv auf die eigene Domain beschränkt
- Rate-Limiting: Login-Endpunkt auf 5 Versuche/Minute begrenzt

---

## Konzept 2: CMS für flexible Website-Inhalte

### 2.1 Zweck

Die aktuellen Website-Inhalte (Texte, Bilder, Teamdaten, Leistungsbeschreibungen) sind fest im React-Quellcode hinterlegt. Jede Textänderung erfordert einen Code-Deploy. Das CMS soll es ermöglichen, Inhalte über eine Admin-Oberfläche zu pflegen, ohne den Quellcode anzufassen.

### 2.2 CMS-Ansatz: Hybrid (Strukturiert + Freitext)

Das CMS kombiniert zwei Content-Modelle:

**A) Strukturierte Content-Blöcke** für die festen Website-Sektionen (Hero, Leistungen, Team, Prozess, Impressum). Diese haben klar definierte Datenfelder und werden über Formulare bearbeitet. Ein Freitext-Editor wäre hier ungeeignet, weil die Struktur fest vorgegeben ist.

**B) Freitext-Seiten mit Markdown** für Blogartikel und Seminarbeschreibungen. Diese Inhalte sind variabel in Länge und Formatierung und brauchen die Freiheit eines Editors — Absätze, Zwischenüberschriften, Listen, eingebettete Bilder. Das Markdown-Modell orientiert sich am Page-Entity des bissmain-backends, wird aber um Kategorisierung, Tags und zusätzliche strukturierte Metadaten (speziell für Seminare) erweitert.

### 2.3 Datenmodell

**A) Strukturierte Sektionen:**

```
ContentBlock
├── id (UUID)
├── sectionKey (unique String, z.B. "hero", "leistungen", "team")
├── content (JSONB — flexibles, strukturiertes Datenfeld)
├── draftContent (JSONB — Entwurf, nullable)
├── updatedBy → User
├── updatedAt
└── publishedAt (nullable — nur veröffentlichte Inhalte werden angezeigt)
```

**Warum JSONB?** Jede Sektion hat eine andere Struktur. Der Hero-Bereich hat Titel, Untertitel, CTA-Texte. Die Team-Sektion hat ein Array von Personen mit Name, Titel, Fokus, Bild. JSONB erlaubt es, diese unterschiedlichen Strukturen in einer einzigen Tabelle flexibel abzubilden, ohne für jede Sektion eine eigene Tabelle zu brauchen.

**B) Freitext-Seiten (Blog & Seminare):**

```
Page
├── id (UUID)
├── slug (unique, URL-Pfad, z.B. "ki-im-mittelstand")
├── title
├── category (BLOG, SEMINAR)
├── content (TEXT — Markdown)
├── excerpt (kurze Zusammenfassung für Übersichtsseiten, max 300 Zeichen)
├── coverImageId → Media (optional, Titelbild)
├── tags (String[], z.B. ["KI", "Mittelstand", "Strategie"])
├── metaData (JSONB — zusätzliche strukturierte Felder, s.u.)
├── status (DRAFT, PUBLISHED, ARCHIVED)
├── author → User
├── publishedAt (nullable)
├── createdAt
└── updatedAt
```

Das `metaData`-Feld ist für Seminare entscheidend. Es enthält die strukturierten Zusatzinformationen, die über den Fließtext hinausgehen und im Frontend als Infobox dargestellt werden:

**Seminar-Metadaten** (`category: SEMINAR`):
```json
{
  "date": "2026-06-15",
  "endDate": "2026-06-16",
  "time": "09:00–17:00",
  "location": "Stuttgart, ProuDig Office",
  "format": "ONSITE",
  "duration": "2 Tage",
  "maxParticipants": 12,
  "currentParticipants": 4,
  "price": "1.490 € zzgl. MwSt.",
  "registrationLink": "https://...",
  "registrationDeadline": "2026-06-01",
  "targetAudience": "Führungskräfte und IT-Leiter im Mittelstand",
  "prerequisites": "Keine Vorkenntnisse erforderlich"
}
```

**Blog-Metadaten** (`category: BLOG`):
```json
{
  "readingTime": 8,
  "featured": true
}
```

**Medien:**

```
Media (gemeinsam für CMS + Blog + Seminare)
├── id (UUID)
├── name
├── title
├── contentType
├── storagePath (Dateisystem statt BLOB)
├── fileSize
├── uploadedBy → User
└── createdAt
```

### 2.4 Content-Struktur pro Sektion (JSON-Schema-Beispiele)

**Hero-Sektion** (`sectionKey: "hero"`):
```json
{
  "badge": "BERATUNG · SOFTWARE · KI · SCHULUNGEN",
  "title": "Von der Idee zur digitalen",
  "titleAccent": "Wirkung.",
  "description": "Wir begleiten Unternehmen bei der digitalen Transformation...",
  "ctaPrimary": { "text": "Kostenloses Erstgespräch", "link": "#kontakt" },
  "ctaSecondary": { "text": "Leistungen entdecken", "link": "#leistungen" }
}
```

**Team-Sektion** (`sectionKey: "team"`):
```json
{
  "tag": "ÜBER UNS",
  "title": "Unser Team — Ihre Partner auf Augenhöhe",
  "description": "Digitalisierung ist Vertrauenssache...",
  "members": [
    {
      "name": "Max Mustermann",
      "title": "Prof. Dr.",
      "fokus": "Künstliche Intelligenz & Machine Learning",
      "imageId": "uuid-des-media-eintrags"
    }
  ]
}
```

**Leistungen-Sektion** (`sectionKey: "leistungen"`):
```json
{
  "tag": "UNSERE LEISTUNGEN",
  "title": "Ihr Partner für die digitale Transformation.",
  "services": [
    {
      "icon": "brain",
      "title": "KI-Anwendungen",
      "description": "Entwicklung intelligenter..."
    }
  ]
}
```

**Impressum** (`sectionKey: "impressum"`):
```json
{
  "company": "ProuDig GmbH",
  "address": { "street": "Musterstraße 123", "zip": "70173", "city": "Stuttgart" },
  "contact": { "phone": "+49 (0) 711 123 456 78", "email": "info@proudig.de" },
  "register": { "court": "Amtsgericht Stuttgart", "number": "HRB 123456" },
  "directors": ["Max Mustermann", "Maria Musterfrau"],
  "vatId": "DE123456789"
}
```

### 2.5 API-Endpunkte

```
Öffentlich (ohne Auth — Frontend konsumiert diese):

  Strukturierte Sektionen:
  GET    /api/content/{sectionKey}     → Veröffentlichter Content-Block
  GET    /api/content                  → Alle veröffentlichten Blöcke

  Blog:
  GET    /api/blog                     → Veröffentlichte Artikel (paginiert, sortiert nach Datum)
  GET    /api/blog/{slug}              → Einzelner Artikel
  GET    /api/blog/tags                → Alle verfügbaren Tags
  GET    /api/blog?tag=KI              → Artikel gefiltert nach Tag

  Seminare:
  GET    /api/seminare                 → Kommende Seminare (sortiert nach Datum)
  GET    /api/seminare/{slug}          → Einzelnes Seminar mit Metadaten
  GET    /api/seminare/archive         → Vergangene Seminare

  Medien:
  GET    /api/media/{id}               → Medien-Datei abrufen

Admin (Auth erforderlich, Rolle ADMIN oder CONSULTANT):

  Strukturierte Sektionen:
  GET    /api/admin/content            → Alle Blöcke (inkl. Entwürfe)
  GET    /api/admin/content/{key}      → Block mit Draft-Stand
  PUT    /api/admin/content/{key}      → Block aktualisieren (Entwurf)
  POST   /api/admin/content/{key}/publish → Entwurf veröffentlichen

  Seiten (Blog + Seminare):
  GET    /api/admin/pages              → Alle Seiten (inkl. Drafts)
  GET    /api/admin/pages/{id}         → Einzelne Seite zum Bearbeiten
  POST   /api/admin/pages              → Neue Seite erstellen
  PUT    /api/admin/pages/{id}         → Seite aktualisieren
  PUT    /api/admin/pages/{id}/publish → Status auf PUBLISHED setzen
  PUT    /api/admin/pages/{id}/archive → Status auf ARCHIVED setzen
  DELETE /api/admin/pages/{id}         → Seite löschen (nur Drafts)

  Medien:
  POST   /api/admin/media              → Medien-Upload
  GET    /api/admin/media              → Alle Medien auflisten
  DELETE /api/admin/media/{id}         → Medium löschen
```

### 2.6 Draft/Publish-Workflow

Jeder Content-Block hat zwei Zustände: **Draft** (Entwurf) und **Published** (veröffentlicht). Beim Bearbeiten wird immer der Draft aktualisiert. Erst durch explizites "Veröffentlichen" wird der Draft zum aktiven Inhalt. Das Frontend zeigt immer nur den veröffentlichten Stand an.

```
Bearbeiten → Draft speichern → Vorschau → Veröffentlichen
                                   ↓
                            Verwerfen (Draft zurücksetzen auf Published)
```

### 2.7 Frontend-Integration

**Öffentliche Website:**

Die React-Komponenten (Hero, Expertise, About, etc.) laden ihre Inhalte beim Start per API statt aus hartcodierten Konstanten. Ein zentraler `ContentProvider` (React Context) holt alle veröffentlichten Blöcke und stellt sie den Komponenten zur Verfügung. Fallback: Falls die API nicht erreichbar ist, werden die aktuellen hartcodierten Werte als Default verwendet.

Für Blog und Seminare entstehen neue öffentliche Seiten:

```
/blog                  → Übersichtsseite (Kachelansicht, paginiert)
/blog/{slug}           → Einzelner Artikel (Markdown gerendert)
/seminare              → Übersicht kommender Seminare
/seminare/{slug}       → Seminar-Detailseite (Infobox + Beschreibung)
/seminare/archiv       → Vergangene Seminare
```

Die Blog-Übersicht zeigt pro Artikel: Titelbild, Titel, Excerpt, Datum, Tags und Lesezeit. Die Seminar-Übersicht zeigt pro Seminar: Titel, Datum, Ort/Format, Preis und Teilnehmerstatus (z.B. "4 von 12 Plätzen belegt"). Vergangene Seminare werden automatisch ins Archiv verschoben (basierend auf dem Datum im metaData-Feld).

Die Navigation wird um "Blog" und "Seminare" erweitert.

**Markdown-Rendering:**

Blog- und Seminarinhalte werden als Markdown gespeichert und im Frontend mit einer Rendering-Library (z.B. `react-markdown` oder `marked`) dargestellt. Bilder im Markdown referenzieren Media-IDs (`![Alt-Text](/api/media/{id})`), die beim Erstellen über den integrierten Media-Upload eingefügt werden. Die gerenderte Ausgabe erhält eine einheitliche Typografie-Klasse, die zum restlichen Website-Design passt.

**Admin-Bereich:**

Unter `/admin` entsteht die Verwaltungsoberfläche:

```
/admin/login           → Login (gleiche Auth wie Portal)
/admin                 → Dashboard (Übersicht: letzte Änderungen, Entwürfe)
/admin/content/{key}   → Formular-basierter Editor für strukturierte Sektionen
/admin/blog            → Blog-Artikelliste (Erstellen, Bearbeiten, Status ändern)
/admin/blog/new        → Neuer Artikel (Markdown-Editor + Metadaten)
/admin/blog/{id}       → Artikel bearbeiten
/admin/seminare        → Seminar-Liste
/admin/seminare/new    → Neues Seminar (Markdown-Editor + Seminar-Metadaten-Formular)
/admin/seminare/{id}   → Seminar bearbeiten
/admin/media           → Mediathek (Upload, Übersicht, Löschen)
```

Für die strukturierten Sektionen (Hero, Team, etc.) werden **Formulare** verwendet. Für Blog und Seminare kommt ein **Markdown-Editor mit Live-Vorschau** zum Einsatz — ergänzt um strukturierte Felder: bei Blog-Artikeln Titel, Slug, Tags, Excerpt und Titelbild; bei Seminaren zusätzlich die Seminar-Metadaten (Datum, Ort, Preis, max. Teilnehmer etc.) als Formularfelder neben dem Editor.

### 2.8 Abgrenzung zum bissmain-CMS

| Aspekt | bissmain-backend | ProuDig CMS |
|--------|-----------------|-------------|
| Content-Modell | Nur Freitext (HTML/Markdown) | Hybrid: Strukturiert (Sektionen) + Freitext (Blog/Seminare) |
| Seitentypen | Generische Pages | ContentBlocks + Pages mit Kategorien (BLOG, SEMINAR) |
| Media-Speicherung | BLOB in PostgreSQL | Dateisystem (performanter) |
| Multi-Tenancy | Ja (Firmen-basiert) | Nein (Single-Tenant) |
| Editor | Markdown/HTML-Editor | Formulare (Sektionen) + Markdown-Editor (Blog/Seminare) |
| Draft/Publish | Nein | Ja (Draft → Published → Archived) |
| Seminar-Features | Nein | Metadaten (Datum, Ort, Preis, Teilnehmer), Auto-Archivierung |
| Blog-Features | Nein | Tags, Lesezeit, Featured-Flag, Excerpt |
| Wiederverwendbar | Page + Media Entitäten, JWT-Auth, Security-Config | — |

**Was vom bissmain-backend übernommen wird:**
- JWT-Authentifizierung (JwtTokenProvider, JwtAuthFilter, SecurityConfig) — angepasst an Spring Boot 4
- User/Role-Entitäten und Auth-Endpunkte
- Grundstruktur des Media-Handlings (Upload, Content-Type-Erkennung)
- Liquibase-Migrations-Pattern
- BCrypt-Passwort-Hashing
- CORS-Konfiguration

---

## Gemeinsame Infrastruktur (Portal + CMS)

Portal und CMS teilen sich die gleiche Basis:

```
Shared:
  ├── PostgreSQL-Datenbank
  ├── Spring Security + JWT-Auth
  ├── User/Role-Entitäten
  ├── File-Storage-Service
  └── Liquibase-Migrationen

Portal-spezifisch:
  ├── Document/Folder/DocumentShare-Entitäten
  ├── Portal-REST-API
  └── Portal-Frontend (/portal/*)

CMS-spezifisch:
  ├── ContentBlock/Media-Entitäten
  ├── Content-REST-API (öffentlich + admin)
  └── Admin-Frontend (/admin/*)
```

### Implementierungsreihenfolge (Vorschlag)

```
Phase 1: Fundament
  → PostgreSQL + Liquibase einrichten
  → Spring Security + JWT (aus bissmain-backend portieren)
  → User/Role-Entitäten + Auth-API
  → Login-Seite (Frontend)

Phase 2: CMS — Strukturierte Sektionen
  → ContentBlock + Media Entitäten
  → Content-API (öffentlich + admin)
  → Admin-Oberfläche (Sektions-Formulare + Mediathek)
  → Frontend-Komponenten auf API-Daten umstellen

Phase 3: CMS — Blog & Seminare
  → Page-Entity mit Kategorien und Metadaten
  → Blog-API + Seminar-API (öffentlich + admin)
  → Markdown-Editor im Admin-Bereich
  → Öffentliche Seiten: Blog-Übersicht, Artikel, Seminar-Übersicht, Detailseite
  → Navigation um Blog + Seminare erweitern
  → Auto-Archivierung vergangener Seminare

Phase 4: Dokumentenportal
  → Document/Folder/Share Entitäten
  → File-Storage-Service
  → Portal-API
  → Portal-Frontend

Phase 5: Feinschliff
  → E-Mail-Benachrichtigungen bei neuen Shares
  → Activity-Log (wer hat wann was hochgeladen/geteilt)
  → Datei-Vorschau (PDF inline, Bilder als Thumbnail)
  → SEO-Optimierung für Blog/Seminare (Meta-Tags, Open Graph)
  → RSS-Feed für Blog (optional)
```

---

*Warte auf dein Feedback zu beiden Konzepten.*

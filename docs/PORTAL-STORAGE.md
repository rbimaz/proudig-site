# ProuDig Site - Portal-Inhaltsspeicherung

## 1. Übersicht

Das Dokumentenportal speichert Inhalte in einem hybriden System:
- **Metadaten** werden in der PostgreSQL-Datenbank gespeichert
- **Dateien** werden im Dateisystem abgelegt

Diese Trennung ermöglicht effiziente Datenbankabfragen bei gleichzeitig skalierbarem Dateispeicher.

---

## 2. Speicherarchitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│                                                                  │
│   PortalDocuments.jsx                                           │
│   ├── Upload-Formular                                           │
│   ├── Ordner-Navigation                                         │
│   └── Dokument-Liste                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (FormData / JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (Spring Boot)                     │
│                                                                  │
│   DocumentController ─────► DocumentService                     │
│                                   │                              │
│                     ┌─────────────┴─────────────┐               │
│                     ▼                           ▼               │
│           FileStorageService          DocumentRepository        │
└─────────────────────────────────────────────────────────────────┘
                     │                           │
                     ▼                           ▼
┌─────────────────────────┐     ┌─────────────────────────────────┐
│      Dateisystem         │     │         PostgreSQL DB           │
│                          │     │                                 │
│  data/files/documents/   │     │  Tabellen:                      │
│  ├── uuid1.pdf           │     │  ├── documents                  │
│  ├── uuid2.docx          │     │  ├── folders                    │
│  └── uuid3.xlsx          │     │  ├── document_shares            │
│                          │     │  └── activity_log               │
└─────────────────────────┘     └─────────────────────────────────┘
```

---

## 3. Datenbank-Schema

### 3.1 Tabelle: `folders`

Speichert die Ordnerstruktur für die hierarchische Navigation.

```sql
CREATE TABLE folders (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    parent_folder_id BIGINT REFERENCES folders(id),
    owner_id        BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | BIGINT | Eindeutige Ordner-ID |
| `name` | VARCHAR(255) | Ordnername |
| `parent_folder_id` | BIGINT | Referenz auf übergeordneten Ordner (NULL = Root) |
| `owner_id` | BIGINT | Benutzer, dem der Ordner gehört |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzter Änderungszeitpunkt |

**Beziehungen:**
- Self-Reference für hierarchische Struktur (parent_folder_id → folders.id)
- Fremdschlüssel zu users (owner_id → users.id)

### 3.2 Tabelle: `documents`

Speichert Metadaten zu hochgeladenen Dokumenten.

```sql
CREATE TABLE documents (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_name       VARCHAR(255) NOT NULL,
    storage_path    VARCHAR(500) NOT NULL,
    file_size       BIGINT NOT NULL,
    content_type    VARCHAR(100),
    folder_id       BIGINT REFERENCES folders(id),
    uploaded_by     BIGINT NOT NULL REFERENCES users(id),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | BIGINT | Eindeutige Dokument-ID |
| `file_name` | VARCHAR(255) | Originaler Dateiname |
| `storage_path` | VARCHAR(500) | Relativer Pfad im Dateisystem |
| `file_size` | BIGINT | Dateigröße in Bytes |
| `content_type` | VARCHAR(100) | MIME-Typ (z.B. `application/pdf`) |
| `folder_id` | BIGINT | Zugehöriger Ordner (NULL = Root-Ebene) |
| `uploaded_by` | BIGINT | Benutzer, der hochgeladen hat |
| `description` | TEXT | Optionale Beschreibung |
| `created_at` | TIMESTAMP | Upload-Zeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

**Beziehungen:**
- Fremdschlüssel zu folders (folder_id → folders.id)
- Fremdschlüssel zu users (uploaded_by → users.id)

### 3.3 Tabelle: `document_shares`

Ermöglicht das Teilen von Dokumenten mit anderen Benutzern.

```sql
CREATE TABLE document_shares (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id     BIGINT NOT NULL REFERENCES documents(id),
    shared_with     BIGINT NOT NULL REFERENCES users(id),
    shared_by       BIGINT NOT NULL REFERENCES users(id),
    permission      VARCHAR(50) NOT NULL,
    expires_at      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | BIGINT | Eindeutige Freigabe-ID |
| `document_id` | BIGINT | Referenz auf geteiltes Dokument |
| `shared_with` | BIGINT | Benutzer, der Zugriff erhält |
| `shared_by` | BIGINT | Benutzer, der Zugriff gewährt |
| `permission` | VARCHAR(50) | Berechtigungsstufe |
| `expires_at` | TIMESTAMP | Ablaufdatum (optional) |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |

**Berechtigungsstufen (permission):**
- `VIEW` - Dokument ansehen
- `DOWNLOAD` - Dokument herunterladen
- `EDIT` - Dokument bearbeiten (Beschreibung ändern)

### 3.4 Tabelle: `activity_log`

Protokolliert Benutzeraktionen für Audit-Zwecke.

```sql
CREATE TABLE activity_log (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       BIGINT,
    details         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | BIGINT | Eindeutige Log-ID |
| `user_id` | BIGINT | Handelnder Benutzer |
| `action` | VARCHAR(50) | Art der Aktion |
| `entity_type` | VARCHAR(50) | Betroffener Entitätstyp |
| `entity_id` | BIGINT | ID der betroffenen Entität |
| `details` | TEXT | Zusätzliche Details (JSON) |
| `created_at` | TIMESTAMP | Zeitpunkt der Aktion |

**Aktionstypen (action):**
- `UPLOAD` - Dokument hochgeladen
- `DOWNLOAD` - Dokument heruntergeladen
- `DELETE` - Dokument/Ordner gelöscht
- `SHARE` - Dokument geteilt
- `UNSHARE` - Freigabe widerrufen
- `CREATE_FOLDER` - Ordner erstellt
- `RENAME` - Dokument/Ordner umbenannt

---

## 4. Dateisystem-Speicherung

### 4.1 Speicherort

```
proudig-site/
└── data/
    └── files/
        └── documents/
            ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
            ├── b2c3d4e5-f6a7-8901-bcde-f12345678901.docx
            └── c3d4e5f6-a7b8-9012-cdef-123456789012.xlsx
```

### 4.2 Konfiguration

**application.properties:**
```properties
# Speicherort für Dateien
filestorage.location=data/files

# Maximale Upload-Größe
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

### 4.3 Dateinamenskonvention

Dateien werden mit **UUID** umbenannt, um:
- Kollisionen bei gleichen Dateinamen zu vermeiden
- Vorhersagbare Pfade zu verhindern (Sicherheit)
- Sonderzeichen in Dateinamen zu umgehen

**Beispiel:**
- Original: `Vertrag_2025.pdf`
- Gespeichert als: `documents/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf`
- Original-Name in DB: `file_name = 'Vertrag_2025.pdf'`
- Speicherpfad in DB: `storage_path = 'documents/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf'`

---

## 5. Datenfluss

### 5.1 Dokument-Upload

```
┌──────────┐    ┌──────────────────┐    ┌─────────────────┐
│  User    │    │ DocumentController│    │ DocumentService │
└────┬─────┘    └────────┬─────────┘    └────────┬────────┘
     │                   │                       │
     │ POST /api/documents                       │
     │ (FormData: file, folderId)                │
     │──────────────────►│                       │
     │                   │ uploadDocument(file)  │
     │                   │──────────────────────►│
     │                   │                       │
     │                   │     ┌─────────────────┼────────────────┐
     │                   │     │                 ▼                │
     │                   │     │  ┌─────────────────────────────┐ │
     │                   │     │  │    FileStorageService       │ │
     │                   │     │  │                             │ │
     │                   │     │  │ 1. UUID generieren          │ │
     │                   │     │  │ 2. Datei speichern          │ │
     │                   │     │  │ 3. Pfad zurückgeben         │ │
     │                   │     │  └─────────────────────────────┘ │
     │                   │     │                 │                │
     │                   │     │                 ▼                │
     │                   │     │  ┌─────────────────────────────┐ │
     │                   │     │  │   DocumentRepository        │ │
     │                   │     │  │                             │ │
     │                   │     │  │ Document entity speichern:  │ │
     │                   │     │  │ - fileName (original)       │ │
     │                   │     │  │ - storagePath (uuid)        │ │
     │                   │     │  │ - fileSize                  │ │
     │                   │     │  │ - contentType               │ │
     │                   │     │  │ - folderId                  │ │
     │                   │     │  │ - uploadedBy                │ │
     │                   │     │  └─────────────────────────────┘ │
     │                   │     │                 │                │
     │                   │     │                 ▼                │
     │                   │     │  ┌─────────────────────────────┐ │
     │                   │     │  │   ActivityLogService        │ │
     │                   │     │  │   Log: UPLOAD action        │ │
     │                   │     │  └─────────────────────────────┘ │
     │                   │     └─────────────────┬────────────────┘
     │                   │◄──────────────────────┘
     │   DocumentDTO     │
     │◄──────────────────│
```

### 5.2 Dokument-Download

```
┌──────────┐    ┌──────────────────┐    ┌─────────────────┐
│  User    │    │ DocumentController│    │ DocumentService │
└────┬─────┘    └────────┬─────────┘    └────────┬────────┘
     │                   │                       │
     │ GET /api/documents/{id}/download          │
     │──────────────────►│                       │
     │                   │ downloadDocument(id)  │
     │                   │──────────────────────►│
     │                   │                       │
     │                   │     ┌─────────────────┼────────────────┐
     │                   │     │ 1. Document aus DB laden        │
     │                   │     │ 2. Berechtigung prüfen          │
     │                   │     │    - Eigentümer ODER            │
     │                   │     │    - Freigabe vorhanden         │
     │                   │     │ 3. Datei aus Filesystem laden   │
     │                   │     │ 4. Activity Log schreiben       │
     │                   │     └─────────────────┬────────────────┘
     │                   │◄──────────────────────┘
     │   File (Binary)   │
     │   Content-Type    │
     │   Content-Disp.   │
     │◄──────────────────│
```

### 5.3 Ordner-Navigation

```
┌──────────┐    ┌──────────────────┐    ┌─────────────────┐
│  User    │    │  FolderController │    │  FolderService  │
└────┬─────┘    └────────┬─────────┘    └────────┬────────┘
     │                   │                       │
     │ GET /api/folders  │                       │
     │ (parentId=null)   │                       │
     │──────────────────►│                       │
     │                   │ getRootFolders(user)  │
     │                   │──────────────────────►│
     │                   │                       │
     │                   │     ┌─────────────────┼───────────────┐
     │                   │     │ FolderRepository                │
     │                   │     │ findByOwnerAndParentIsNull()    │
     │                   │     └─────────────────┬───────────────┘
     │                   │◄──────────────────────┘
     │   [FolderDTO]     │
     │◄──────────────────│
     │                   │
     │ GET /api/folders/{id}/children            │
     │──────────────────►│                       │
     │                   │ getSubFolders(id)     │
     │                   │──────────────────────►│
     │   [FolderDTO]     │                       │
     │◄──────────────────│◄──────────────────────│
```

---

## 6. Zugriffskontrolle

### 6.1 Berechtigungsmodell

```
┌─────────────────────────────────────────────────────────────┐
│                      ZUGRIFFSPRÜFUNG                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dokument-Zugriff erlaubt wenn:                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  document.uploadedBy == currentUser                 │    │
│  │                    ODER                              │    │
│  │  DocumentShare existiert mit:                       │    │
│  │    - document_id == document.id                     │    │
│  │    - shared_with == currentUser.id                  │    │
│  │    - (expires_at IS NULL OR expires_at > NOW())     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Ordner-Zugriff erlaubt wenn:                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  folder.owner == currentUser                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Service-Layer Prüfung

```java
// DocumentService.java (Pseudocode)
public Document downloadDocument(Long documentId, User currentUser) {
    Document doc = documentRepository.findById(documentId)
        .orElseThrow(() -> new NotFoundException());

    // Prüfung 1: Ist der Benutzer der Eigentümer?
    if (doc.getUploadedBy().equals(currentUser)) {
        return doc;
    }

    // Prüfung 2: Wurde das Dokument mit dem Benutzer geteilt?
    Optional<DocumentShare> share = documentShareRepository
        .findByDocumentAndSharedWith(doc, currentUser);

    if (share.isPresent() && !share.get().isExpired()) {
        return doc;
    }

    throw new AccessDeniedException();
}
```

---

## 7. Domain-Entitäten (Java)

### 7.1 Folder Entity

```java
@Entity
@Table(name = "folders")
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    private Folder parent;

    @OneToMany(mappedBy = "parent")
    private List<Folder> children;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 7.2 Document Entity

```java
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String storagePath;

    private Long fileSize;
    private String contentType;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 7.3 DocumentShare Entity

```java
@Entity
@Table(name = "document_shares")
public class DocumentShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne
    @JoinColumn(name = "shared_with", nullable = false)
    private User sharedWith;

    @ManyToOne
    @JoinColumn(name = "shared_by", nullable = false)
    private User sharedBy;

    @Enumerated(EnumType.STRING)
    private DocumentPermission permission;

    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
```

---

## 8. FileStorageService

Der `FileStorageService` verwaltet alle Dateisystem-Operationen.

### 8.1 Hauptmethoden

| Methode | Beschreibung |
|---------|--------------|
| `store(MultipartFile file)` | Speichert Datei, gibt Pfad zurück |
| `load(String path)` | Lädt Datei als Resource |
| `delete(String path)` | Löscht Datei aus Filesystem |

### 8.2 Implementierung (vereinfacht)

```java
@Service
public class FileStorageService {

    @Value("${filestorage.location}")
    private String storageLocation;

    public String store(MultipartFile file) {
        String uuid = UUID.randomUUID().toString();
        String extension = getExtension(file.getOriginalFilename());
        String filename = uuid + extension;

        Path targetPath = Paths.get(storageLocation, "documents", filename);
        Files.copy(file.getInputStream(), targetPath);

        return "documents/" + filename;
    }

    public Resource load(String path) {
        Path filePath = Paths.get(storageLocation).resolve(path);
        return new UrlResource(filePath.toUri());
    }

    public void delete(String path) {
        Path filePath = Paths.get(storageLocation).resolve(path);
        Files.deleteIfExists(filePath);
    }
}
```

---

## 9. API-Endpunkte

### 9.1 Dokumente

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `GET` | `/api/documents` | Liste eigener Dokumente |
| `GET` | `/api/documents/{id}` | Dokument-Details |
| `GET` | `/api/documents/{id}/download` | Dokument herunterladen |
| `GET` | `/api/documents/folder/{folderId}` | Dokumente im Ordner |
| `POST` | `/api/documents` | Dokument hochladen |
| `PUT` | `/api/documents/{id}` | Dokument aktualisieren |
| `DELETE` | `/api/documents/{id}` | Dokument löschen |

### 9.2 Ordner

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `GET` | `/api/folders` | Root-Ordner auflisten |
| `GET` | `/api/folders/{id}` | Ordner-Details |
| `GET` | `/api/folders/{id}/children` | Unterordner auflisten |
| `POST` | `/api/folders` | Ordner erstellen |
| `PUT` | `/api/folders/{id}` | Ordner umbenennen |
| `DELETE` | `/api/folders/{id}` | Ordner löschen |

### 9.3 Freigaben

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `GET` | `/api/shares` | Meine Freigaben |
| `POST` | `/api/shares` | Dokument teilen |
| `PUT` | `/api/shares/{id}` | Freigabe ändern |
| `DELETE` | `/api/shares/{id}` | Freigabe widerrufen |

---

## 10. Zusammenfassung

| Aspekt | Speicherort | Details |
|--------|-------------|---------|
| **Dokument-Dateien** | Dateisystem | `data/files/documents/{uuid}.{ext}` |
| **Dokument-Metadaten** | PostgreSQL | Tabelle `documents` |
| **Ordnerstruktur** | PostgreSQL | Tabelle `folders` (hierarchisch) |
| **Freigaben** | PostgreSQL | Tabelle `document_shares` |
| **Aktivitätslog** | PostgreSQL | Tabelle `activity_log` |

**Vorteile dieser Architektur:**
- Schnelle Datenbankabfragen für Metadaten
- Effiziente Dateispeicherung (keine Blobs in DB)
- Einfache Backup-Strategie (DB + Filesystem)
- Erweiterbar auf Cloud-Storage (S3, Azure Blob, etc.)
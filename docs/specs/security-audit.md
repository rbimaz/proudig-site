# Security Audit: ProuDig-Site

**Datum:** 2026-06-16
**Status:** Offen
**Analyst:** Claude Code (Security Review)

---

## Executive Summary

Die Sicherheitsanalyse hat **22 Schwachstellen** identifiziert:
- **8 Kritisch** - Sofortige Behebung erforderlich
- **8 Hoch** - Behebung innerhalb einer Woche
- **6 Mittel** - Behebung in nächster Iteration

Die kritischsten Risiken sind Path Traversal, hardcodierte Credentials und XSS-Schwachstellen.

---

## Findings nach Priorität

### KRITISCH (P0) - Sofort beheben

#### SEC-001: Path Traversal in FileStorageService

| Attribut | Wert |
|----------|------|
| **Datei** | `src/main/java/de/proudig/site/service/FileStorageService.java` |
| **Zeilen** | 61-80 |
| **CVSS** | 9.1 (Critical) |
| **CWE** | CWE-22: Path Traversal |

**Problem:**
```java
Path uploadPath = Paths.get(fileStorageProperties.getLocation());
if (subDir != null && !subDir.isEmpty()) {
    uploadPath = uploadPath.resolve(subDir);  // VULNERABLE
}
Path filePath = uploadPath.resolve(filename).normalize();  // normalize zu spät
```

**Exploit:** `subDir="../../../etc"` ermöglicht Zugriff auf `/etc/passwd`

**Behebung:**
```java
private static final Set<String> ALLOWED_SUBDIRS = Set.of("documents", "media");

public Path storeFile(MultipartFile file, String subDir) {
    if (subDir != null && !ALLOWED_SUBDIRS.contains(subDir)) {
        throw new IllegalArgumentException("Invalid subdirectory: " + subDir);
    }
    Path basePath = Paths.get(fileStorageProperties.getLocation()).toAbsolutePath().normalize();
    Path targetPath = basePath.resolve(subDir).normalize();

    if (!targetPath.startsWith(basePath)) {
        throw new SecurityException("Path traversal attempt detected");
    }
    // ...
}
```

---

#### SEC-002: Hardcoded JWT Secret

| Attribut | Wert |
|----------|------|
| **Datei** | `src/main/resources/application.properties` |
| **Zeile** | 23 |
| **CVSS** | 9.8 (Critical) |
| **CWE** | CWE-798: Hardcoded Credentials |

**Problem:**
```properties
app.jwt-secret=proudig-secret-key-change-in-production-environment-12345678
```

**Risiko:** Angreifer können beliebige JWT-Tokens fälschen und sich als jeder User authentifizieren.

**Behebung:**
1. Secret aus Properties entfernen
2. Environment Variable verwenden:
   ```properties
   app.jwt-secret=${JWT_SECRET}
   ```
3. Secret generieren: `openssl rand -base64 32`
4. In `.env` auf Server hinterlegen (nicht in Git)

---

#### SEC-003: Hardcoded Datenbank-Credentials

| Attribut | Wert |
|----------|------|
| **Dateien** | `application.properties:9-10`, `docker-compose.yml:23,54`, `docker-compose.dev.yml:21-22` |
| **CVSS** | 8.6 (High) |
| **CWE** | CWE-798: Hardcoded Credentials |

**Problem:**
```properties
spring.datasource.username=proudig
spring.datasource.password=proudig123
```

**Behebung:**
1. Credentials aus Source-Code entfernen
2. Nur Environment Variables mit Defaults für Dev:
   ```yaml
   POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be set}
   ```
3. Git-History bereinigen (alte Commits enthalten Passwörter)

---

#### SEC-004: XSS via dangerouslySetInnerHTML

| Attribut | Wert |
|----------|------|
| **Dateien** | `StaticPageEditor.jsx:321`, `StaticPageRenderer.jsx:77` |
| **CVSS** | 8.1 (High) |
| **CWE** | CWE-79: Cross-Site Scripting |

**Problem:**
```jsx
<div dangerouslySetInnerHTML={{ __html: content }} />
```

**Exploit:** `<img src=x onerror="fetch('/api/admin',{headers:{Authorization:localStorage.getItem('proudig-token')}})">`

**Behebung:**
```bash
npm install dompurify
```
```jsx
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

---

#### SEC-005: Auth-Tokens in localStorage

| Attribut | Wert |
|----------|------|
| **Datei** | `src/main/frontend/src/contexts/AuthContext.jsx` |
| **Zeilen** | 7, 20-21, 27, 38-39, 43, 55, 59-60, 76 |
| **CVSS** | 7.5 (High) |
| **CWE** | CWE-922: Insecure Storage of Sensitive Information |

**Problem:**
```javascript
localStorage.setItem('proudig-token', data.token);
localStorage.setItem('proudig-refresh', data.refreshToken);
```

**Risiko:** Bei XSS (SEC-004) können alle Tokens gestohlen werden.

**Behebung:**
- Option A: HTTPOnly Secure Cookies (Backend-Änderung erforderlich)
- Option B: Token nur im Memory halten, Refresh via HTTPOnly Cookie

---

#### SEC-006: Hardcoded Preview-Password im Frontend

| Attribut | Wert |
|----------|------|
| **Dateien** | `ComingSoon.jsx:3`, `Dockerfile:24` |
| **CVSS** | 5.3 (Medium) |
| **CWE** | CWE-798: Hardcoded Credentials |

**Problem:**
```javascript
const FALLBACK_PASSWORD = 'proudig2026';
```

**Risiko:** Passwort ist im JavaScript-Bundle sichtbar.

**Behebung:**
1. Fallback-Logik im Frontend entfernen
2. Nur Server-seitige Validierung verwenden
3. Preview-Passwort nur via Environment Variable

---

#### SEC-007: CSRF-Schutz deaktiviert

| Attribut | Wert |
|----------|------|
| **Datei** | `src/main/java/de/proudig/site/security/SecurityConfig.java` |
| **Zeile** | 38 |
| **CVSS** | 6.5 (Medium) |
| **CWE** | CWE-352: Cross-Site Request Forgery |

**Problem:**
```java
.csrf(csrf -> csrf.disable())
```

**Behebung:**
Bei SPA mit JWT ist CSRF weniger kritisch, aber für Cookie-basierte Auth:
```java
.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .ignoringRequestMatchers("/api/public/**")
)
```

---

#### SEC-008: Schwache Passwort-Anforderungen

| Attribut | Wert |
|----------|------|
| **Dateien** | `AuthController.java:139-141`, `ChangePassword.jsx:19` |
| **CVSS** | 7.3 (High) |
| **CWE** | CWE-521: Weak Password Requirements |

**Problem:**
```java
if (request.getNewPassword().length() < 3) {
    return ResponseEntity.badRequest().body("Passwort muss mindestens 3 Zeichen lang sein");
}
```

**Behebung:**
```java
private static final int MIN_PASSWORD_LENGTH = 12;
private static final Pattern PASSWORD_PATTERN = Pattern.compile(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,}$"
);

if (!PASSWORD_PATTERN.matcher(password).matches()) {
    return ResponseEntity.badRequest()
        .body("Passwort muss mind. 12 Zeichen mit Groß-/Kleinbuchstaben und Zahl enthalten");
}
```

---

### HOCH (P1) - Diese Woche beheben

#### SEC-009: Unsichere Content Security Policy

| Attribut | Wert |
|----------|------|
| **Dateien** | `Caddyfile:23`, `WebConfig.java:30-36` |
| **CWE** | CWE-1021: Improper Restriction of Rendered UI Layers |

**Problem:**
```
script-src 'self' 'unsafe-inline' 'unsafe-eval'
```

**Risiko:** `unsafe-eval` und `unsafe-inline` machen CSP wirkungslos gegen XSS.

**Behebung:** Vite-Build ohne eval() konfigurieren, Inline-Scripts durch externe ersetzen.

---

#### SEC-010: anyRequest().permitAll()

| Attribut | Wert |
|----------|------|
| **Datei** | `SecurityConfig.java:62` |
| **CWE** | CWE-285: Improper Authorization |

**Problem:**
```java
.anyRequest().permitAll()
```

**Behebung:**
```java
.anyRequest().authenticated()
```

---

#### SEC-011: Fehlende Input-Validierung

| Attribut | Wert |
|----------|------|
| **Dateien** | `FolderController.java:45-50`, `DocumentShareController.java:36-40` |
| **CWE** | CWE-20: Improper Input Validation |

**Problem:** `Map<String, String>` ohne Validierung.

**Behebung:** Dedizierte DTOs mit `@Valid` und Bean Validation Annotations.

---

#### SEC-012: Keine File-Type-Validierung

| Attribut | Wert |
|----------|------|
| **Datei** | `FileStorageService.java` |
| **CWE** | CWE-434: Unrestricted Upload of File with Dangerous Type |

**Behebung:**
```java
private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx", "jpg", "png");
private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
    "application/pdf", "image/jpeg", "image/png"
);
```

---

#### SEC-013: sessionStorage Preview-Bypass

| Attribut | Wert |
|----------|------|
| **Dateien** | `App.jsx:44`, `ComingSoon.jsx:29,38` |
| **CWE** | CWE-602: Client-Side Enforcement of Server-Side Security |

**Problem:** Preview-Status kann via DevTools umgangen werden:
```javascript
sessionStorage.setItem('proudig-preview', 'true'); location.reload();
```

**Behebung:** Server-seitige Session-Validierung für Preview-Status.

---

#### SEC-014: Refresh Token nicht gehasht

| Attribut | Wert |
|----------|------|
| **Datei** | `RefreshToken.java:21` |
| **CWE** | CWE-312: Cleartext Storage of Sensitive Information |

**Behebung:** Refresh Tokens vor Speicherung hashen.

---

#### SEC-015: SSH-Zugriff als root

| Attribut | Wert |
|----------|------|
| **Datei** | `deploy/ansible/inventory.yml:14` |
| **CWE** | CWE-250: Execution with Unnecessary Privileges |

**Behebung:** Deployment-User mit sudo-Rechten verwenden.

---

#### SEC-016: Email Enumeration

| Attribut | Wert |
|----------|------|
| **Datei** | `CustomUserDetailsService.java:19` |
| **CWE** | CWE-204: Observable Response Discrepancy |

**Problem:**
```java
throw new UsernameNotFoundException("User not found with email: " + email);
```

**Behebung:** Generische Meldung ohne Email.

---

### MITTEL (P2) - Nächste Iteration

#### SEC-017: Upload-Limit zu hoch (50MB)
- **Datei:** `application.properties:31-32`
- **Empfehlung:** Max 10-20MB

#### SEC-018: Rate Limiting umgehbar
- **Datei:** `ContactController.java:130-137`
- **Problem:** `X-Forwarded-For` kann gefälscht werden

#### SEC-019: Header Injection in Content-Disposition
- **Datei:** `MediaController.java:66`
- **Empfehlung:** Dateinamen URL-encodieren

#### SEC-020: Kein Audit-Logging für Admin-Aktionen
- **Datei:** `FolderService.java`
- **Empfehlung:** Activity-Log implementieren

#### SEC-021: DB-Backups unverschlüsselt
- **Datei:** `deploy.sh:302-306`
- **Empfehlung:** Backups verschlüsseln

#### SEC-022: Container läuft als root
- **Datei:** `Dockerfile`
- **Empfehlung:** Non-root User hinzufügen

---

## Behebungsplan

### Phase 1: Kritische Schwachstellen (Sofort)

| Task | Findings | Aufwand |
|------|----------|---------|
| 1.1 Path Traversal fixen | SEC-001 | 1h |
| 1.2 Secrets externalisieren | SEC-002, SEC-003, SEC-006 | 2h |
| 1.3 XSS-Schutz (DOMPurify) | SEC-004 | 1h |
| 1.4 Passwort-Policy verschärfen | SEC-008 | 30min |
| 1.5 CSRF evaluieren | SEC-007 | 1h |

**Verification:**
- [ ] Path Traversal: Test mit `../` in subDir schlägt fehl
- [ ] Secrets: `grep -r "proudig123\|proudig2026\|jwt-secret" src/` findet nichts
- [ ] XSS: `<script>alert(1)</script>` wird nicht ausgeführt
- [ ] Passwort: 3-Zeichen-Passwort wird abgelehnt

---

### Phase 2: Hohe Schwachstellen (Diese Woche)

| Task | Findings | Aufwand |
|------|----------|---------|
| 2.1 CSP ohne unsafe-inline/eval | SEC-009 | 3h |
| 2.2 Default-Deny Authorization | SEC-010 | 1h |
| 2.3 Input-Validation DTOs | SEC-011 | 2h |
| 2.4 File-Type Whitelist | SEC-012 | 1h |
| 2.5 Server-side Preview-Validation | SEC-013 | 2h |
| 2.6 Token-Storage überarbeiten | SEC-005, SEC-014 | 4h |
| 2.7 Non-root Deployment | SEC-015 | 1h |
| 2.8 Generische Auth-Fehler | SEC-016 | 30min |

---

### Phase 3: Mittlere Schwachstellen (Nächste Iteration)

| Task | Findings | Aufwand |
|------|----------|---------|
| 3.1 Upload-Limits anpassen | SEC-017 | 15min |
| 3.2 Rate Limiting verbessern | SEC-018 | 2h |
| 3.3 Header Injection fix | SEC-019 | 30min |
| 3.4 Audit-Logging | SEC-020 | 4h |
| 3.5 Backup-Verschlüsselung | SEC-021 | 2h |
| 3.6 Rootless Container | SEC-022 | 1h |

---

## Git-History bereinigen

**WICHTIG:** Die folgenden Secrets sind in der Git-History:
- `proudig123` (DB-Passwort)
- `proudig2026` (Preview-Passwort)
- `proudig-secret-key-change-in-production-environment-12345678` (JWT)

Nach Externalisierung der Secrets:
```bash
# Option 1: git filter-repo (empfohlen)
pip install git-filter-repo
git filter-repo --replace-text replacements.txt

# Option 2: BFG Repo-Cleaner
bfg --replace-text replacements.txt
git push --force
```

---

## Referenzen

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Spring Security Best Practices](https://docs.spring.io/spring-security/reference/)

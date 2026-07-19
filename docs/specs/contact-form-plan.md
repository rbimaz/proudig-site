# Kontaktformular - Umsetzungsplan

## Übersicht

| Aspekt | Details |
|--------|---------|
| Feature | Kontaktformular mit Admin-Verwaltung |
| Komplexität | Mittel |
| Betroffene Schichten | Backend + Frontend + Datenbank |

---

## Phase 1: Backend (Datenbank + API)

### 1.1 Datenbank-Migration

**Datei:** `src/main/resources/db/changelog/009-contact-messages.xml`

```sql
CREATE TABLE contact_messages (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    company      VARCHAR(255),
    message      TEXT NOT NULL,
    is_read      BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 Domain-Entity

**Datei:** `src/main/java/de/proudig/site/domain/ContactMessage.java`

- Entity-Klasse mit JPA-Annotationen
- Felder: id, firstName, lastName, email, company, message, isRead, createdAt

### 1.3 Repository

**Datei:** `src/main/java/de/proudig/site/repository/ContactMessageRepository.java`

- Spring Data JPA Repository
- Methoden:
  - `findAllByOrderByCreatedAtDesc()`
  - `findByIsReadFalse()`
  - `countByIsReadFalse()`

### 1.4 DTO

**Datei:** `src/main/java/de/proudig/site/dto/ContactMessageDTO.java`

- Request-DTO für Formular-Eingaben
- Response-DTO für Admin-Ansicht

### 1.5 Service

**Datei:** `src/main/java/de/proudig/site/service/ContactMessageService.java`

- `saveMessage(dto)` - Nachricht speichern
- `getAllMessages()` - Alle Nachrichten abrufen
- `getUnreadCount()` - Anzahl ungelesener Nachrichten
- `markAsRead(id)` - Als gelesen markieren
- `markAsUnread(id)` - Als ungelesen markieren
- `deleteMessage(id)` - Nachricht löschen
- `deleteMessages(ids)` - Mehrere Nachrichten löschen

### 1.6 Controller

**Datei:** `src/main/java/de/proudig/site/controller/ContactController.java`

| Methode | Endpoint | Auth | Beschreibung |
|---------|----------|------|--------------|
| POST | `/api/contact` | Nein | Neue Nachricht (öffentlich) |
| GET | `/api/admin/messages` | ADMIN/CONSULTANT | Alle Nachrichten |
| GET | `/api/admin/messages/unread-count` | ADMIN/CONSULTANT | Anzahl ungelesen |
| GET | `/api/admin/messages/{id}` | ADMIN/CONSULTANT | Einzelne Nachricht |
| PUT | `/api/admin/messages/{id}/read` | ADMIN/CONSULTANT | Als gelesen markieren |
| PUT | `/api/admin/messages/{id}/unread` | ADMIN/CONSULTANT | Als ungelesen markieren |
| DELETE | `/api/admin/messages/{id}` | ADMIN/CONSULTANT | Löschen |
| POST | `/api/admin/messages/delete-batch` | ADMIN/CONSULTANT | Mehrere löschen |

### 1.7 Security-Konfiguration

**Datei:** `SecurityConfig.java` (Update)

- `/api/contact` als öffentlichen Endpoint hinzufügen
- `/api/admin/messages/**` für ADMIN/CONSULTANT freigeben

---

## Phase 2: Frontend - Kontaktformular

### 2.1 Contact.jsx aktualisieren

**Datei:** `src/main/frontend/src/components/Contact.jsx`

Änderungen:
- API-Aufruf `POST /api/contact` hinzufügen
- Ladezustand (`loading`) implementieren
- Erfolgsmeldung anzeigen
- Fehlermeldung anzeigen
- Honeypot-Feld für Spam-Schutz

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  if (honeypot) return; // Spam-Bot erkannt

  setLoading(true);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error();
    setSuccess(true);
    setFormData({ ... });
  } catch {
    setError('Nachricht konnte nicht gesendet werden.');
  } finally {
    setLoading(false);
  }
};
```

---

## Phase 3: Frontend - Admin-Bereich

### 3.1 Neue Seite: Nachrichtenübersicht

**Datei:** `src/main/frontend/src/pages/admin/MessageList.jsx`

- Tabelle mit allen Nachrichten
- Spalten: Status-Icon, Datum, Name, E-Mail, Vorschau
- Checkboxen für Mehrfachauswahl
- Filter: Alle / Nur ungelesene
- Aktionen: Löschen (einzeln/mehrfach)
- Klick öffnet Detailansicht

### 3.2 Neue Seite: Nachricht-Detailansicht

**Datei:** `src/main/frontend/src/pages/admin/MessageDetail.jsx`

- Vollständige Nachricht anzeigen
- E-Mail als mailto-Link
- Buttons: "Als ungelesen", "Löschen", "Zurück"
- Automatisch als gelesen markieren beim Öffnen

### 3.3 Navigation aktualisieren

**Datei:** `src/main/frontend/src/pages/admin/AdminLayout.jsx`

- Neuen Nav-Eintrag "Nachrichten" hinzufügen
- Badge mit Anzahl ungelesener Nachrichten

```jsx
{
  label: 'Nachrichten',
  path: '/admin/cms/nachrichten',
  icon: 'bi-envelope-fill',
  badge: unreadCount  // Anzahl ungelesener
}
```

### 3.4 Routing aktualisieren

**Datei:** `src/main/frontend/src/App.jsx`

```jsx
<Route path="nachrichten" element={<MessageList />} />
<Route path="nachrichten/:id" element={<MessageDetail />} />
```

---

## Phase 4: Styling

### 4.1 Admin-CSS erweitern

**Datei:** `src/main/frontend/src/admin.css`

- Nachrichtenliste-Styles
- Ungelesen-Hervorhebung (fett, farbiger Punkt)
- Badge-Style für Navigation
- Detailansicht-Layout

---

## Zusammenfassung

| Phase | Dateien | Neu/Update |
|-------|---------|------------|
| 1 | `009-contact-messages.xml` | Neu |
| 1 | `ContactMessage.java` | Neu |
| 1 | `ContactMessageRepository.java` | Neu |
| 1 | `ContactMessageDTO.java` | Neu |
| 1 | `ContactMessageService.java` | Neu |
| 1 | `ContactController.java` | Neu |
| 1 | `SecurityConfig.java` | Update |
| 2 | `Contact.jsx` | Update |
| 3 | `MessageList.jsx` | Neu |
| 3 | `MessageDetail.jsx` | Neu |
| 3 | `AdminLayout.jsx` | Update |
| 3 | `App.jsx` | Update |
| 4 | `admin.css` | Update |

**Gesamt:** 8 neue Dateien, 5 Updates

---

## Reihenfolge der Implementierung

```
1. Datenbank-Migration (009-contact-messages.xml)
      ↓
2. Entity + Repository + DTO
      ↓
3. Service + Controller
      ↓
4. Security-Config Update
      ↓
5. Contact.jsx Update (Formular funktional machen)
      ↓
6. MessageList.jsx + MessageDetail.jsx
      ↓
7. AdminLayout.jsx + App.jsx (Navigation + Routing)
      ↓
8. CSS-Anpassungen
      ↓
9. Tests
```

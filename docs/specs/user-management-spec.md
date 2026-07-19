# Spezifikation: Benutzerverwaltung

## Übersicht

Die Benutzerverwaltung ermöglicht Administratoren das Erstellen, Bearbeiten und Löschen von Benutzern sowie die Vergabe von Rollen.

---

## API-Endpunkte

### REST-Konvention

Die API folgt RESTful-Konventionen. URLs repräsentieren Ressourcen, nicht Berechtigungen.

| Methode | Endpunkt | Beschreibung | Berechtigung |
|---------|----------|--------------|--------------|
| GET | `/api/users` | Alle Benutzer abrufen | ADMIN |
| GET | `/api/users/{id}` | Einzelnen Benutzer abrufen | ADMIN |
| POST | `/api/users` | Neuen Benutzer erstellen | ADMIN |
| PUT | `/api/users/{id}` | Benutzer aktualisieren | ADMIN |
| DELETE | `/api/users/{id}` | Benutzer löschen | ADMIN |

**Wichtig:** Autorisierung erfolgt über `@PreAuthorize` Annotationen im Backend, NICHT über URL-Prefixe wie `/api/admin/`.

---

## Given-When-Then Szenarien

### Szenario 1: Benutzer auflisten

```gherkin
Given ein Administrator ist eingeloggt
When die Benutzerverwaltung aufgerufen wird
Then wird GET /api/users aufgerufen
And alle Benutzer werden in einer Tabelle angezeigt
```

### Szenario 2: Neuen Benutzer erstellen

```gherkin
Given ein Administrator ist eingeloggt
And die Benutzerverwaltung ist geöffnet
When der Administrator E-Mail, Vorname und Nachname eingibt
And auf "Benutzer erstellen" klickt
Then wird POST /api/users mit den Daten aufgerufen
And der neue Benutzer erscheint in der Liste
And eine Erfolgsmeldung wird angezeigt
```

### Szenario 3: Benutzer erstellen schlägt fehl (leere Felder)

```gherkin
Given ein Administrator ist eingeloggt
And die Benutzerverwaltung ist geöffnet
When der Administrator nicht alle Pflichtfelder ausfüllt
And auf "Benutzer erstellen" klickt
Then wird KEIN API-Aufruf gemacht
And eine Fehlermeldung "Bitte alle Felder ausfüllen" wird angezeigt
```

### Szenario 4: Rolle hinzufügen

```gherkin
Given ein Administrator ist eingeloggt
And ein Benutzer ohne ADMIN-Rolle existiert
When der Administrator auf den ADMIN-Badge klickt
Then wird PUT /api/users/{id} mit der neuen Rolle aufgerufen
And der Badge wird als aktiv angezeigt
```

### Szenario 5: Rolle entfernen

```gherkin
Given ein Administrator ist eingeloggt
And ein Benutzer mit CONSULTANT-Rolle existiert
When der Administrator auf den aktiven CONSULTANT-Badge klickt
Then wird PUT /api/users/{id} ohne diese Rolle aufgerufen
And der Badge wird als inaktiv angezeigt
```

### Szenario 6: Benutzer löschen

```gherkin
Given ein Administrator ist eingeloggt
And ein Benutzer existiert
When der Administrator auf "Löschen" klickt
And den Bestätigungsdialog bestätigt
Then wird DELETE /api/users/{id} aufgerufen
And der Benutzer wird aus der Liste entfernt
```

### Szenario 7: Nicht-Admin hat keinen Zugriff

```gherkin
Given ein Benutzer mit Rolle "USER" ist eingeloggt
When der Benutzer versucht GET /api/users aufzurufen
Then wird HTTP 403 Forbidden zurückgegeben
```

### Szenario 8: Nicht-Admin sieht keine Benutzerverwaltung-Karte

```gherkin
Given ein Benutzer mit Rolle "CONSULTANT" ist eingeloggt
When die Admin-Startseite angezeigt wird
Then wird die Benutzerverwaltung-Karte NICHT angezeigt
```

### Szenario 9: Admin sieht Benutzerverwaltung-Karte

```gherkin
Given ein Benutzer mit Rolle "ADMIN" ist eingeloggt
When die Admin-Startseite angezeigt wird
Then wird die Benutzerverwaltung-Karte angezeigt
And die Karte navigiert zu /admin/portal/users
```

---

## Frontend-API-Mapping

| Frontend-Aktion | API-Endpunkt |
|-----------------|--------------|
| Benutzer laden | `GET /api/users` |
| Benutzer erstellen | `POST /api/users` |
| Rolle ändern | `PUT /api/users/{id}` |
| Benutzer löschen | `DELETE /api/users/{id}` |

---

## Betroffene Dateien

| Datei | Beschreibung |
|-------|--------------|
| `UserController.java` | Backend REST-Controller unter `/api/users` |
| `PortalUsers.jsx` | Frontend-Komponente für Benutzerverwaltung |
| `PortalUsers.test.jsx` | Unit-Tests für API-Endpunkte |
| `AdminHome.jsx` | Zeigt Benutzerverwaltung-Karte für ADMIN |

---

## Testabdeckung

Unit Tests mit Vitest + React Testing Library:

1. `PortalUsers.test.jsx`
   - API-Endpunkte sind korrekt (`/api/users`, nicht `/api/admin/users`)
   - Benutzer werden geladen und angezeigt
   - Neuer Benutzer wird erstellt
   - Rollen können geändert werden
   - Benutzer kann gelöscht werden
   - Validierung bei leeren Feldern

---

*Erstellt: 2026-06-11*

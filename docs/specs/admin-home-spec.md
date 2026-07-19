# Spezifikation: Zentrale Admin-Einstiegsseite

## Übersicht

Die zentrale Admin-Einstiegsseite (`/admin`) bietet nach erfolgreichem Login eine Auswahl zwischen CMS (Content-Verwaltung) und Portal (Dokumentenverwaltung).

---

## URL-Struktur

| Alt | Neu | Beschreibung |
|-----|-----|--------------|
| `/admin/login` | `/admin/login` | Gemeinsamer Login (unverändert) |
| `/admin` | `/admin` | Zentrale Auswahl (CMS oder Portal) |
| `/admin` | `/admin/cms` | CMS-Dashboard |
| `/admin/seiten` | `/admin/cms/seiten` | CMS Seiten |
| `/admin/blog` | `/admin/cms/blog` | CMS Blog |
| `/admin/seminare` | `/admin/cms/seminare` | CMS Seminare |
| `/admin/media` | `/admin/cms/media` | CMS Mediathek |
| `/portal` | `/admin/portal` | Portal-Dashboard |
| `/portal/documents` | `/admin/portal/documents` | Portal Dokumente |
| `/portal/shared` | `/admin/portal/shared` | Portal Geteilt |
| `/portal/users` | `/admin/portal/users` | Portal Benutzer |
| `/portal/login` | Redirect → `/admin/login` | Legacy-Redirect |
| `/portal/*` | Redirect → `/admin/portal/*` | Legacy-Redirect |

---

## Given-When-Then Szenarien

### Szenario 1: Nicht authentifizierter Benutzer besucht /admin

```gherkin
Given ein Benutzer ist nicht eingeloggt
When der Benutzer die URL "/admin" aufruft
Then wird der Benutzer zu "/admin/login" weitergeleitet
```

### Szenario 2: Erfolgreicher Login

```gherkin
Given ein Benutzer ist auf der Login-Seite "/admin/login"
And der Benutzer gibt gültige Anmeldedaten ein
When der Benutzer das Login-Formular absendet
Then wird der Benutzer zu "/admin" weitergeleitet
And die zentrale Auswahlseite wird angezeigt
```

### Szenario 3: Admin-Benutzer sieht beide Karten

```gherkin
Given ein Benutzer mit Rolle "ADMIN" ist eingeloggt
When der Benutzer die Seite "/admin" aufruft
Then wird die CMS-Karte angezeigt
And wird die Portal-Karte angezeigt
```

### Szenario 4: Consultant-Benutzer sieht beide Karten

```gherkin
Given ein Benutzer mit Rolle "CONSULTANT" ist eingeloggt
When der Benutzer die Seite "/admin" aufruft
Then wird die CMS-Karte angezeigt
And wird die Portal-Karte angezeigt
```

### Szenario 5: Client-Benutzer sieht nur Portal-Karte

```gherkin
Given ein Benutzer mit Rolle "CLIENT" ist eingeloggt
When der Benutzer die Seite "/admin" aufruft
Then wird die CMS-Karte NICHT angezeigt
And wird die Portal-Karte angezeigt
```

### Szenario 6: Klick auf CMS-Karte

```gherkin
Given ein Benutzer mit Rolle "ADMIN" ist eingeloggt
And der Benutzer ist auf der Seite "/admin"
When der Benutzer auf die CMS-Karte klickt
Then wird der Benutzer zu "/admin/cms" weitergeleitet
And das CMS-Dashboard wird angezeigt
```

### Szenario 7: Klick auf Portal-Karte

```gherkin
Given ein Benutzer ist eingeloggt
And der Benutzer ist auf der Seite "/admin"
When der Benutzer auf die Portal-Karte klickt
Then wird der Benutzer zu "/admin/portal" weitergeleitet
And das Portal-Dashboard wird angezeigt
```

### Szenario 8: Legacy Portal-Login Redirect

```gherkin
Given ein Benutzer ruft die URL "/portal/login" auf
When die Seite geladen wird
Then wird der Benutzer zu "/admin/login" weitergeleitet
```

### Szenario 9: Legacy Portal-URL Redirect

```gherkin
Given ein Benutzer ist eingeloggt
When der Benutzer die URL "/portal/documents" aufruft
Then wird der Benutzer zu "/admin/portal/documents" weitergeleitet
```

### Szenario 10: Zurück zur Übersicht aus CMS

```gherkin
Given ein Benutzer ist im CMS-Bereich "/admin/cms"
When der Benutzer auf "Zurück zur Übersicht" klickt
Then wird der Benutzer zu "/admin" weitergeleitet
```

### Szenario 11: Zurück zur Übersicht aus Portal

```gherkin
Given ein Benutzer ist im Portal-Bereich "/admin/portal"
When der Benutzer auf "Zurück zur Übersicht" klickt
Then wird der Benutzer zu "/admin" weitergeleitet
```

### Szenario 12: Logout aus der Auswahlseite

```gherkin
Given ein Benutzer ist eingeloggt
And der Benutzer ist auf der Seite "/admin"
When der Benutzer auf "Abmelden" klickt
Then wird der Benutzer ausgeloggt
And wird zu "/admin/login" weitergeleitet
```

### Szenario 13: Client versucht CMS-URL direkt aufzurufen

```gherkin
Given ein Benutzer mit Rolle "CLIENT" ist eingeloggt
When der Benutzer die URL "/admin/cms" direkt aufruft
Then wird der Benutzer zu "/admin" weitergeleitet
And eine Fehlermeldung "Keine Berechtigung" wird angezeigt
```

---

## UI-Komponenten

### AdminHome Komponente

- **Header:** Logo, Benutzername, Logout-Button
- **Willkommensnachricht:** "Willkommen, {Vorname Nachname}"
- **CMS-Karte:**
  - Icon: `bi-file-earmark-richtext`
  - Titel: "Content-Management"
  - Beschreibung: "Website-Inhalte, Blog, Seminare, Mediathek"
  - Sichtbar für: ADMIN, CONSULTANT
- **Portal-Karte:**
  - Icon: `bi-folder-fill`
  - Titel: "Dokumenten-Portal"
  - Beschreibung: "Dokumente hochladen, teilen, verwalten"
  - Sichtbar für: Alle authentifizierten Benutzer

---

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `AdminHome.jsx` | Neu erstellen |
| `App.jsx` | Routing umstrukturieren |
| `AdminLayout.jsx` | Pfade auf `/admin/cms/...` anpassen, "Zurück"-Link |
| `PortalLayout.jsx` | Pfade auf `/admin/portal/...` anpassen, "Zurück"-Link |
| `PortalLogin.jsx` | Durch Redirect-Komponente ersetzen |
| `Navbar.jsx` | Login-Link bleibt `/admin/login` |

---

## Testabdeckung

Unit Tests mit React Testing Library:

1. `AdminHome.test.jsx`
   - Rendert korrekt für ADMIN
   - Rendert korrekt für CLIENT (keine CMS-Karte)
   - Navigation zu CMS funktioniert
   - Navigation zu Portal funktioniert
   - Logout funktioniert

2. Integration Tests
   - Legacy-Redirects funktionieren
   - Rollenbasierte Zugriffskontrolle

---

*Erstellt: 2026-06-08*
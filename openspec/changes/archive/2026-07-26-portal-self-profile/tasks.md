## 1. Backend – Self-Service-Profil

- [x] 1.1 `GET /api/auth/me` in `AuthController`: liefert eigene Kontodaten (E-Mail, Vorname, Nachname, Firma, Rollen) des angemeldeten Benutzers
- [x] 1.2 `PUT /api/auth/me` in `AuthController`: aktualisiert `firstName`, `lastName`, `company` des angemeldeten Benutzers; E-Mail/Rollen unverändert
- [x] 1.3 `UserService.updateOwnProfile(user, firstName, lastName, company)` mit Trim; leerer Vor-/Nachname → Validierungsfehler (HTTP 400)
- [x] 1.4 Request-/Response-DTO (Profil), ohne Passwort-/Rollenänderung

## 2. Frontend – Profil-Seite

- [x] 2.1 Seite `pages/portal/Profile.jsx`: Abschnitt „Persönliche Daten" (Vorname/Nachname/Firma editierbar, E-Mail/Rolle read-only) mit Laden via `GET /api/auth/me` und Speichern via `PUT /api/auth/me`
- [x] 2.2 Abschnitt „Sicherheit": Passwort ändern (aktuelles/neues/bestätigen) über `POST /api/auth/change-password`
- [x] 2.3 Route `/admin/portal/profil` in `App.jsx` (innerhalb `PortalLayout`, authentifiziert)
- [x] 2.4 `UserMenu`: „Profil" navigiert zu `/admin/portal/profil`
- [x] 2.5 Nach erfolgreichem Namens-Speichern AuthContext-User auffrischen, damit das Header-Menü den neuen Namen zeigt

## 3. Verifikation

- [x] 3.1 Backend-Tests: Self-Profil-Update ändert eigene Felder; E-Mail/Rolle bleiben; leerer Name → 400
- [x] 3.2 Backend-Build/Tests grün
- [x] 3.3 Frontend Lint/Build grün
- [x] 3.4 `openspec validate portal-self-profile --strict` grün
- [x] 3.5 Sichtprüfung: „Profil" öffnet Profil-Seite; Daten/Passwort änderbar; Erst-Login-Zwang weiterhin über separate Seite

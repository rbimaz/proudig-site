# Eigene Profil-Seite im Portal

## Warum
Der Dropdown-Eintrag „Profil" führt heute direkt auf den ganzseitigen Passwort-ändern-Dialog
(`/admin/portal/change-password`). Es gibt **keine** Profil-Seite und **keinen** Self-Service-Endpoint:
`UserController` ist komplett `hasRole('ADMIN')` und arbeitet über `/{id}`, ein Benutzer kann seine
eigenen Kontodaten also nicht einsehen/ändern. Erwartet wird eine echte Profil-UI (Kontodaten +
Sicherheit).

## Was
Neue Capability `portal-profile` mit einer Seite `/admin/portal/profil`:

- **Persönliche Daten:** Vorname, Nachname und Firma **editierbar**; E-Mail und Rolle **nur Anzeige**.
  Neuer Self-Service-Endpoint `GET /api/auth/me` (eigene Daten) und `PUT /api/auth/me`
  (`firstName`, `lastName`, `company`) — betrifft immer nur das **angemeldete** Konto; E-Mail und
  Rollen sind darüber nicht änderbar.
- **Sicherheit:** Abschnitt „Passwort ändern" (aktuelles/neues/bestätigen) direkt auf der Profil-Seite,
  über das bestehende `POST /api/auth/change-password`.
- **Dropdown:** „Profil" verweist künftig auf `/admin/portal/profil` statt auf die Passwort-Seite.
- **Header-Aktualität:** Nach dem Speichern des Namens SHALL die Anzeige im User-Menü aktualisiert
  werden (AuthContext-User auffrischen).

Die bestehende separate Seite `/admin/portal/change-password` **bleibt erhalten** — sie wird vom
Erst-Login-Zwang (`forcePasswordChange`) benötigt.

## Nicht-Ziele
- Keine Änderung der E-Mail (Login-Identität) und keine Selbst-Rollenänderung.
- Kein Avatar-Upload, keine Benachrichtigungs-/Spracheinstellungen.
- Keine Änderung an der admin-seitigen Benutzerverwaltung (`user-management`).
- Keine neue Rechtelogik: `GET/PUT /api/auth/me` gilt für jeden authentifizierten Benutzer auf sein
  eigenes Konto.

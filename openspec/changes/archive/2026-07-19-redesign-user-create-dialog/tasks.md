## 1. Dialog-Struktur & State (PortalUsers.jsx)

- [x] 1.1 `newUser`-State um `role` (Default `'USER'`) und `passwordConfirm` erweitern; `showPassword`-State ergänzen; `closeCreate`-Reset anpassen
- [x] 1.2 Header mit Live-Vorschau: Avatar mit Initialen (erster Buchstabe Vor-/Nachname, groß) bzw. „?" wenn leer, plus „Vorschau: <Vorname Nachname>" / Fallback-Text
- [x] 1.3 Felder einspaltig stapeln (E-Mail, Vorname, Nachname, Rolle, Passwort, Passwort bestätigen), je mit führendem Icon und Pflicht-Stern im Label

## 2. Rollenauswahl

- [x] 2.1 Select mit Optionen Benutzer/Bearbeiter/Administrator; Werte auf `USER`/`CONSULTANT`/`ADMIN` gemappt
- [x] 2.2 Beim Absenden gewählte Rolle als `roles: [role]` in den POST-Payload übernehmen

## 3. Passwort-Bestätigung & Sichtbarkeit

- [x] 3.1 Bestätigungsfeld + Auge-Toggle, der beide Passwortfelder gemeinsam zwischen `password`/`text` schaltet
- [x] 3.2 Live-Match-Hinweis unter dem Bestätigungsfeld (grün bei Gleichheit, rot bei Abweichung), sobald das Feld nicht leer ist
- [x] 3.3 Client-Validierung: „Erstellen" bricht mit Meldung ab, wenn Passwörter nicht übereinstimmen (kein POST)

## 4. Styling (portal.css)

- [x] 4.1 Dialog-Karte, Header/Avatar, Felder mit Icon-Padding, Focus-Ring, Match-Hinweis, Footer-Buttons gemäß Handoff-Tokens umsetzen

## 5. Verifikation

- [x] 5.1 Bestehende Tests anpassen (Rolle im Payload, Passwort-Bestätigung ausfüllen) und Test für Passwort-Mismatch ergänzen
- [x] 5.2 Frontend-Tests grün (`npm test`)
- [x] 5.3 `openspec validate redesign-user-create-dialog --strict` erfolgreich

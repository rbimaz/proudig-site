## Context

Die „erzwungene Passwortänderung beim ersten Login" ist im Code bereits
weitgehend implementiert:

- `User.forcePasswordChange` (boolean, `nullable=false`, Default `false`) und die
  DB-Spalte `force_password_change` (Changelog `001-users-roles.xml`).
- `AuthResponse.forcePasswordChange` wird bei Login **und** Refresh gesetzt.
- `POST /api/auth/change-password` setzt das Flag nach erfolgreicher Änderung auf
  `false`.
- `AuthContext` reicht `forcePasswordChange` an den Client durch; `AdminLogin`
  leitet bei `true` auf `/admin/portal/change-password` um.

Es fehlt allein die Möglichkeit, das Flag **beim Anlegen** zu setzen. Die
Auswertung beim Login ist vollständig: Alle Logins laufen über `AdminLogin`
(`/portal/login` ist nur ein Redirect auf `/admin/login`, `PortalLogin` ein
ungenutzter Legacy-Redirect).

## Goals / Non-Goals

**Goals:**
- Administrator kann beim Anlegen wählen, ob der Benutzer beim ersten Login sein
  Passwort ändern muss.
- Das Flag wirkt end-to-end (Login-Redirect, Zurücksetzen bei Änderung).

**Non-Goals:**
- Kein nachträgliches Umschalten des Flags im Bearbeiten-Dialog (kann später
  ergänzt werden; `UserUpdateRequest` bleibt unverändert).
- Keine Änderung am Login-/Enforcement-Pfad (bereits vollständig vorhanden).
- Keine Passwortrichtlinien-/Ablauf-Logik über das bestehende Verhalten hinaus.

## Decisions

- **Optionales Feld statt Pflichtfeld:** `forcePasswordChange` in
  `UserCreateRequest` ist optional mit Default `false`. Bestehende Aufrufer und
  Tests bleiben kompatibel; wird das Feld nicht gesendet, ändert sich nichts.
- **UI als Checkbox im Erstellen-Dialog**, unterhalb der Passwortfelder. Default
  deaktiviert (kein Zwang), damit das Verhalten nur bei bewusster Aktivierung
  entsteht.
- **Enforcement unangetastet lassen:** Ursprünglich als „Portal-Login-Lücke"
  vermutet — bei der Umsetzung zeigte sich, dass `PortalLogin` nur ein
  Legacy-Redirect ist und alle Logins über `AdminLogin` laufen. Das Flag greift
  daher bereits; keine zusätzliche Redirect-Logik nötig.

## Risks / Trade-offs

- [Client-seitiges Enforcement umgehbar] → Akzeptiert: entspricht dem bereits
  vorhandenen Muster (`AdminLogin`); der Server bleibt Quelle des Flags, das
  change-password-Endpoint setzt es zurück. Serverseitige Härtung ist ein
  separates, größeres Thema.

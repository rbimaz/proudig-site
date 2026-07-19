## Why

Nach einer erzwungenen (oder freiwilligen) Passwortänderung wird der Benutzer
abgemeldet und auf den Login-Screen geleitet. Dort muss er seine E-Mail erneut
eintippen. Zur besseren Bedienbarkeit soll die bisherige E-Mail des Benutzers im
Login-Formular vorbefüllt sein.

## What Changes

- **`ChangePassword`:** Beim Weiterleiten zum Login nach erfolgreicher Änderung
  wird die E-Mail des angemeldeten Benutzers (aus dem Auth-Kontext) über den
  React-Router-Navigations-State mitgegeben.
- **`AdminLogin`:** Das E-Mail-Feld wird mit der übergebenen E-Mail vorbefüllt
  (falls vorhanden); ansonsten bleibt es leer wie bisher.
- Kein neues Speichern/Persistieren; die E-Mail kommt ausschließlich aus dem
  bestehenden Navigations-Fluss.

## Non-Goals

- Kein Vorbefüllen des Passworts, kein Autofokus, kein „Angemeldet bleiben".
- Keine Backend-Änderung.

## Capabilities

### Modified Capabilities
- `user-management`: Ergänzt eine Requirement zur E-Mail-Vorbefüllung im Login
  nach einer Passwortänderung.

## Impact

- Frontend: `ChangePassword.jsx` (E-Mail in Navigations-State), `AdminLogin.jsx`
  (Vorbefüllung aus `location.state`).

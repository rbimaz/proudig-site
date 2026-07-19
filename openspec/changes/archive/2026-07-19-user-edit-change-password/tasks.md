## 1. Backend

- [x] 1.1 `UserUpdateRequest` um `String password` erweitern
- [x] 1.2 `UserService.updateUser`: bei nicht-leerem Passwort mit Mindestlänge 3 BCrypt-kodiert setzen; leeres/fehlendes Passwort ignorieren; zu kurzes Passwort mit `IllegalArgumentException` (→ HTTP 400) abweisen

## 2. Frontend

- [x] 2.1 Edit-State um `password`, `passwordConfirm`, `showPassword` erweitern
- [x] 2.2 Optionale Passwortfelder (Passwort + Bestätigung) mit Sichtbarkeits-Toggle und Live-Match-Hinweis im Edit-Dialog
- [x] 2.3 Validierung: bei Eingabe müssen Passwörter übereinstimmen; nur dann `password` in den PUT-Payload aufnehmen; leer = kein `password`

## 3. Tests & Verifikation

- [x] 3.1 Frontend-Test: Bearbeiten mit neuem Passwort sendet `password` im Payload; ohne Eingabe kein `password`
- [x] 3.2 Backend kompiliert; Frontend-Tests/Lint/Build grün
- [x] 3.3 `openspec validate user-edit-change-password --strict` erfolgreich

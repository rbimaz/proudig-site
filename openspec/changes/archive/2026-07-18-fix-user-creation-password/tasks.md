## 1. Backend

- [x] 1.1 In `UserService.createUser` fehlendes/leeres Passwort mit `IllegalArgumentException` abweisen (vor dem `encode`)
- [x] 1.2 `IllegalArgumentException` in `UserController` als HTTP 400 mappen (lokaler `@ExceptionHandler`, konsistent mit AuthController-Stil; kein globaler Advice vorhanden)

## 2. Frontend

- [x] 2.1 Passwortfeld im "Neuen Benutzer erstellen"-Formular ergänzt
- [x] 2.2 `newUser`-State um `password` erweitert und Reset nach Erfolg angepasst
- [x] 2.3 Client-Validierung: Passwort ist Pflicht; Serverfehlermeldung wird angezeigt

## 3. Verifikation

- [x] 3.1 Backend kompiliert (`mvnw compile`)
- [x] 3.2 Frontend-Tests grün (7/7); Create-Test um Passwort ergänzt, neuer Test für fehlendes Passwort
- [x] 3.3 `openspec validate fix-user-creation-password --strict` erfolgreich

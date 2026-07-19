## 1. Backend

- [x] 1.1 `UserRepository`: `long countByRoles_Name(String name)` (Anzahl Admins)
- [x] 1.2 `UserController#updateUser` reicht den angemeldeten Benutzer (`Authentication`) an den Service durch
- [x] 1.3 `UserService.updateUser`: ADMIN-Entzug erkennen (hatte ADMIN, neue Menge ohne ADMIN); ablehnen (HTTP 400) wenn betroffener Benutzer der angemeldete Admin ist
- [x] 1.4 `UserService.updateUser`: ADMIN-Entzug ablehnen (HTTP 400), wenn `countByRoles_Name("ADMIN") <= 1` (letzter Admin)

## 2. Frontend

- [x] 2.1 ADMIN-Checkbox im Edit-Dialog deaktivieren, wenn bearbeiteter Benutzer = angemeldeter Admin (E-Mail-Vergleich via AuthContext) oder einziger Admin (Zählung aus Benutzerliste), mit erklärendem Hinweis
- [x] 2.2 Serverseitige Ablehnung (HTTP 400) als Fehlermeldung anzeigen (Fallback)

## 3. Tests & Verifikation

- [x] 3.1 Backend-Test: Entzug der eigenen Admin-Rolle → 400
- [x] 3.2 Backend-Test: Entzug der letzten Admin-Rolle → 400; Entzug bei weiteren Admins → erlaubt
- [x] 3.2 Frontend-Test: ADMIN-Checkbox ist beim eigenen/einzigen Admin deaktiviert
- [x] 3.3 Backend kompiliert; Frontend-Tests/Lint/Build grün
- [x] 3.4 `openspec validate protect-admin-role --strict` erfolgreich

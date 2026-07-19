## 1. Frontend-Umbau

- [x] 1.1 State `showCreate` (Default false); Button »+ Neuer Benutzer« im `users-header`
- [x] 1.2 Erstellungs-Formular in Modal (Backdrop + Dialog) verlagert; Overlay reuse `confirm-dialog-backdrop`
- [x] 1.3 Schließen per Backdrop-Klick, Escape, »Abbrechen«; Body-Scroll gesperrt; nach Erfolg Dialog schließen
- [x] 1.4 CSS für `.user-form-dialog` + `.users-header`-Flexlayout + `.user-form-actions` in `portal.css`

## 2. Verifikation

- [x] 2.1 Bestehende Tests angepasst: Dialog vor Formularzugriff öffnen
- [x] 2.2 Frontend-Tests grün (9/9), inkl. neuer Tests für offen/geschlossen/abbrechen
- [x] 2.3 `openspec validate user-create-modal --strict` erfolgreich
- [ ] 2.4 Optional: App starten und Layout sichten

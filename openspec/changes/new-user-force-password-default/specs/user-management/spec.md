## ADDED Requirements

### Requirement: Erst-Login-Passwortänderung im Anlege-Dialog vorausgewählt
Beim Anlegen eines neuen Benutzers SHALL die Checkbox „Passwortänderung beim ersten Login
erforderlich" standardmäßig **aktiviert** sein. Der Wert SHALL abwählbar bleiben und der gewählte
Zustand SHALL beim Erstellen an den Server übermittelt werden.

#### Scenario: Default beim Öffnen des Anlege-Dialogs
- **WHEN** eine Administratorin den Dialog zum Anlegen eines neuen Benutzers öffnet
- **THEN** ist die Checkbox „Passwortänderung beim ersten Login erforderlich" aktiviert

#### Scenario: Erstellen ohne Änderung der Checkbox
- **WHEN** die Administratorin einen neuen Benutzer erstellt, ohne die Checkbox zu verändern
- **THEN** wird `forcePasswordChange = true` an den Server gesendet

#### Scenario: Checkbox abwählen
- **WHEN** die Administratorin die Checkbox vor dem Erstellen deaktiviert
- **THEN** wird `forcePasswordChange = false` an den Server gesendet

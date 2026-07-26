# Erst-Login-Passwortänderung beim Anlegen vorauswählen

## Warum
Beim Anlegen eines neuen Benutzers (`/admin/portal/users/new`) ist die Checkbox
„Passwortänderung beim ersten Login erforderlich" aktuell standardmäßig **deaktiviert**.
Der Regelfall ist jedoch, dass ein neu angelegter Benutzer sein Initialpasswort beim ersten Login
ändern soll. Der Default sollte deshalb dem Standard-Fall entsprechen und **aktiviert** sein.

## Was
- Im Anlege-Dialog SHALL die Checkbox „Passwortänderung beim ersten Login erforderlich"
  **standardmäßig aktiviert** sein.
- Der Wert bleibt frei abwählbar; das Bearbeiten bestehender Benutzer ist nicht betroffen.

## Nicht-Ziele
- Keine Änderung am Login-/Flag-Verhalten (Weiterleitung zur Passwortänderung) selbst.
- Keine Backend-Änderung — der gewählte Wert wird weiterhin explizit vom Client gesendet.
- Keine Änderung am Bearbeiten-Dialog.

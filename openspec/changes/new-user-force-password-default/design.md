# Design — Erst-Login-Passwortänderung als Default

## `PortalUserForm.jsx`
- Initialer `form`-State: `forcePasswordChange` von `false` auf `true` ändern (Zeile ~27).
- Sonst keine Änderung: Checkbox erscheint weiterhin nur im Anlege-Modus (`isNew`), Wert bleibt
  abwählbar, wird nur im POST (`isNew`-Zweig) gesendet. Bearbeiten-Modus unberührt (Wert dort
  ungenutzt).

## Tests `PortalUserForm.test.jsx`
Der geänderte Default kehrt die bestehenden Erwartungen um:
- Test „Given alle Felder … Then POST": erwartet jetzt `forcePasswordChange === true` (Default, ohne
  Klick auf die Checkbox).
- Test für den abgewählten Fall: Checkbox anklicken (abwählen) → `forcePasswordChange === false`
  (statt bisher: anklicken → true).

## Verifikation
- Frontend-Tests grün (`npm run test`), Lint/Build grün.
- Anlege-Dialog zeigt die Checkbox initial angehakt.

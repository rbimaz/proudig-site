# „Jetzt ausführen"-Button für den News-Lebenszyklus

## Warum
Der News-Lebenszyklus (Auto-Archivieren/-Ausblenden) läuft nur zum konfigurierten Cron-Zeitpunkt
(Default stündlich). Zum Testen/Nachziehen fehlt eine Möglichkeit, ihn **sofort** anzustoßen,
ohne den Cron zu verstellen oder eine Stunde zu warten. Das Backend bietet dafür bereits
`POST /api/admin/pages/run-lifecycle` (liefert die Anzahl der Übergänge), aber es gibt **keinen
Button** in der Einstellungen-UI.

## Was
- In der Einstellungen-Seite (`Settings`, Abschnitt „News-Lebenszyklus") einen Button
  **„Jetzt ausführen"** ergänzen, der `POST /api/admin/pages/run-lifecycle` aufruft und das
  Ergebnis anzeigt (z. B. „Lebenszyklus ausgeführt: N Übergänge").

## Nicht-Ziele
- Keine Backend-Änderung (Endpunkt existiert bereits).
- Keine Änderung an Cron/Fristen-Logik.

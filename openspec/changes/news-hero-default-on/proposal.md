# „Im Hero anzeigen" als Default für neue News + Speicher-Hinweis

## Warum
News erscheinen nur dann in der Hero-Box, wenn „Im Hero anzeigen" (`showInHero`) angehakt ist.
Das wird leicht vergessen, weil das Feld bei neuen News standardmäßig **aus** ist — Redakteure
wundern sich dann, warum die News nicht in der Box auftaucht.

## Was
- **Default an:** Bei **neuen News** ist „Im Hero anzeigen" standardmäßig **aktiviert**
  (`showInHero = true`). Beim Bearbeiten bestehender News bleibt der gespeicherte Wert erhalten.
- **Hinweis beim Speichern:** Wird eine News gespeichert/veröffentlicht und ist „Im Hero anzeigen"
  aktiv, SHALL die Erfolgsmeldung darauf hinweisen (z. B. „… — wird im Hero angezeigt").

## Nicht-Ziele
- Keine Backend-Änderung (`showInHero` wird bereits verarbeitet).
- Kein Default-Wechsel für bestehende News; nur die Vorbelegung bei neuen News.
- Betrifft nur News (nicht Blog/Seminar/Static).

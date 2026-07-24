# Design — Hero-Default + Speicher-Hinweis

## `PageEditor.jsx`
- **Default:** Initial-State `showInHero: category === 'NEWS'` (statt fest `false`).
  - Neue News → vorbelegt `true`. Andere Kategorien → `false`.
  - Beim Bearbeiten überschreibt `fetchData()` den Wert mit dem gespeicherten (unverändert).
- **Speicher-Hinweis:** Kleiner Helfer für den Hero-Zusatz:
  `const heroNote = (category === 'NEWS' && data.showInHero) ? ' — wird im Hero angezeigt' : '';`
  - In `handleSave` an „Entwurf gespeichert" anhängen.
  - In `handlePublish` an „Veröffentlicht" anhängen (beide Stellen: neu + bestehend).
- Optional: kurzer erklärender Hinweistext unter der Checkbox („Erscheint in der Hero-Box der
  Startseite").

Keine weiteren Änderungen; `showInHero` fließt bereits über `toPayload()` (`...data`) ans Backend.

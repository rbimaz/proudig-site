# Given-When-Then Spezifikation: CMS-Seiten Navigation

> Datum: 2026-06-09
> Problem: Navigation zu CMS-Seiten-Editor funktioniert nicht

## Problembeschreibung

Die Komponenten `StaticPageList` und `StaticPageEditor` verwenden falsche Navigationspfade.
Statt `/admin/cms/seiten/...` wird `/admin/seiten/...` verwendet.

---

## Feature: StaticPageList Navigation

### Szenario 1: Neue Seite erstellen
```gherkin
Given der Benutzer ist auf /admin/cms/seiten (Seiten-Liste)
When der Benutzer auf "Neue Seite" klickt
Then wird zu /admin/cms/seiten/new navigiert
  And der StaticPageEditor wird angezeigt
  And das Formular ist leer (neue Seite)
```

### Szenario 2: Bestehende Seite bearbeiten
```gherkin
Given der Benutzer ist auf /admin/cms/seiten (Seiten-Liste)
  And eine Seite mit id="abc123" existiert
When der Benutzer auf "Bearbeiten" klickt
Then wird zu /admin/cms/seiten/abc123 navigiert
  And der StaticPageEditor wird angezeigt
  And das Formular zeigt die Daten der Seite
```

---

## Feature: StaticPageEditor Navigation

### Szenario 3: Zurueck zur Liste
```gherkin
Given der Benutzer bearbeitet eine Seite im StaticPageEditor
When der Benutzer auf "Zurueck" klickt
Then wird zu /admin/cms/seiten navigiert
  And die Seiten-Liste wird angezeigt
```

### Szenario 4: Nach Speichern einer neuen Seite
```gherkin
Given der Benutzer erstellt eine neue Seite (isNew=true)
When der Benutzer auf "Entwurf speichern" klickt
  And die API erfolgreich antwortet mit id="xyz789"
Then wird zu /admin/cms/seiten/xyz789 navigiert (replace)
  And die Seite kann weiter bearbeitet werden
```

### Szenario 5: Nach Veroeffentlichen einer neuen Seite
```gherkin
Given der Benutzer erstellt eine neue Seite (isNew=true)
When der Benutzer auf "Veroeffentlichen" klickt
  And die API erfolgreich antwortet mit id="xyz789"
Then wird zu /admin/cms/seiten/xyz789 navigiert (replace)
  And der Status zeigt "Veroeffentlicht"
```

---

## Technische Details

### Betroffene Dateien

| Datei | Zeile | Alt | Neu |
|-------|-------|-----|-----|
| `StaticPageList.jsx` | 65 | `/admin/seiten/new` | `/admin/cms/seiten/new` |
| `StaticPageList.jsx` | 98 | `/admin/seiten/${page.id}` | `/admin/cms/seiten/${page.id}` |
| `StaticPageEditor.jsx` | 140 | `/admin/seiten/${result.id}` | `/admin/cms/seiten/${result.id}` |
| `StaticPageEditor.jsx` | 170 | `/admin/seiten/${saved.id}` | `/admin/cms/seiten/${saved.id}` |
| `StaticPageEditor.jsx` | 338 | `/admin/seiten` | `/admin/cms/seiten` |

### Routing-Struktur (App.jsx)

```jsx
<Route path="/admin/cms" element={<AdminLayout />}>
  <Route path="seiten" element={<StaticPageList />} />
  <Route path="seiten/new" element={<StaticPageEditor />} />
  <Route path="seiten/:id" element={<StaticPageEditor />} />
</Route>
```

---

## Akzeptanzkriterien

1. Klick auf "Neue Seite" navigiert zu `/admin/cms/seiten/new`
2. Klick auf "Bearbeiten" navigiert zu `/admin/cms/seiten/{id}`
3. Klick auf "Zurueck" navigiert zu `/admin/cms/seiten`
4. Nach Speichern einer neuen Seite bleibt man im Editor
5. Alle Navigationen funktionieren in Production

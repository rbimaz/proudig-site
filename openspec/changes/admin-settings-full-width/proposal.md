# Einstellungsseite in voller Content-Breite

## Warum
Die Admin-Einstellungsseite (`/admin/cms/einstellungen`) nutzt zwar den vollbreiten Container
`admin-list-page`, begrenzt das Formular aber per Inline-Style (`maxWidth: 640px`) künstlich schmal.
Damit weicht sie als einzige Admin-Seite vom einheitlichen Erscheinungsbild ab (Listen, Editoren und
Mediathek nutzen bereits die volle Content-Breite mit rechts bündiger Kante).

## Was
- **`Settings.jsx`:** Inline-Begrenzung `style={{ maxWidth: '640px' }}` am `<form className="editor-form">`
  entfernen, sodass das Formular die volle Content-Breite des Content-Bereichs einnimmt — analog zu den
  übrigen Admin-Seiten.

## Nicht-Ziele
- Keine Änderung an Feldern, Speicherlogik oder Backend.
- Kein Umbau der internen Formstruktur (`form-section`, `form-group`, Duration-Felder bleiben).
- Die feldeigenen Breitenbegrenzungen (z. B. Duration-Eingabe `maxWidth: 120px`) bleiben erhalten.
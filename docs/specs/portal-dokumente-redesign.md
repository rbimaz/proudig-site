# Given-When-Then Spezifikation: Portal "Meine Dokumente" Redesign (Option 4)

> Design-Handoff: `portal_Aufgabenverwaltung2 (1).zip`
> Datum: 2026-06-09

## Überblick

Redesign der Portal-Dokumentenansicht mit zwei Hauptzielen:
1. **Eine Gutter-Achse** - Einheitliche horizontale Abstände (40px)
2. **Ein Action-Button-System** - Neutral im Ruhezustand, Farbe nur bei Hover

---

## Feature: Einheitliche Gutter-Achse

### Szenario 1: Alle Blöcke haben gleichen horizontalen Abstand
```gherkin
Given die Dokumenten-Seite wird geladen
When Titel, Toolbar und Liste angezeigt werden
Then haben alle Blöcke das gleiche horizontale Padding (40px links/rechts)
  And alle linken Kanten fluchten vertikal
  And alle rechten Kanten fluchten vertikal
```

---

## Feature: Kompakte Toolbar

### Szenario 2: Toolbar mit Breadcrumb und Aktionen
```gherkin
Given die Dokumenten-Seite wird geladen
When die Toolbar angezeigt wird
Then ist links der Breadcrumb (Stammverzeichnis) sichtbar
  And ist rechts "Hochladen" Button (neutral) sichtbar
  And ist rechts "Neuer Ordner" Button (orange primary) sichtbar
  And die Toolbar ist eine weiße Card mit Border und radius 12
```

### Szenario 3: Breadcrumb-Navigation in Toolbar
```gherkin
Given der Benutzer ist in Unterordner "Projekte/Kunde A"
When die Toolbar angezeigt wird
Then zeigt der Breadcrumb "Stammverzeichnis > Projekte > Kunde A"
  And jedes Segment ist klickbar
```

### Szenario 4: Hochladen-Button öffnet File-Dialog
```gherkin
Given die Toolbar wird angezeigt
When der Benutzer auf "Hochladen" klickt
Then öffnet sich der native File-Dialog
  And mehrere Dateien können ausgewählt werden
```

---

## Feature: Unified List (Ordner + Dateien)

### Szenario 5: Eine Tabelle für Ordner und Dateien
```gherkin
Given Ordner und Dateien existieren im aktuellen Verzeichnis
When die Liste angezeigt wird
Then werden Ordner und Dateien in einer Tabelle angezeigt
  And die Spalten sind: NAME | GRÖSSE | HOCHGELADEN | AKTION
  And Ordner erscheinen vor Dateien
```

### Szenario 6: Ordner-Zeile in unified List
```gherkin
Given ein Ordner "Projekte" mit 3 Elementen existiert
When die Zeile angezeigt wird
Then zeigt NAME ein Ordner-Icon (orange-weak Tile) + "Projekte"
  And zeigt GRÖSSE "3 Elemente"
  And zeigt HOCHGELADEN "—"
  And zeigt AKTION: Öffnen, Umbenennen, Löschen
```

### Szenario 7: Datei-Zeile in unified List
```gherkin
Given eine Datei "Report.pdf" (1.2 MB, hochgeladen 08.06.2026) existiert
When die Zeile angezeigt wird
Then zeigt NAME ein Datei-Icon (orange-weak Tile) + "Report.pdf"
  And zeigt GRÖSSE "1.2 MB"
  And zeigt HOCHGELADEN "08.06.2026, 14:30"
  And zeigt AKTION: Download, Umbenennen, Löschen
```

---

## Feature: Einheitliches Action-Button-System

### Szenario 8: Action-Buttons im Ruhezustand
```gherkin
Given eine Zeile mit Action-Buttons wird angezeigt
When kein Button fokussiert oder gehovert ist
Then sind alle Buttons identisch gestylt:
  | Eigenschaft | Wert |
  | Größe | 34×34 px |
  | Border-Radius | 8px |
  | Border | 1px solid var(--line) |
  | Hintergrund | weiß |
  | Icon-Farbe | var(--ink-3) muted |
```

### Szenario 9: Normal-Action Button Hover
```gherkin
Given ein "Öffnen", "Download" oder "Umbenennen" Button wird angezeigt
When der Benutzer den Button hovert
Then ändert sich der Border zu orange (--orange)
  And ändert sich die Icon-Farbe zu orange
  And ändert sich der Hintergrund zu orange-weak
```

### Szenario 10: Danger-Action Button Hover (Löschen)
```gherkin
Given ein "Löschen" Button wird angezeigt
When der Benutzer den Button hovert
Then ändert sich der Border zu rot (--danger)
  And ändert sich die Icon-Farbe zu rot
  And ändert sich der Hintergrund zu danger-weak
```

### Szenario 11: Action-Buttons Keyboard-Fokus
```gherkin
Given ein Benutzer navigiert per Tastatur
When ein Action-Button fokussiert wird
Then zeigt der Button denselben Hover-Stil
  And ist per Enter/Space aktivierbar
```

---

## Feature: Drop-Zone

### Szenario 12: Drop-Zone unter der Tabelle
```gherkin
Given die Dokumenten-Seite wird angezeigt
When Dateien per Drag & Drop abgelegt werden sollen
Then ist eine Drop-Zone unter der Tabelle sichtbar
  And die Drop-Zone akzeptiert Dateien per Drag & Drop
```

### Szenario 13: Drop-Zone Drag-Active State
```gherkin
Given Dateien werden über die Seite gezogen
When die Dateien über der Drop-Zone sind
Then wird die Drop-Zone visuell hervorgehoben
```

---

## Feature: Leerer Ordner

### Szenario 14: Empty State anzeigen
```gherkin
Given ein Ordner ist leer (keine Dateien, keine Unterordner)
When die Seite angezeigt wird
Then wird in der Liste ein Empty-State angezeigt:
  "Noch keine Elemente"
  And die Toolbar bleibt sichtbar
  And die Drop-Zone bleibt sichtbar
```

---

## Feature: Responsive Verhalten

### Szenario 15: Schmale Viewports
```gherkin
Given die Viewport-Breite ist < 900px
When die Seite angezeigt wird
Then werden GRÖSSE und HOCHGELADEN Spalten ausgeblendet
  And NAME und AKTION bleiben sichtbar
```

---

## Technische Details

### CSS-Tokens
```css
--orange-weak: rgba(237,122,49,.14);
--danger: #d65745;
--danger-weak: #fbeae7;
--ink-3: #85959d;
--line-2: #eef2f4;
```

### Grid-Layout
```css
grid-template-columns: 1fr 130px 170px 132px;
/* NAME | GRÖSSE | HOCHGELADEN | AKTION */
```

### Gutter
```css
padding: 0 40px; /* für alle Hauptblöcke */
```

---

## Feature: ConfirmDialog Komponente

### Szenario 16: ConfirmDialog wird angezeigt
```gherkin
Given eine Lösch-Aktion wird ausgelöst
When der ConfirmDialog geöffnet wird
Then wird ein Modal-Overlay mit Backdrop angezeigt
  And der Dialog ist zentriert (max-width 400px)
  And der Dialog zeigt Titel und Nachricht
  And der Dialog zeigt "Abbrechen" und "Löschen" Buttons
```

### Szenario 17: ConfirmDialog Danger-Variante
```gherkin
Given der ConfirmDialog wird mit danger=true geöffnet
When der Dialog angezeigt wird
Then zeigt der Dialog ein Warn-Icon (rot)
  And der Bestätigen-Button ist rot (danger)
```

### Szenario 18: ConfirmDialog schließen mit ESC
```gherkin
Given der ConfirmDialog ist geöffnet
When der Benutzer ESC drückt
Then wird der Dialog geschlossen
  And die Aktion wird nicht ausgeführt (onCancel)
```

### Szenario 19: ConfirmDialog schließen mit Backdrop-Klick
```gherkin
Given der ConfirmDialog ist geöffnet
When der Benutzer auf den Backdrop klickt
Then wird der Dialog geschlossen
  And die Aktion wird nicht ausgeführt (onCancel)
```

### Szenario 20: ConfirmDialog Bestätigung
```gherkin
Given der ConfirmDialog ist geöffnet
When der Benutzer auf "Löschen" klickt
Then wird onConfirm aufgerufen
  And der Dialog wird geschlossen
```

### Szenario 21: ConfirmDialog Abbruch
```gherkin
Given der ConfirmDialog ist geöffnet
When der Benutzer auf "Abbrechen" klickt
Then wird onCancel aufgerufen
  And der Dialog wird geschlossen
```

---

## Feature: Datei löschen

### Szenario 22: Datei-Lösch-Button öffnet ConfirmDialog
```gherkin
Given eine Datei "Report.pdf" wird in der Liste angezeigt
When der Benutzer auf den Löschen-Button klickt
Then öffnet sich der ConfirmDialog
  And der Titel ist "Datei löschen"
  And die Nachricht enthält "Report.pdf"
  And der Dialog ist danger-Variante
```

### Szenario 23: Datei löschen bestätigt
```gherkin
Given der Lösch-Dialog für "Report.pdf" ist geöffnet
When der Benutzer auf "Löschen" klickt
Then wird DELETE /api/documents/{id} aufgerufen
  And die Datei wird aus der Liste entfernt
  And der Dialog wird geschlossen
```

### Szenario 24: Datei löschen abgebrochen
```gherkin
Given der Lösch-Dialog für "Report.pdf" ist geöffnet
When der Benutzer auf "Abbrechen" klickt
Then wird keine API-Anfrage gesendet
  And die Datei bleibt in der Liste
  And der Dialog wird geschlossen
```

### Szenario 25: Datei löschen fehlgeschlagen
```gherkin
Given der Lösch-Dialog für "Report.pdf" ist geöffnet
When der Benutzer auf "Löschen" klickt
  And die API einen Fehler zurückgibt (403 oder 500)
Then wird eine Fehlermeldung angezeigt
  And die Datei bleibt in der Liste
```

---

## Feature: Ordner löschen mit ConfirmDialog

### Szenario 26: Ordner-Lösch-Button öffnet ConfirmDialog
```gherkin
Given ein Ordner "Projekte" wird in der Liste angezeigt
When der Benutzer auf den Löschen-Button klickt
Then öffnet sich der ConfirmDialog (nicht browser alert)
  And der Titel ist "Ordner löschen"
  And die Nachricht enthält "Projekte"
```

### Szenario 27: Ordner mit Inhalt zeigt Warnung
```gherkin
Given ein Ordner "Projekte" mit 5 Dateien und 2 Unterordnern existiert
When der Lösch-Dialog geöffnet wird
Then enthält die Nachricht "5 Dateien und 2 Unterordner"
  And die Nachricht warnt "Alle Inhalte werden unwiderruflich gelöscht"
```

### Szenario 28: Leerer Ordner zeigt einfache Bestätigung
```gherkin
Given ein leerer Ordner "Archiv" existiert
When der Lösch-Dialog geöffnet wird
Then ist die Nachricht kürzer (ohne Inhaltswarnung)
  And der Dialog ist trotzdem danger-Variante
```

---

## Entscheidungen

| Frage | Entscheidung |
|-------|--------------|
| Drop-Zone | Unter der Tabelle beibehalten |
| Upload-Button | Öffnet File-Dialog |
| Sidebar | Bleibt unverändert |
| Icons | Bootstrap Icons beibehalten |
| Bestätigungsdialog | Custom ConfirmDialog statt browser alert |

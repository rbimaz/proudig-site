## 1. Komponente

- [x] 1.1 `MediaLibrary` neu aufbauen: Kopfzeile (Titel + Zähler „N Dateien · X gesamt" + „Datei hochladen")
- [x] 1.2 Galerie links: Toolbar (Suche + Sortierung), 3-Spalten-Raster mit Vorschaukacheln (`cover`, echtes Bild), Auswahl-Rahmen, kompakte Upload-Kachel
- [x] 1.3 Detail-Panel rechts: Vorschau, Name + Typ-Pill, Metadaten (Größe, Abmessungen via `new Image()`, Hochgeladen), URL-Feld + Kopieren, Aktionen Umbenennen/Löschen
- [x] 1.4 Verhalten: Auswahl, Inline-Umbenennen (`PUT`), URL-Kopieren mit Toast, Löschen mit Bestätigung, Upload (Button/Kachel/Drag&Drop), leerer Zustand

## 2. Styles

- [x] 2.1 `.media-*`-Block in `admin.css` durch Handoff-Layout ersetzen (Tokens, Grid `1fr 320px`, Raster, Panel, Buttons, Pills; responsive < 900px)

## 3. Verifikation

- [x] 3.1 Frontend Lint/Build grün
- [x] 3.2 `openspec validate redesign-mediathek --strict` grün
- [x] 3.3 Visuelle Kontrolle gegen Zielbild (nach Admin-Login / Backend-Neustart)

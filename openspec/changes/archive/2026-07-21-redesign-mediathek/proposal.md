# Mediathek-Redesign „Galerie + Detail-Panel" (Design-Handoff 1c)

## Warum
Die Mediathek stellt die überdimensionierte Dropzone in den Vordergrund und die Aktionen sind
schwer erreichbar. Der Design-Handoff (Variante 1c) definiert ein aufgeräumtes, asset-zentriertes
Layout, das die Dateien betont und alle Aktionen klar zugänglich macht.

## Was
Neugestaltung von `MediaLibrary` (`/admin/cms/media`) gemäß Handoff:
- Kopfzeile: Titel „Mediathek" + Zähler („N Dateien · X gesamt"), primärer Button „Datei hochladen".
- Zweispaltiges Grid `1fr 320px`:
  - **Galerie (links):** Toolbar (Suche + Sortierung), 3-spaltiges Raster mit Vorschau-Kacheln
    (echtes Bild, `cover`), ausgewählte Kachel mit orangem Rahmen, kompakte gestrichelte
    **Upload-Kachel** statt großer Dropzone (Klick + Drag&Drop).
  - **Detail-Panel (rechts):** großes Vorschaubild, Dateiname + Typ-Pill, Metadaten
    (Größe, Abmessungen, Hochgeladen), URL-Feld mit „Kopieren", Aktionen **Umbenennen** (primär)
    und **Löschen** (rot-outline) in voller Breite.
- Verhalten: Kachel-Klick wählt Datei; Umbenennen als Inline-Edit im Panel; URL kopieren mit
  Toast; Löschen mit Bestätigung; Upload aktualisiert die Liste. Leerer Zustand mit zentrierter
  Upload-Kachel und Panel-Platzhalter. Responsive: unter ~900px einspaltig, Raster 2-spaltig.

## Nicht-Ziele
- Keine Ordner/Kategorien, keine Bildbearbeitung, keine serverseitige Thumbnail-Generierung.
- Backend-CRUD bleibt unverändert (Upload/List/Update/Delete existieren bereits).

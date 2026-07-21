# Media-Auslieferung reparieren & Titelbild optional machen

## Warum
Zwei Backend-Bugs verhindern das Erstellen von Inhalten und die Nutzung der Mediathek:

- **Anlegen scheitert ohne Titelbild.** `PageService.createPage`/`updatePage` prüfen nur
  `coverImageId != null`. Das Frontend sendet aber `""` (leerer String) → `findById("")` →
  `NoSuchElementException: Cover image not found`. News/Blog/Seminare lassen sich nur mit
  Titelbild anlegen.
- **Mediathek-Bilder erscheinen nicht (HTTP 404).** `MediaController.serveMedia`/`serveThumbnail`
  lösen den Dateipfad falsch auf: `FileStorageService.store()` liefert nur den Dateinamen zurück,
  die Datei liegt aber unter `<location>/media/<datei>`. `serveMedia` baut daraus
  `Paths.get(dateiname).toAbsolutePath()` (ohne Basis-Verzeichnis und ohne `media/`-Unterordner)
  → Datei nicht gefunden. Titelbild-Vorschauen, eingefügte Inhaltsbilder, das MediaLibrary-Grid und
  öffentliche Bilder bleiben leer.

## Was
- Titelbild optional: leeren/blanken `coverImageId` wie „kein Titelbild" behandeln (Backend-Guard;
  Frontend sendet `null` statt `""`).
- `serveMedia`/`serveThumbnail` über die vorhandene, korrekte `FileStorageService.load(name, "media")`
  ausliefern.

## Nicht-Ziele
- Keine Änderung am Speicherformat bestehender Medien (`storage_path` bleibt der Dateiname).
- Keine echte Thumbnail-Generierung (Thumbnail liefert weiterhin das Originalbild).

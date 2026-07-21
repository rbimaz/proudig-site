# Design — Media-Auslieferung & optionales Titelbild

## Titelbild optional
`PageService.createPage` und `updatePage`: Bedingung von `coverImageId != null` auf
`coverImageId != null && !coverImageId.isBlank()` ändern. Damit wird ein leerer/blanker Wert
als „kein Titelbild" behandelt (kein `findById`-Aufruf, keine Exception).

Zusätzlich im Frontend (`PageEditor.toPayload`): `coverImageId: data.coverImageId || null`, damit
leere Auswahl als `null` übertragen wird (sauber; Backend-Guard ist die eigentliche Absicherung).

## Media-Auslieferung
`MediaController.serveMedia` und `serveThumbnail` nutzen die bereits vorhandene, korrekte
Methode `FileStorageService.load(filename, subDir)`, die `location/media/<datei>` auflöst:

```java
MediaDto media = mediaService.getMedia(id);
Resource resource = fileStorageService.load(media.getStoragePath(), "media");
return ResponseEntity.ok()
    .contentType(MediaType.parseMediaType(media.getContentType()))
    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getName() + "\"")
    .body(resource);
```

Fehlerfall (Datei nicht vorhanden) → `404`. `MediaController` erhält dazu `FileStorageService`
als zusätzliche Abhängigkeit (Konstruktor-Injektion). `mediaService.getMediaFilePath(...)` wird
für die Auslieferung nicht mehr benötigt.

## Hinweis
Änderungen greifen erst nach Backend-Neustart (lokaler Prozess). Bestehende Medien funktionieren
danach ohne Migration, da `storage_path` unverändert der Dateiname bleibt.

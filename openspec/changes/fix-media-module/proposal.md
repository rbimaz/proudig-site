# Mediathek reparieren und in den Editor integrieren

## Warum
Die Admin-Mediathek ist an mehreren Stellen fehlerhaft:

- **Upload defekt**: `MediaLibrary` POSTet an `/api/admin/media/upload`, der `MediaController`
  erwartet `POST /api/admin/media` → HTTP 404, Hochladen schlägt fehl.
- **Falsche DTO-Felder**: Das Grid liest `item.url`, `item.filename`, `item.type` — `MediaDto`
  liefert aber `id`, `name`, `contentType`, `fileSize`. Folge: kaputte Vorschau, „URL kopieren"
  ohne Wert, und `item.filename.split('.')` crasht, sobald Dateien vorhanden sind.
- **Keine Editor-Integration**: Im `PageEditor` muss die Titelbild-ID manuell eingetippt werden
  (`media-id-123`) statt aus der Mediathek gewählt zu werden.

## Was
- Upload-Endpunkt im Frontend korrigieren.
- `MediaLibrary`-Grid auf die tatsächlichen `MediaDto`-Felder umstellen (Bild-URL `/api/media/{id}`,
  Name `name`, Typ `contentType`), „URL kopieren" und Datei-Icon robust machen.
- Einen Bild-Picker (Auswahl aus der Mediathek) im `PageEditor` für das Titelbild ergänzen.

## Nicht-Ziele
- Keine Änderung an der Backend-`MediaController`/`MediaService`-Logik (Frontend an DTO angleichen).

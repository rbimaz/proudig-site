# Design — Mediathek-Redesign 1c

## Komponente (`MediaLibrary.jsx`, Rewrite)
State: `media[]`, `loading`, `uploading`, `dragActive`, `toast`, `selectedId`, `dims{w,h}`,
`searchQuery`, `sortBy`, `renaming`, `renameValue`.

- `selected` = `media.find(id === selectedId)` (Fallback: erstes Element). Nach dem Laden wird das
  erste Element vorausgewählt; nach Upload die neue Datei.
- Sichtbare Liste = `media` nach `searchQuery` (Name) gefiltert und nach `sortBy` sortiert
  (`neueste`=createdAt desc, `aelteste`=asc, `name`=A–Z).
- **Abmessungen:** nicht im `MediaDto` — clientseitig via `new Image()` beim Wechsel von
  `selectedId` (nur für Bilder) ermittelt; für Nicht-Bilder Zeile ausblenden.
- **Größe/Gesamt:** `fileSize` formatiert (B/KB/MB); Zähler summiert `fileSize`.
- **Typ-Pill:** Dateiendung aus `name` (Großbuchstaben) bzw. `contentType`.
- **Umbenennen:** Inline-Edit im Panel (Dateiname → Input + Speichern/Abbrechen) →
  `PUT /api/admin/media/{id}` (Endpunkt existiert), Liste aktualisieren.
- **URL kopieren:** `/api/media/{id}` in Zwischenablage → Toast.
- **Löschen:** `confirm()` → `DELETE`.
- **Upload:** Button „Datei hochladen", Upload-Kachel, Drag&Drop auf die Galerie → `POST` →
  neue Datei vorn einfügen und auswählen.
- **Leerer Zustand:** nur große Upload-Kachel; Panel mit Platzhaltertext.

## Styles (`admin.css`)
Bestehenden `.media-*`-Block ersetzen durch das Handoff-Layout mit den Design-Tokens:
Primär `#E8731A`/`#D06515`, Navy `#0F2B3C`, Rahmen `#E2E8F0`, Panel `#fff`, Pill-BG `#FDE8D3`,
Löschen `#E53E3E`/`#FBD5D5`, Text `#1A1D23`, Sekundärtext `#4A5568`/`#718096`/`#A0AEC0`.
Radius Karten 10–12px, Buttons/Felder 8px, Pills 100px. Space-Grotesk für Titel/Dateinamen
(Font wird bereits global geladen); sonst Inter.

Grid: `.media-layout { grid-template-columns: 1fr 320px; gap: 24px }`; Galerie-Raster
`repeat(3, 1fr); gap:16px`; Kachel-Thumbnail `height:110px`, `object-fit:cover`; Panel-Vorschau
`height:180px`. Responsive `@media (max-width:900px)`: Layout einspaltig, Raster 2-spaltig.

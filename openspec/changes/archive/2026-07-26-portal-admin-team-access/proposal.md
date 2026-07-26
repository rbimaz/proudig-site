# Portal als gemeinsamer Personal-Team-Bereich

## Warum
Das Dokumentenportal ist als **strikte Pro-Benutzer-Isolation** gebaut: Jeder Benutzer – auch ein
Admin – sieht ausschließlich seine eigenen Uploads (`Document.uploadedBy`) und die ihm explizit
freigegebenen Dokumente. Ordner sind ebenfalls eigentümer-basiert.

Fachlich dient das Portal jedoch der **Team-Arbeit des Personals**: Lädt ein Mitarbeiter ein Dokument
hoch, muss ein Kollege es sehen und damit arbeiten können. Aktuell ist das nicht der Fall – jeder sieht
nur seine eigene Insel. Inkonsistent ist zudem, dass Admins fremde **Ordner** bereits umbenennen,
verschieben und (rekursiv inkl. Dokumente) löschen dürfen (`FolderService.canAccess`), die enthaltenen
Dokumente aber weder auflisten noch öffnen können.

## Rollenmodell (Zwei Stufen)
- **Personal = Rolle `ADMIN` oder `CONSULTANT`.** Bekommt volle **Team-Sicht**: alle Dokumente und
  alle Ordner sehen, navigieren, Metadaten abrufen und herunterladen (voller Pool, inkl. der von
  Clients erstellten Inhalte).
- **Nur `ADMIN`.** Darf zusätzlich fremde Objekte **verwalten**: Dokument-Beschreibung ändern,
  Dokument löschen, in fremde Ordner hochladen, fremde Ordner anlegen/umbenennen/verschieben/löschen
  sowie beliebige Dokumente freigeben und Freigaben verwalten.
- **`CLIENT` (übrige Benutzer).** **Unverändert**: nur eigene Uploads/Ordner + explizit freigegebene
  Dokumente.

Die Asymmetrie „Consultant sieht alles, verwaltet fremde Objekte aber nicht" ist bewusst gewählt.

## Was
- **Dokumente (`portal-documents`):**
  - Auflisten `GET /api/documents`: Personal **alle**, Client nur eigene.
  - Ordnerinhalt `GET /api/documents/folder/{id}`: Personal darf jeden Ordner öffnen.
  - Einzel-Metadaten `GET /api/documents/{id}`: Personal darf jedes Dokument abrufen.
  - Download `GET /api/documents/{id}/download`: Zugriff für Eigentümer/Freigabe **oder Personal**.
  - Verwaltung (**nur Admin**): Beschreibung ändern (`PUT`), löschen (`DELETE`), Upload in fremde
    Ordner (`POST` mit fremder `folderId`).
- **Ordner (`portal-folders`):**
  - Auflisten/Navigieren `GET /api/folders`, `/{id}/children`, `/{id}`: Personal sieht/navigiert
    **alle** Ordner; Client nur eigene.
  - Anlegen unter fremdem Parent (`POST`): **nur Admin**.
  - Umbenennen/Verschieben/Löschen fremder Ordner: bleibt wie bisher **nur Admin** (unverändert).
- **Freigaben (`portal-sharing`):**
  - Freigeben, Freigaben einsehen, widerrufen: zusätzlich für **Admins** (nicht nur Eigentümer).
  - `canAccessDocument` (Download-Gate): zusätzlich für **Personal**.
- **Frontend (`PortalDocuments.jsx`):** Uploader (`uploadedByName`, DTO-Feld vorhanden) in der
  **Dokumentliste** anzeigen, damit die Herkunft erkennbar ist. Ordner erhalten **keine**
  Eigentümer-Anzeige.
- **Technik:** zwei kleine private Helper analog zum bestehenden Muster
  (`user.getRoles().stream().anyMatch(...)`): `isStaff` (ADMIN|CONSULTANT) für Lesezugriffe, `isAdmin`
  (ADMIN) für Verwaltung; neue Repository-Methode `FolderRepository.findByParentFolderIsNull()`.

## Nicht-Ziele
- **Keine Änderung für Clients.** Weiterhin nur Eigenes + Freigaben.
- Keine Erweiterung der Ordner-Verwaltung (Umbenennen/Verschieben/Löschen/Anlegen-unter-fremd) auf
  Consultants – bleibt Admin-only.
- Kein Umbau des Freigabe-Modells und keine Durchsetzung von `VIEW`/`EDIT`.
- Keine Ordner-Freigaben für Clients.
- Keine Paginierung. Hinweis: `GET /api/documents`/`/api/folders` liefern für Personal künftig den
  gesamten Pool ungeblättert (wie bisher pro Benutzer auch) – bei großen Datenmengen später ggf.
  nachzurüsten.

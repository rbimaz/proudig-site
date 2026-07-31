## Why

Consultants sollen im Dokumenten-Portal mitarbeiten können: eigene Dokumente
anlegen/hochladen, dabei aber **nur die eigenen** sehen. Admins sollen einzelne
Dokumente gezielt **mit einem Consultant teilen** können. Heute ist das Portal
ADMIN-only, und für Personal (inkl. Consultant) gilt eine „sieht alles"-Team-
Sicht — das erfüllt die gewünschte Trennung nicht. Zusätzlich prüft der Download-
Endpoint aktuell kein Eigentum (bestehendes Zugriffsleck), das dabei geschlossen
wird.

## What Changes

- **Sichtbarkeit neu:** Nur `ADMIN` sieht alle Dokumente/Ordner. `CONSULTANT`
  wird eigentümer-gescoped und sieht **nur eigene** Dokumente **plus** die mit ihm
  geteilten. (Kehrt die bisherige „Personal sieht alles"-Regel für Consultant um.)
- **Portalzugriff öffnen:** `/api/documents/**` und `/api/folders/**` für
  `ADMIN` **und** `CONSULTANT` (statt nur ADMIN). Nutzerverwaltung
  (`/api/users`, `/api/portal/users`), Einstellungen und externe Freigaben
  (`/api/shares`) bleiben ADMIN-only.
- **Internes Teilen (neu):** Eine `DocumentShare`-Zuordnung (Dokument ↔ Nutzer),
  die ein `ADMIN` anlegt/widerruft (`POST`/`DELETE /api/documents/{id}/share`).
  Getrennt von den bestehenden externen `ExternalShareLink`.
- **„Mit mir geteilt":** Consultant sieht geteilte Dokumente in einer eigenen
  Ansicht (liegen physisch in fremden Ordnern).
- **Zentrale Zugriffsprüfung:** `canAccess(user, doc) = ADMIN || Eigentümer ||
  mit ihm geteilt`, konsequent in Liste, Metadaten, **Download**, Umbenennen,
  Verschieben, Löschen — schließt das Download-Leck. Verletzung → `IllegalAccessError`.
- **Umfang bewusst minimal:** Freigabe pro Dokument, **nur lesend** (Ansicht/
  Download). Kein Schreibrecht, keine Ordner-Freigabe in v1.

## Capabilities

### New Capabilities
<!-- Keine neue Capability. -->

### Modified Capabilities
- `portal-documents`: Sichtbarkeit rollenabhängig verschärft (nur ADMIN sieht
  alles; CONSULTANT nur eigene + geteilte), Portalzugriff für Dokumente/Ordner auf
  ADMIN+CONSULTANT erweitert, Download-Zugriffsprüfung erzwungen, interne Freigabe
  an einen Nutzer und „Mit mir geteilt"-Ansicht ergänzt.

## Impact

- **DB:** neue Tabelle `document_shares` (Liquibase-Migration).
- **Backend:** `DocumentShare`-Entität/Repository; `DocumentService`
  (isStaff→ADMIN-only für Sichtbarkeit, Union eigener+geteilter, zentrale
  `canAccess`, Download-Fix); `DocumentController` (Share-Endpoints, Zugriffs-
  erzwingung); `SecurityConfig`/Controller-`@PreAuthorize` für CONSULTANT;
  Activity-Log für share/unshare.
- **Frontend:** Portal-Dokumentbereich für CONSULTANT (Route-Guard), Upload +
  eigene Liste + „Mit mir geteilt"; Admin-Aktion „mit Nutzer teilen".
  Nutzerverwaltung/Einstellungen bleiben ADMIN-only.
- Betrifft `portal-sharing` (externe Links) NICHT; internes Teilen ist getrennt.

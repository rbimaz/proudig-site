# portal-folders Specification

## Purpose
Hierarchische Ordnerstruktur des Portals: Anlegen, Auflisten/Navigieren,
Umbenennen und rekursives Löschen von Ordnern. Lese- und Anlege-Zugriff sind
eigentümer-basiert; Umbenennen und Löschen erlauben zusätzlich Administratoren.

## Requirements
### Requirement: Ordner anlegen
Das Portal SHALL authentifizierten Benutzern erlauben, einen Ordner über
`POST /api/folders` (`{name, parentFolderId?}`) anzulegen. Der erzeugte Ordner
gehört dem anlegenden Benutzer. Wird ein `parentFolderId` angegeben, MUSS der
übergeordnete Ordner dem Benutzer gehören, sonst wird mit `IllegalAccessError`
abgewiesen. Ersetzt `FOLD-001`, `FOLD-004`.

Hinweis: Beim Anlegen wird der Name aktuell nicht auf Leerheit geprüft (anders
als beim Umbenennen).

#### Scenario: Root-Ordner anlegen
- **WHEN** ein Benutzer einen Ordner ohne `parentFolderId` anlegt
- **THEN** wird ein Ordner mit `parentFolder = NULL` und dem Benutzer als Eigentümer erstellt

#### Scenario: Unterordner unter fremdem Ordner wird abgelehnt
- **WHEN** ein Benutzer einen Ordner mit einem `parentFolderId` anlegt, dessen übergeordneter Ordner einem anderen Benutzer gehört
- **THEN** wird die Anlage mit `IllegalAccessError` abgewiesen

### Requirement: Ordner auflisten und navigieren
Das Portal SHALL einem Benutzer nur seine eigenen Ordner auflisten:
`GET /api/folders` (Root-Ordner), `GET /api/folders/{folderId}/children`
(Unterordner) und `GET /api/folders/{folderId}` (einzelner Ordner). Beim Abruf
von Unterordnern MUSS der übergeordnete Ordner dem Benutzer gehören. Jeder Ordner
liefert `documentCount`, `childFolderCount` und `hasChildren` für die Navigation.
Ersetzt `FOLD-005`, `PORT-PERM-002` (Ordner-Anteil).

#### Scenario: Nur eigene Ordner sichtbar
- **WHEN** ein Benutzer seine Root-Ordner abruft
- **THEN** enthält die Antwort ausschließlich Ordner, deren Eigentümer er ist

#### Scenario: Unterordner eines fremden Ordners nicht abrufbar
- **WHEN** ein Benutzer die Unterordner eines Ordners abruft, der einem anderen Benutzer gehört
- **THEN** wird der Zugriff mit `IllegalAccessError` abgewiesen

### Requirement: Ordner umbenennen
Das Portal SHALL das Umbenennen eines Ordners über
`PUT /api/folders/{folderId}` (`{name}`) erlauben, wenn der Benutzer Eigentümer
ODER Administrator ist. Ein leerer Name wird mit `IllegalArgumentException`
abgewiesen. Ersetzt `FOLD-002`.

#### Scenario: Eigentümer benennt Ordner um
- **WHEN** der Eigentümer einen nicht-leeren Namen sendet
- **THEN** wird der Ordnername (getrimmt) und `updatedAt` aktualisiert

#### Scenario: Leerer Name wird abgelehnt
- **WHEN** ein leerer oder nur aus Leerzeichen bestehender Name gesendet wird
- **THEN** wird mit `IllegalArgumentException` abgewiesen und nichts geändert

### Requirement: Ordner rekursiv löschen
Das Portal SHALL das Löschen eines Ordners über
`DELETE /api/folders/{folderId}` erlauben, wenn der Benutzer Eigentümer ODER
Administrator ist. Der Ordner wird zusammen mit allen Unterordnern und allen
enthaltenen Dokument-Metadaten **rekursiv** gelöscht. Ersetzt `FOLD-003`,
`PORT-PERM-003` (Ordner-Anteil).

Hinweis (Ist-Zustand, weicht von `FOLD-003` "nur wenn leer" ab): Das Löschen ist
rekursiv, nicht auf leere Ordner beschränkt. Dabei werden nur die
Datenbanksätze der Dokumente entfernt — die **physischen Dateien im Dateisystem
bleiben erhalten** (verwaiste Dateien). Es wird **kein** Aktivitätsprotokoll-
Eintrag für das Ordnerlöschen geschrieben.

#### Scenario: Ordner mit Inhalt wird rekursiv gelöscht
- **WHEN** der Eigentümer einen Ordner löscht, der Unterordner und Dokumente enthält
- **THEN** werden der Ordner, seine Unterordner und die Dokument-Metadaten entfernt

#### Scenario: Fremder Ordner ohne Adminrechte nicht löschbar
- **WHEN** ein Nicht-Eigentümer ohne ADMIN-Rolle einen Ordner löscht
- **THEN** wird mit `IllegalAccessError` abgewiesen und nichts gelöscht


## MODIFIED Requirements

### Requirement: Ordner anlegen
Das Portal SHALL authentifizierten Benutzern erlauben, einen Ordner über
`POST /api/folders` (`{name, parentFolderId?}`) anzulegen. Der erzeugte Ordner
gehört dem anlegenden Benutzer. Wird ein `parentFolderId` angegeben, MUSS der
übergeordnete Ordner dem Benutzer gehören ODER der Benutzer die Rolle `ADMIN`
haben, sonst wird mit `IllegalAccessError` abgewiesen.

Hinweis: Beim Anlegen wird der Name aktuell nicht auf Leerheit geprüft (anders
als beim Umbenennen).

#### Scenario: Root-Ordner anlegen
- **WHEN** ein Benutzer einen Ordner ohne `parentFolderId` anlegt
- **THEN** wird ein Ordner mit `parentFolder = NULL` und dem Benutzer als Eigentümer erstellt

#### Scenario: Unterordner unter fremdem Ordner wird für Nicht-Admins abgelehnt
- **WHEN** ein Benutzer ohne `ADMIN`-Rolle (Client oder Consultant) einen Ordner mit einem `parentFolderId` anlegt, dessen übergeordneter Ordner einem anderen Benutzer gehört
- **THEN** wird die Anlage mit `IllegalAccessError` abgewiesen

#### Scenario: Admin legt Unterordner unter fremdem Ordner an
- **WHEN** ein `ADMIN` einen Ordner unter einem fremden Elternordner anlegt
- **THEN** wird der Ordner erstellt (Eigentümer bleibt der anlegende Admin)

### Requirement: Ordner auflisten und navigieren
Das Portal SHALL Ordner rollenabhängig auflisten. **Personal** (Benutzer mit
Rolle `ADMIN` oder `CONSULTANT`) sieht als gemeinsamen Team-Baum **alle** Ordner;
ein **Client** sieht nur seine eigenen. Endpoints: `GET /api/folders`
(Root-Ordner), `GET /api/folders/{folderId}/children` (Unterordner) und
`GET /api/folders/{folderId}` (einzelner Ordner). Beim Abruf von Unterordnern
MUSS der übergeordnete Ordner dem Benutzer gehören ODER der Benutzer Personal
sein. Jeder Ordner liefert `documentCount`, `childFolderCount` und `hasChildren`
für die Navigation.

#### Scenario: Client sieht nur eigene Ordner
- **WHEN** ein Client seine Root-Ordner abruft
- **THEN** enthält die Antwort ausschließlich Ordner, deren Eigentümer er ist

#### Scenario: Personal sieht alle Ordner
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` die Root-Ordner abruft
- **THEN** enthält die Antwort alle Root-Ordner des Portals, auch die anderer Benutzer

#### Scenario: Unterordner eines fremden Ordners für Client nicht abrufbar
- **WHEN** ein Client die Unterordner eines Ordners abruft, der einem anderen Benutzer gehört
- **THEN** wird der Zugriff mit `IllegalAccessError` abgewiesen

#### Scenario: Personal navigiert fremde Unterordner
- **WHEN** ein Benutzer mit Rolle `ADMIN` oder `CONSULTANT` die Unterordner eines fremden Ordners abruft
- **THEN** werden die Unterordner dieses Ordners zurückgegeben

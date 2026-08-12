## ADDED Requirements

### Requirement: Ordner-Operationen protokollieren

Das Portal SHALL Ordner-Operationen im Aktivitätsprotokoll erfassen: **Anlegen,
Umbenennen, Löschen und Verschieben** eines Ordners SHALL je einen Eintrag
(Typ `FOLDER`, jeweilige Aktion, handelnder Nutzer, Ordnerbezug) schreiben. Damit
wird die bisherige Lücke (u. a. kein Log beim Ordnerlöschen) geschlossen.

#### Scenario: Ordnerlöschen wird protokolliert
- **WHEN** ein berechtigter Nutzer einen Ordner löscht
- **THEN** wird ein Aktivitätsprotokoll-Eintrag (`DELETE`/`FOLDER`) geschrieben

#### Scenario: Anlegen/Umbenennen/Verschieben wird protokolliert
- **WHEN** ein berechtigter Nutzer einen Ordner anlegt, umbenennt oder verschiebt
- **THEN** wird jeweils ein passender Aktivitätsprotokoll-Eintrag geschrieben

## MODIFIED Requirements

### Requirement: Ordner anlegen
Das Portal SHALL authentifizierten Benutzern erlauben, einen Ordner über
`POST /api/folders` (`{name, parentFolderId?}`) anzulegen. Der erzeugte Ordner
gehört dem anlegenden Benutzer. Wird ein `parentFolderId` angegeben, MUSS der
Benutzer auf den übergeordneten Ordner **Schreibzugriff** haben — d. h. er ist
Eigentümer, `ADMIN`, **oder** er hat auf den übergeordneten Ordner (bzw. einen
Vorfahren) eine **WRITE-Freigabe** (direkt oder über eine Gruppe); sonst wird mit
`IllegalAccessError` abgewiesen.

Hinweis: Beim Anlegen wird der Name aktuell nicht auf Leerheit geprüft (anders
als beim Umbenennen).

#### Scenario: Root-Ordner anlegen
- **WHEN** ein Benutzer einen Ordner ohne `parentFolderId` anlegt
- **THEN** wird ein Ordner mit `parentFolder = NULL` und dem Benutzer als Eigentümer erstellt

#### Scenario: Unterordner unter fremdem Ordner wird abgelehnt
- **WHEN** ein Benutzer einen Ordner mit einem `parentFolderId` anlegt, dessen übergeordneter Ordner einem anderen Benutzer gehört und für den er keine WRITE-Freigabe/kein ADMIN hat
- **THEN** wird die Anlage mit `IllegalAccessError` abgewiesen

#### Scenario: WRITE-Empfänger legt Unterordner an
- **WHEN** ein Benutzer mit WRITE-Freigabe auf einen (fremden) Ordner darin einen Unterordner anlegt
- **THEN** wird der Ordner erstellt (Eigentümer = der anlegende Benutzer)

#### Scenario: Admin legt Unterordner unter fremdem Ordner an
- **WHEN** ein `ADMIN` einen Ordner unter einem fremden Elternordner anlegt
- **THEN** wird der Ordner erstellt (Eigentümer bleibt der anlegende Admin)

### Requirement: Ordner rekursiv löschen
Das Portal SHALL das Löschen eines Ordners über
`DELETE /api/folders/{folderId}` erlauben, wenn der Benutzer **Eigentümer** ODER
`ADMIN` ist, ODER wenn der Benutzer den Ordner **selbst als Unterordner innerhalb
eines ihm mit WRITE freigegebenen Teilbaums angelegt** hat (`owner = er`). Ein
reiner WRITE-Empfänger SHALL **nicht** den geteilten Wurzelordner oder von anderen
angelegte Ordner löschen können. Der Ordner wird zusammen mit allen Unterordnern
und allen enthaltenen Dokument-Metadaten **rekursiv** gelöscht; an den gelöschten
Ordnern hängende Freigaben werden mit entfernt.

Hinweis (Ist-Zustand): Das Löschen ist rekursiv, nicht auf leere Ordner
beschränkt. Es werden nur die Datenbanksätze der Dokumente entfernt — die
**physischen Dateien im Dateisystem bleiben erhalten** (verwaiste Dateien).

#### Scenario: Ordner mit Inhalt wird rekursiv gelöscht
- **WHEN** der Eigentümer einen Ordner löscht, der Unterordner und Dokumente enthält
- **THEN** werden der Ordner, seine Unterordner und die Dokument-Metadaten entfernt

#### Scenario: WRITE-Empfänger löscht selbst angelegten Unterordner
- **WHEN** ein WRITE-Empfänger einen von ihm selbst angelegten Unterordner im geteilten Teilbaum löscht
- **THEN** wird der Unterordner (rekursiv) entfernt

#### Scenario: WRITE-Empfänger kann geteilten/fremden Ordner nicht löschen
- **WHEN** ein WRITE-Empfänger den geteilten Wurzelordner oder einen von jemand anderem angelegten Ordner löscht
- **THEN** wird mit `IllegalAccessError` abgewiesen und nichts gelöscht

#### Scenario: Fremder Ordner ohne Adminrechte nicht löschbar
- **WHEN** ein Benutzer ohne Eigentum, ADMIN oder WRITE-Freigabe einen Ordner löscht
- **THEN** wird abgewiesen und nichts gelöscht

### Requirement: Ordner per Drag & Drop verschieben
Das System SHALL Nutzern erlauben, einen Ordner per Drag & Drop im Ordnerbaum an
ein anderes Elternverzeichnis (oder auf die Wurzel) zu verschieben, über einen
Move-Vorgang (`PUT /api/folders/{id}/move` mit dem Ziel-Elternordner). Das
Verschieben SHALL nur zulässig sein, wenn der Nutzer **Eigentümer/ADMIN** ist ODER
den Ordner **selbst innerhalb eines WRITE-Teilbaums angelegt** hat; Quelle und Ziel
MÜSSEN dann innerhalb desselben Berechtigungsbereichs (eigener Baum bzw. derselbe
WRITE-Teilbaum) liegen. Das System SHALL ein Verschieben ablehnen (HTTP 400), wenn
das Ziel der Ordner selbst oder einer seiner Nachfahren ist (Zyklus-Schutz). Nach
erfolgreichem Verschieben SHALL sich der Ordnerbaum aktualisieren.

#### Scenario: Ordner in anderen Ordner verschieben
- **WHEN** ein Nutzer einen eigenen Ordner auf einen anderen eigenen Ordner zieht und ablegt
- **THEN** wird der Ordner unter das Ziel gehängt (`parentFolder` = Ziel)

#### Scenario: Ordner auf die Wurzel verschieben
- **WHEN** ein Eigentümer (bzw. ADMIN) einen eigenen Unterordner auf den Wurzelbereich zieht und ablegt
- **THEN** wird der Ordner zum Wurzelordner (`parentFolder` = leer)

#### Scenario: WRITE-Empfänger verschiebt selbst angelegten Ordner im Teilbaum
- **WHEN** ein WRITE-Empfänger einen von ihm angelegten Unterordner innerhalb desselben WRITE-Teilbaums verschiebt
- **THEN** wird der Ordner an das Ziel gehängt

#### Scenario: Verschieben in einen Nachfahren wird abgelehnt
- **WHEN** ein Nutzer versucht, einen Ordner in sich selbst oder einen seiner Nachfahren zu verschieben
- **THEN** lehnt das System mit HTTP 400 ab und die Struktur bleibt unverändert

#### Scenario: Fremde Ordner sind nicht betroffen
- **WHEN** der Ordner oder das Ziel außerhalb des eigenen Baums bzw. des WRITE-Teilbaums liegt
- **THEN** wird das Verschieben abgelehnt

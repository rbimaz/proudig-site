## ADDED Requirements

### Requirement: Ordner per Drag & Drop verschieben
Das System SHALL Nutzern erlauben, einen eigenen Ordner innerhalb ihres
Stammverzeichnisses per Drag & Drop im Ordnerbaum an ein anderes
Elternverzeichnis (oder auf die Wurzel) zu verschieben. Der Server SHALL das
Verschieben über einen Move-Vorgang (`PUT /api/folders/{id}/move` mit dem
Ziel-Elternordner) durchführen und dabei prüfen, dass der Ordner und das Ziel dem
Nutzer gehören. Das System SHALL ein Verschieben ablehnen (HTTP 400), wenn das
Ziel der Ordner selbst oder einer seiner Nachfahren ist (Zyklus-Schutz). Nach
erfolgreichem Verschieben SHALL sich der Ordnerbaum aktualisieren.

#### Scenario: Ordner in anderen Ordner verschieben
- **WHEN** ein Nutzer einen eigenen Ordner auf einen anderen eigenen Ordner zieht und ablegt
- **THEN** wird der Ordner unter das Ziel gehängt (`parentFolder` = Ziel) und der Baum zeigt die neue Struktur

#### Scenario: Ordner auf die Wurzel verschieben
- **WHEN** ein Nutzer einen Unterordner auf den Wurzelbereich zieht und ablegt
- **THEN** wird der Ordner zum Wurzelordner (`parentFolder` = leer)

#### Scenario: Verschieben in einen Nachfahren wird abgelehnt
- **WHEN** ein Nutzer versucht, einen Ordner in sich selbst oder einen seiner Nachfahren zu verschieben
- **THEN** lehnt das System mit HTTP 400 ab und die Struktur bleibt unverändert

#### Scenario: Fremde Ordner sind nicht betroffen
- **WHEN** der Ordner oder das Ziel nicht dem Nutzer gehört
- **THEN** wird das Verschieben abgelehnt

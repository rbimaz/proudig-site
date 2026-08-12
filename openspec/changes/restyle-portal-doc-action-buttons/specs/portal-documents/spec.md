## ADDED Requirements

### Requirement: Darstellung der Aktions-Buttons der Dokumentenliste

Die Aktions-Buttons in der Dokumenten-/Ordnerliste (`/admin/portal/documents`)
SHALL als einheitliche, quadratische **Icon-Buttons** dargestellt werden: **42×42
px**, abgerundet, weißer Hintergrund, dezenter Rahmen und gedämpftes Icon im
Ruhezustand. Beim **Hover/Fokus** SHALL ein Button in der **Primärfarbe (Orange)
gefüllt** werden mit **weißem** Icon; der **Lösch-Button** SHALL stattdessen in der
**Gefahren-Farbe (Rot)** gefüllt werden. Deaktivierte Buttons SHALL abgeschwächt
(reduzierte Deckkraft) und ohne Hover-Füllung dargestellt werden. Jeder Button
SHALL ein zugängliches Label (`title`/`aria-label`) behalten. Es werden keine
Text-Beschriftungen angezeigt (reine Icon-Buttons).

#### Scenario: Ruhezustand

- **WHEN** die Aktionsspalte einer Zeile angezeigt wird
- **THEN** erscheinen die Aktionen als 42×42-Icon-Buttons mit weißem Hintergrund,
  dezentem Rahmen und gedämpftem Icon (kein sichtbarer Text)

#### Scenario: Hover füllt in Primärfarbe

- **WHEN** der Mauszeiger über einem nicht-gefährlichen Aktions-Button liegt (oder er den Fokus hat)
- **THEN** ist der Button in Orange gefüllt und das Icon weiß

#### Scenario: Lösch-Button füllt in Rot

- **WHEN** der Mauszeiger über dem »Löschen«-Button liegt (oder er den Fokus hat)
- **THEN** ist der Button in Rot gefüllt und das Icon weiß

#### Scenario: Zugängliches Label bleibt erhalten

- **WHEN** eine Aktion als Icon-Button angezeigt wird
- **THEN** trägt sie ein `aria-label`/`title` mit der Aktionsbezeichnung

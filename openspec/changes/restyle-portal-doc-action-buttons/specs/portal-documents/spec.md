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

### Requirement: Breite und rechte Ausrichtung der Dokumente-Seite

Die Dokumente-Seite (`/admin/portal/documents`) SHALL die verfügbare Breite des
Inhaltsbereichs füllen (keine feste Maximalbreite auf Desktop) und ihre Blöcke
(Titel, Toolbar, Liste) horizontal an derselben Basis-Einrückung wie die
Portal-Navbar ausrichten. Der **rechte Abstand** von Toolbar/Liste zum Rand SHALL
demselben Wert entsprechen wie der rechte Abstand des Benutzer-Menüs in der Navbar.

#### Scenario: Tabelle nutzt die volle Breite

- **WHEN** die Dokumente-Seite auf einem breiten Viewport angezeigt wird
- **THEN** füllt die Liste die verfügbare Breite (kein großer leerer Bereich rechts)

#### Scenario: Rechter Rand entspricht der Navbar

- **WHEN** Toolbar/Liste und das Navbar-Benutzermenü angezeigt werden
- **THEN** liegt ihr rechter Rand auf derselben vertikalen Kante

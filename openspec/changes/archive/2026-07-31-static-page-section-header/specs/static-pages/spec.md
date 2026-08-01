## ADDED Requirements

### Requirement: Dreiteiliger Section-Header der STATIC-Seite

Der öffentliche STATIC-Renderer SHALL im Kopfbereich einer veröffentlichten
STATIC-Seite drei optionale/pflichtige Bestandteile im etablierten Section-Header-
Muster darstellen: einen optionalen **Eyebrow** (`section-tag`, klein/orange) über
dem Titel, den **Titel** (`section-title`) und einen optionalen **Untertitel**
(`section-subtitle`) darunter. Der Eyebrow SHALL aus dem Feld `metaData`, der Titel
aus `title` und der Untertitel aus `excerpt` gespeist werden.

#### Scenario: Vollständiger Header

- **WHEN** ein Nutzer eine veröffentlichte STATIC-Seite öffnet, bei der Eyebrow,
  Titel und Untertitel gesetzt sind
- **THEN** zeigt der Kopf den Eyebrow als `section-tag` über dem Titel, den Titel
  als `section-title` und den Untertitel als `section-subtitle`

#### Scenario: Eyebrow nur wenn gesetzt

- **WHEN** eine STATIC-Seite kein `metaData` (Eyebrow) gesetzt hat
- **THEN** wird kein `section-tag` gerendert; Titel (und ggf. Untertitel) bleiben
  unverändert

#### Scenario: Untertitel nur wenn gesetzt

- **WHEN** eine STATIC-Seite kein `excerpt` (Untertitel) gesetzt hat
- **THEN** wird kein `section-subtitle` gerendert

### Requirement: Eyebrow- und Untertitel-Pflege im Seiten-Editor

Der Seiten-Editor (`/admin/cms/seiten`) SHALL Felder zum Pflegen von **Eyebrow**
und **Untertitel** bereitstellen. Beide Felder SHALL optional sein, beim Speichern
und Veröffentlichen als `metaData` (Eyebrow) bzw. `excerpt` (Untertitel)
mitgesendet und beim Öffnen einer bestehenden Seite vorbefüllt werden.

#### Scenario: Eyebrow und Untertitel speichern

- **WHEN** eine Redakteurin im Seiten-Editor Eyebrow und Untertitel ausfüllt und
  speichert oder veröffentlicht
- **THEN** werden die Werte als `metaData` und `excerpt` der Seite persistiert

#### Scenario: Werte beim Bearbeiten vorbefüllt

- **WHEN** eine Redakteurin eine bestehende Seite mit gesetztem Eyebrow/Untertitel
  im Editor öffnet
- **THEN** sind die Eingabefelder mit den gespeicherten Werten vorbefüllt

### Requirement: Keine Backend-Änderung für den Header

Die Darstellung des Section-Headers SHALL ausschließlich bestehende Page-Felder
(`title`, `excerpt`, `metaData`) nutzen, die bereits über `/api/pages/{slug}`
ausgeliefert und über die Admin-Create/Update-API entgegengenommen werden. Es SHALL
keine neue Datenbankspalte und kein neuer API-Vertrag eingeführt werden.

#### Scenario: Bestehende Felder genügen

- **WHEN** der Header Eyebrow und Untertitel darstellt
- **THEN** stammen die Werte aus `metaData` bzw. `excerpt`, ohne dass ein neues
  Feld oder eine Migration nötig ist

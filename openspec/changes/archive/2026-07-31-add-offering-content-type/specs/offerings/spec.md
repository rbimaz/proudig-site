## ADDED Requirements

### Requirement: Offering als CMS-Content-Typ

Das CMS SHALL einen Content-Typ „Offering" (`PageCategory.OFFERING`) unterstützen,
der wie Blog/Seminar auf der `Page`-Entität basiert. Redaktion SHALL Offering-
Beiträge anlegen, bearbeiten, veröffentlichen und archivieren können, jeweils mit
Titel, Markdown-Inhalt, Excerpt, Cover-Bild und Tags.

#### Scenario: Offering-Beitrag anlegen

- **WHEN** eine Redakteurin in der Offering-Verwaltung „Neu" wählt
- **THEN** öffnet sich der Editor unter `/admin/cms/offerings/new` mit
  `category = OFFERING`

#### Scenario: Offering-Verwaltung listet Beiträge

- **WHEN** eine Redakteurin `/admin/cms/offerings` öffnet
- **THEN** werden vorhandene Offering-Beiträge (alle Status) in einer Liste
  angezeigt, mit Zugang zu Editor und Statusaktionen

### Requirement: Öffentliche Offering-API

Das Backend SHALL unter `/api/offerings` veröffentlichte Offerings bereitstellen:
eine paginierte Liste, einen Tag-Filter und einen Detailabruf per Slug. Nicht
veröffentlichte Offerings SHALL die öffentliche API NICHT ausliefern.

#### Scenario: Veröffentlichte Offerings auflisten

- **WHEN** ein Client `GET /api/offerings` aufruft
- **THEN** liefert die API eine Seite mit veröffentlichten Offering-Beiträgen

#### Scenario: Detail per Slug

- **WHEN** ein Client `GET /api/offerings/{slug}` eines veröffentlichten Offerings
  aufruft
- **THEN** liefert die API dessen Detaildaten (inkl. Markdown-Inhalt)

### Requirement: Exakter Tag-Filter

Der Tag-Filter der Offering-API SHALL nur Beiträge liefern, deren Tag-Liste den
angefragten Tag als **ganzen** Eintrag enthält (exakter Token-Vergleich), nicht
als Teilzeichenkette. Ein angefragter Tag „Beratung" SHALL daher keinen Beitrag
liefern, der nur „Strategieberatung" getaggt ist.

#### Scenario: Tag-Filter liefert nur exakte Treffer

- **WHEN** ein Client Offerings mit Tag „Beratung" anfragt
- **THEN** enthält die Antwort Beiträge mit Tag „Beratung", aber KEINE, die nur
  „Strategieberatung" (oder andere Teilzeichenketten) getaggt sind

### Requirement: Öffentliche Offering-Übersicht je Leistung

Die App SHALL unter `/offerings/:key` eine Übersichtsseite rendern, die
veröffentlichte Offerings des zur `:key` gehörenden Leistungs-Tags als Card-Grid
darstellt (gleiches Muster wie die News-Übersicht: Titel, Excerpt, Cover-Bild,
Tags, Link zur Detailseite). Gibt es keine Beiträge, SHALL ein Empty-State
angezeigt werden.

#### Scenario: Übersicht mit Beiträgen

- **WHEN** ein Nutzer `/offerings/consulting` öffnet und es veröffentlichte
  Offerings mit Tag „Beratung" gibt
- **THEN** werden diese als Card-Grid mit Links zu ihren Detailseiten angezeigt

#### Scenario: Übersicht ohne Beiträge

- **WHEN** ein Nutzer eine Offering-Übersicht öffnet, für deren Tag es keine
  veröffentlichten Beiträge gibt
- **THEN** wird ein Empty-State („noch keine Beiträge") statt eines leeren Grids
  angezeigt

### Requirement: Öffentliche Offering-Detailseite

Die App SHALL unter `/offerings/:key/:slug` die Detailseite eines Offerings
rendern und dessen Markdown-Inhalt über den gemeinsamen `MarkdownContent`-Renderer
darstellen (inkl. CTA-Buttons und interner Navigation).

#### Scenario: Detailseite rendert Markdown

- **WHEN** ein Nutzer `/offerings/consulting/{slug}` eines veröffentlichten
  Offerings öffnet
- **THEN** wird der Beitrag mit über `MarkdownContent` gerendertem Inhalt angezeigt

### Requirement: Klickbare Leistungs-Karten

Die Landing-Sektion „Unsere Leistungen" SHALL klickbare Karten haben. Fünf Karten
(Beratung, Studien, Vorträge, Software-Lösungen, KI-Anwendungen) SHALL zur
Offering-Übersicht ihres Leistungs-Tags führen (`/offerings/:key`); die Karte
Weiterbildung SHALL unverändert zur Seminar-Übersicht `/seminare` führen. Die
Kartentitel SHALL deutsch bleiben; die URL-Keys SHALL fest englisch sein.

#### Scenario: Klick auf „Beratung"

- **WHEN** ein Nutzer auf der Landing-Page die Karte „Beratung" anklickt
- **THEN** öffnet sich `/offerings/consulting` mit den Offerings, die mit
  „Beratung" getaggt sind

#### Scenario: Klick auf „Weiterbildung"

- **WHEN** ein Nutzer die Karte „Weiterbildung" anklickt
- **THEN** öffnet sich die bestehende Seminar-Übersicht `/seminare`

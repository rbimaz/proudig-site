# offerings Specification

## Purpose

Der CMS-Content-Typ „Offering" (Leistungen) erweitert das bestehende Page-basierte
CMS um redaktionell gepflegte Leistungsbeiträge. Er umfasst die Backend-API zur
Auslieferung veröffentlichter Offerings (Liste, exakter Tag-Filter, Detail per Slug),
die Admin-Verwaltung zum Anlegen, Bearbeiten, Veröffentlichen und Archivieren sowie
die öffentlichen Übersichts- und Detailseiten. Die klickbaren Leistungs-Karten der
Landing-Page öffnen tag-gefilterte Offering-Übersichten je Leistung.
## Requirements
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

Die Landing-Sektion „Unsere Leistungen" SHALL Karten haben, die **nur dann**
klickbar sind, wenn zur jeweiligen Leistung Inhalt vorhanden ist. Die fünf
Offering-Karten (Beratung, Studien, Vorträge, Software-Lösungen, KI-Anwendungen)
SHALL zur Offering-Übersicht ihres Leistungs-Tags (`/offerings/:key`) führen,
**wenn** es veröffentlichte Offerings mit diesem Tag gibt. Die Karte
Weiterbildung SHALL zur Seminar-Übersicht (`/seminare`) führen, **wenn**
veröffentlichte Seminare existieren.

Karten **ohne** vorhandenen Inhalt SHALL als nicht-interaktives Element
dargestellt werden: kein Link, keine Navigation und kein Klick-Affordance
(Cursor/Hover). Die Karte SHALL sichtbar bleiben (Titel/Beschreibung). Die
Kartentitel SHALL deutsch bleiben; die URL-Keys SHALL fest englisch sein.

#### Scenario: Klick auf Karte mit Inhalt

- **WHEN** ein Nutzer die Karte „Beratung" anklickt und es veröffentlichte
  Offerings mit Tag „Beratung" gibt
- **THEN** öffnet sich `/offerings/consulting` mit diesen Offerings

#### Scenario: Karte ohne Inhalt reagiert nicht

- **WHEN** ein Nutzer eine Leistungs-Karte anklickt, zu der es (noch) keinen
  veröffentlichten Inhalt gibt
- **THEN** erfolgt **keine** Navigation; es wird nicht zur leeren Übersicht
  geführt

#### Scenario: Weiterbildung inhaltsabhängig

- **WHEN** veröffentlichte Seminare existieren und die Karte „Weiterbildung"
  angeklickt wird
- **THEN** öffnet sich die Seminar-Übersicht `/seminare`; gibt es keine
  veröffentlichten Seminare, reagiert die Karte nicht

#### Scenario: Direktaufruf einer leeren Übersicht

- **WHEN** ein Nutzer eine Offering-Übersicht ohne Inhalt direkt per URL aufruft
- **THEN** wird weiterhin der Empty-State („Noch keine Beiträge …") angezeigt
  (Fallback bleibt erhalten)

### Requirement: CMS-gepflegter Kopfbereich der Offering-Übersicht

Die Offering-Übersicht (`/offerings/:key`) SHALL ihren Kopf-/Intro-Bereich aus
einer optionalen CMS-Index-Seite beziehen: einer veröffentlichten OFFERING-Seite,
deren Slug dem Offering-Key entspricht. Vorhanden, SHALL deren `title` als
Überschrift, `excerpt` als Untertitel und – falls gesetzt – `content` als
Markdown-Intro über dem Grid dargestellt werden (gerendert über den gemeinsamen
`MarkdownContent`-Renderer).

#### Scenario: Kopf aus Index-Seite

- **WHEN** ein Nutzer `/offerings/consulting` öffnet und eine veröffentlichte
  OFFERING-Seite mit Slug `consulting` existiert
- **THEN** zeigt der Kopfbereich deren Titel und Untertitel; ist ein Inhalt
  gepflegt, wird er als Markdown-Intro über dem Grid angezeigt

#### Scenario: Intro nur wenn Inhalt vorhanden

- **WHEN** die Index-Seite keinen `content` hat
- **THEN** wird kein Intro-Block gerendert (nur Titel/Untertitel)

### Requirement: Fallback ohne Index-Seite

Existiert keine veröffentlichte Index-Seite für den Key, SHALL die Übersicht den
bisherigen Kopf verwenden: den Titel aus der Offering-Config und den Eyebrow
„LEISTUNG". Das Grid-Verhalten (inkl. Empty-State) SHALL unverändert bleiben.

#### Scenario: Kein Index vorhanden

- **WHEN** ein Nutzer eine Offering-Übersicht öffnet, für deren Key es keine
  veröffentlichte Index-Seite gibt
- **THEN** zeigt der Kopf den Config-Titel und den Eyebrow „LEISTUNG" wie bisher

### Requirement: Index-Seite nicht im Grid

Das automatische Grid der Offering-Übersicht SHALL die Index-Seite (Slug = Key)
NICHT als Karte anzeigen, auch wenn sie mit dem Leistungs-Tag versehen ist.

#### Scenario: Index-Seite wird aus dem Grid ausgeschlossen

- **WHEN** die Index-Seite mit dem Leistungs-Tag getaggt ist und veröffentlicht
  wurde
- **THEN** erscheint sie nicht als Karte im Grid der zugehörigen Übersicht

### Requirement: Hintergrund des Intro-Blocks

Der Intro-Block der Offering-Übersicht (`.offering-intro`, gerendert wenn die
Index-Seite `content` hat) SHALL denselben Hintergrund wie die Hero-Sektion
(`news-hero`) verwenden, damit kein weißes Band zwischen Hero und Karten-Grid
entsteht.

#### Scenario: Intro nahtlos zwischen Hero und Grid

- **WHEN** eine Offering-Übersicht mit gepflegtem Intro-Inhalt angezeigt wird
- **THEN** hat der Intro-Block denselben Hintergrund wie Hero und Karten-Bereich
  (kein weißer Block dazwischen)


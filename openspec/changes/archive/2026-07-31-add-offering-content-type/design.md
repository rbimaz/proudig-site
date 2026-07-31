## Context

Blog/Seminar/News sind bereits dieselbe `Page`-Entität mit `category`-Enum. Die
Admin-Verwaltung ist weitgehend generisch: `BlogList` lädt `/api/admin/pages?
category=BLOG`, der Editor ist `PageEditor category="…"`, Anlegen/Ändern läuft über
den kategorie-generischen `AdminPageController`. Öffentliche Auslieferung erfolgt
pro Kategorie über schlanke Controller (`BlogController` usw.), die auf
`PageService` delegieren. Die Admin-Navigation ist ein Array in
`AdminLayout.jsx` (Z. 34–40).

Die Leistungs-Karten (`Expertise.jsx`) sind hartcodiert und nicht verlinkt. Tags
werden als komma-separierter String gespeichert; das Repository hat eine
`…TagsContaining`-Methode, die aber ein LIKE-Substring-Match ist (unscharf).

## Goals / Non-Goals

**Goals:**
- Neuer Content-Typ `OFFERING` mit minimalem Backend (Enum + Public-Controller),
  Wiederverwendung der generischen Admin-Plumbing.
- Klickbare Leistungs-Karten → tag-gefilterte Offering-Übersicht; Weiterbildung →
  `/seminare`.
- Exakter Tag-Filter (kein LIKE-Substring).

**Non-Goals:**
- Keine DB-/Liquibase-Migration (category ist `varchar`).
- Kein neues Tag-Eingabe-Konzept im Editor (Freitext-Tag bleibt; Redaktion tagt
  deutsch nach der kanonischen Vorgabe).
- Keine Änderung an `MarkdownContent` (nur Wiederverwendung).

## Decisions

**1. `OFFERING` in `PageCategory`; Admin-Plumbing wiederverwenden.**
`OfferingList` spiegelt `BlogList` (`/api/admin/pages?category=OFFERING`),
Editor `PageEditor category="OFFERING"`, Anlegen/Ändern über den bestehenden
generischen Controller. Neuer Nav-Eintrag „Leistungen" in `AdminLayout.jsx`.
Kein DB-Change nötig.

**2. Öffentlicher `OfferingController` (`/api/offerings`) spiegelt `BlogController`.**
Endpunkte: Liste published, `/{slug}` Detail, Tag-Filter. Detail über das
vorhandene `PageService.getBySlug`.

**3. Exakter Tag-Filter im Service statt LIKE-Repo-Methode.**
Neue `PageService`-Methode lädt veröffentlichte OFFERING-Beiträge und filtert
in-memory per `getTagsList().contains(tag)` (exakter ganzer Tag). Bewusst NICHT
die vorhandene `findByCategoryAndStatusAndTagsContaining` (LIKE) — die würde
„Beratung" auf „Strategieberatung" matchen. Bei kleinem Offering-Volumen ist der
In-Memory-Filter unkritisch (bei Wachstum später auf JPQL mit Token-Match
umstellen).

**4. Ein zentrales Offering-Config-Modul im Frontend.**
`src/config/offerings.js` exportiert die 5 tag-basierten Offerings als
`{ key, title, tag }` (z. B. `{ key:'consulting', title:'Beratung', tag:'Beratung' }`).
Sowohl `Expertise.jsx` (Karten-Links) als auch `OfferingOverviewPage`
(`:key` → `tag`-Lookup) importieren es — **eine** Quelle für das Mapping.
Weiterbildung ist ein Sonderfall (Karte → `/seminare`), nicht im Config.

**5. Routing kollisionsfrei.**
Übersicht `/offerings/:key` (liest `:key`, ermittelt Tag aus Config, fragt
`/api/offerings?tag=<tag>` ab). Detail `/offerings/:key/:slug` (lädt per Slug;
`:key` dient Breadcrumb/Kontext). Öffentliche Seiten spiegeln das News-Grid.

## Risks / Trade-offs

- [Unbekannter `:key` (nicht im Config)] → Übersicht zeigt Empty-State/Not-Found
  statt zu crashen.
- [Freitext-Tag: Tippfehler in der Redaktion verhindern Treffer] → Der kanonische
  Tag steht im Config; Redaktion muss exakt so taggen. Editor-Hilfe/Vorauswahl ist
  ein möglicher Folge-Change (out of scope).
- [In-Memory-Tag-Filter] → nur bei kleinem Volumen unkritisch; dokumentiert als
  spätere Optimierung.
- [Doppeltes Mapping Karte/Übersicht] → durch das gemeinsame Config-Modul
  vermieden.

## Open Questions

- Soll der Editor die kanonischen Offering-Tags zur Auswahl anbieten (statt
  Freitext), um Tippfehler auszuschließen? — Folge-Change, hier out of scope.

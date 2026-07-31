## Context

`OfferingOverviewPage` (`/offerings/:key`) rendert heute einen festen Kopf
(Eyebrow „LEISTUNG" + Titel aus `config/offerings.js`) und darunter ein Grid der
via `/api/offerings?tag=<tag>` geladenen, veröffentlichten OFFERING-Beiträge. Es
gibt `GET /api/offerings/{slug}` (liefert nur PUBLISHED). Der Detail-Renderer
nutzt bereits `MarkdownContent`. Kein Cover in v1.

## Goals / Non-Goals

**Goals:**
- Redaktion steuert Titel/Untertitel/Intro pro Leistung ohne Deploy.
- Automatisches Grid bleibt erhalten.
- Kein Backend-/DB-Change.

**Non-Goals:**
- Kein Cover/Hero-Bild im Kopf (v1).
- Keine Vollumstellung auf eine frei editierbare CMS-Seite (Grid bleibt automatisch).
- Keine neue API — bestehende `/api/offerings/{slug}` genügt.

## Decisions

**1. Index-Seite per Konvention Slug = Offering-Key.**
Der Kopf lädt `GET /api/offerings/{key}`. Existiert eine veröffentlichte OFFERING-
Seite mit diesem Slug, liefert sie den Kopf. So braucht es keine neue Verknüpfung
und keinen Backend-Change.
Alternative (eigenes Feld/Flag „istIndex", oder Settings-basiert) verworfen —
mehr Aufwand ohne Mehrwert.

**2. Felder-Mapping.**
`title` → h1, `excerpt` → Untertitel, `content` → optionaler Markdown-Intro über
dem Grid (via `MarkdownContent`). Fehlt `content`, kein Intro-Block.

**3. Fallback ohne Index-Seite.**
`GET /api/offerings/{key}` liefert 404/NoSuchElement, wenn keine veröffentlichte
Seite mit diesem Slug existiert. Dann bleibt der bisherige Kopf (Config-Titel +
Eyebrow „LEISTUNG"). Der 404 wird still behandelt (kein Fehlerzustand).

**4. Index-Seite aus dem Grid ausschließen.**
Das Grid filtert clientseitig `post.slug !== key` heraus. So taucht die Index-
Seite nie als eigene Karte auf, auch wenn sie den Leistungs-Tag trägt.

## Risks / Trade-offs

- [Zwei Fetches im Overview (Kopf + Grid)] → unkritisch; beide klein, laufen
  parallel. 404 des Kopf-Fetches ist ein erwarteter Normalfall (Fallback).
- [Index-Seite hat eine „tote" Detail-URL `/offerings/:key/:key`] → harmlos, wird
  nirgends verlinkt; die Index-Seite ist als Kopf gedacht, nicht als Kartenziel.
- [Redaktion muss die Slug-Konvention kennen] → als Hinweis dokumentieren
  (z. B. Editor-Hilfetext / Doku).

## Open Questions

- Später optional: Cover/Hero-Bild im Kopf und/oder ein Editor-Hilfetext, der die
  Slug-Konvention aktiv erklärt. Out of scope für v1.

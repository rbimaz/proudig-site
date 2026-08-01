## Context

Der Footer (`Footer.jsx`) enthielt „Über Proudig", Impressum und einen toten
Datenschutz-Anker. Die `site-navigation`-Capability spezifiziert bislang einen
Footer-Link „Über Proudig".

## Goals / Non-Goals

**Goals:** Footer-Links auf News, Blog, Datenschutz, Impressum umstellen.

**Non-Goals:** Keine Änderung an der Navbar (dort bleibt „Über Proudig"). Keine
Umstellung des Datenschutz-Links von `<a>` auf `<Link>` (separate Beobachtung).

## Decisions

- **Footer-Link „Über Proudig" entfernt**, da über die Navbar erreichbar; vermeidet
  Redundanz und schafft Platz für News/Blog.
- **Datenschutz auf reale Route `/datenschutz`** statt totem Anker.

## Risks / Trade-offs

- Der Datenschutz-Eintrag nutzt `<a href="/datenschutz">` → Full-Page-Reload statt
  Client-Navigation. Funktional korrekt; Konsistenz-Angleichung an `<Link>` bleibt
  als optionaler Folge-Change offen.

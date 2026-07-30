## Context

Der Kontakt ist heute nur die Sektion `<Contact />` (`id="kontakt"`) am Ende von
`HomePage.jsx`. `Contact.jsx` ist vollständig self-contained: eigener Formular-
State, Honeypot, Absenden an `/api/contact`, lokale Erfolgs-/Fehlerzustände,
`useFadeUp`-Animation. Es gibt keine Route `/kontakt` und kein Hash-Handling.

Layout: In `App.jsx` wird die Navbar **global** gerendert
(`{!hideNavbar && <Navbar theme={theme} />}`, Zeile 71) — für alle Nicht-Admin-/
Nicht-Share-Routen. `HomePage` rendert daher selbst KEINE Navbar, nur Sektionen
+ `<Footer />`. (Beobachtung am Rande: einzelne Content-Post-Seiten wie
`NewsPostPage` rendern zusätzlich eine eigene `<Navbar />` — eine bestehende
Inkonsistenz, die dieser Change bewusst NICHT anfasst.)

Der CTA-Button-Renderer (`MarkdownContent`) behandelt `/kontakt` bereits korrekt
als internen Router-Link — es fehlt nur das Ziel.

## Goals / Non-Goals

**Goals:**
- Route `/kontakt` mit eigenständiger Kontaktseite (globale Navbar + `Contact`
  + Footer).
- `Contact.jsx` unverändert wiederverwenden (keine Logik-Duplikation).
- Landing behält die Kontakt-Sektion; `MarkdownContent` bleibt unverändert.

**Non-Goals:**
- Kein Umbau der Navbar-Navigation (der `navigate('/')`+Scroll-Weg bleibt; die
  Umstellung auf `/kontakt` ist ein möglicher Folge-Change).
- Kein Hash-Deep-Linking (`/#kontakt`) — bewusst zugunsten der Route verworfen.
- Keine Behebung der bestehenden Doppel-Navbar-Beobachtung.
- Keine Backend-/DB-Änderung.

## Decisions

**1. `ContactPage` mirror't `HomePage` (globale Navbar, keine eigene).**
Neue Komponente `src/pages/ContactPage.jsx` rendert nur `<Contact />` +
`<Footer />`; die Navbar kommt aus `App.jsx`. So entsteht garantiert genau eine
Navbar und das Verhalten ist identisch zur Landing.
Alternative (eigene `<Navbar/>` in der Seite wie die Content-Post-Seiten)
verworfen — würde die Doppel-Navbar-Problematik reproduzieren.

**2. `Contact.jsx` bleibt unverändert und wird an zwei Stellen gemountet.**
Landing-Sektion und `/kontakt` nutzen dieselbe Komponente. Kein Prop-Umbau nötig,
da `Contact` keine Landing-spezifischen Props hat.
Alternative (Formular extrahieren/duplizieren) verworfen — unnötig, erhöht
Wartungslast.

**3. Route additiv in `App.jsx`.** `<Route path="/kontakt" element={<ContactPage />} />`
im öffentlichen Block. `hideNavbar` bleibt unberührt (Navbar soll sichtbar sein).
Seitenanfang oben: analog zu den Content-Seiten bei Bedarf `window.scrollTo(0,0)`
beim Mount, falls die Seite nicht oben startet.

## Risks / Trade-offs

- [Zwei Kontakt-Wege: Navbar scrollt auf `/` zur Sektion, CTA öffnet `/kontakt`]
  → Bewusst akzeptiert; gängiges Muster. Vereinheitlichung ist optionaler Folge-
  Change (Navbar aus Fremd-Routen → `/kontakt`).
- [Abstände/Optik: `Contact` ist als Mid-Page-Sektion gestylt, oben ggf. zu wenig
  Luft unter der Navbar] → In der Live-Verifikation prüfen; bei Bedarf minimaler
  Wrapper-Abstand, ohne `Contact.jsx` zu ändern.
- [Doppelte `useFadeUp`-Beobachter, wenn beide Mounts gleichzeitig existierten]
  → Kein Problem: Landing und `/kontakt` sind getrennte Routen, nie gleichzeitig
  gemountet.

## Open Questions

- Soll die Navbar mittelfristig aus Nicht-Landing-Routen direkt auf `/kontakt`
  zeigen (statt `navigate('/')`+Scroll)? — Folge-Change, hier out of scope.

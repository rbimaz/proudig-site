## 1. Kontaktseite

- [x] 1.1 `src/main/frontend/src/pages/ContactPage.jsx` anlegen: rendert `<Contact />` + `<Footer />` (keine eigene Navbar — globale Navbar aus `App.jsx` wird genutzt)
- [x] 1.2 Sicherstellen, dass die Seite oben startet (bei Bedarf `window.scrollTo(0, 0)` beim Mount)

## 2. Routing

- [x] 2.1 In `App.jsx` Route `<Route path="/kontakt" element={<ContactPage />} />` im öffentlichen Block ergänzen und `ContactPage` importieren
- [x] 2.2 Prüfen, dass `hideNavbar`/`isStaticPage`-Logik die Navbar auf `/kontakt` sichtbar lässt (keine Änderung nötig, nur verifizieren)

## 3. Tests

- [x] 3.1 Unit-Test: Route `/kontakt` rendert das Kontaktformular (z. B. auf ein Formularfeld/Überschrift prüfen) via `MemoryRouter` mit `initialEntries={['/kontakt']}`
- [x] 3.2 Unit-Test: CTA-Button `[Beratungsgespräch](/kontakt "button")` in `MarkdownContent` rendert einen internen Router-Link mit `href="/kontakt"` und Klasse `btn btn-cta` (Regression zur bestehenden Konvention)

## 4. Verifikation & Abschluss

- [x] 4.1 `npm run test:run` (volle Suite) grün, `npm run lint` ohne neue Errors, `npm run build` erfolgreich
- [x] 4.2 Live-Verifikation: aus `/news/kundenportal-launch` einen CTA-Button `[Beratungsgespräch](/kontakt "button")` klicken → Kontaktseite `/kontakt` öffnet sich mit genau einer Navbar, Formular und Footer (Screenshot)
- [x] 4.3 Autoren-Hinweis in den Editoren aktualisieren/bestätigen, dass `/kontakt` das empfohlene Ziel für den Kontakt-CTA ist

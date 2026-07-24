# Admin-Listen & Chrome nach Design-Handoff angleichen

## Warum
Der Design-Handoff („ProuDig CMS — News-Verwaltung", hifi) definiert das finale Aussehen der
Admin-Listen: aufgeräumte Tabellen-Karte, klare Status-Badges, Aktions-Buttons (neutral im
Ruhezustand, farbiger Solid-Fill bei Hover), ein Header-User-Menü (Avatar + Dropdown) und die
dunkle Sidebar. Das soll **einheitlich auf alle Admin-Listen/Übersichten** angewendet werden —
aktuell sind Optik, Status-Farben und Button-States uneinheitlich.

## Was
- **Farben:** Handoff-Rollen auf die bestehenden **Site-Tokens `--c-*`** mappen (kein neues
  Admin-Hex), Konsistenz zur öffentlichen Seite/DESIGN.md.
- **Chrome (`AdminLayout`, global):**
  - **Sidebar (Navbar):** dunkles Navy (`--c-primary`), aktives Nav-Item mit Akzentbalken + Akzenttext.
  - **Header-User-Menü:** Avatar (Initialen) + Name + Rolle inline (kein Button-Kasten), Klick öffnet
    Dropdown (Profil, Einstellungen, Abmelden); Schließen bei Außenklick/Escape; a11y-Attribute.
- **Listen (zentral über `admin.css`):** volle Content-Breite (rechtes = linkes Padding, bündige
  rechte Kante), Tabellen-Karte (Rahmen, Radius 16px, Schatten), Kopf-Labels, Status-Badges
  (Veröffentlicht = grün, Archiviert = grau, Entwurf = neutral), Aktions-Buttons neutral → Hover-
  Solid-Fill (normale Aktionen Akzent-Orange, Löschen Danger-Rot, weiße Schrift/Icon).
  Gilt für **seiten, blog, news, seminare, nachrichten** (Struktur/Spalten bleiben je Liste).
- **Media:** **Breite analog** zu den Tabellen anpassen (volle Content-Breite, bündige Kante) +
  Farben/Aktions-Button-States im Detail-Panel. Grid-Layout bleibt.

## Nicht-Ziele
- Kein Umbau der Tabellen von `<table>` auf CSS-Grid-Karten (bestehende Struktur bleibt).
- Keine funktionalen Änderungen an Listen/Aktionen (nur Optik + Header-Dropdown-Verhalten).
- Keine Backend-Änderung.

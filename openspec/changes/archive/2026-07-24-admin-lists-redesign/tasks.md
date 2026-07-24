## 1. Chrome (AdminLayout, global)

- [x] 1.1 Sidebar restylen: Navy `var(--c-primary)`, aktives Nav-Item mit Akzentbalken/-text, inaktive gedämpft (CSS)
- [x] 1.2 Header-User-Menü: `AdminLayout` — Avatar (Initialen) + Name + Rolle + Chevron; State `userMenuOpen`; Dropdown (Profil, Einstellungen, Abmelden)
- [x] 1.3 Verhalten: Toggle, Schließen bei Menüklick/Außenklick/Escape; ARIA (`aria-haspopup`, `aria-expanded`, `role=menu/menuitem`); Aktionen (Routen + `logout()`)
- [x] 1.4 CSS für Trigger + Dropdown (Avatar-Gradient, Kopf mit voller E-Mail, Einträge, Danger-Abmelden)

## 2. Listen (zentral, admin.css)

- [x] 2.1 Content-/Header-Padding angleichen → volle Tabellenbreite, rechts bündig
- [x] 2.2 `.admin-table` als Karte (Rahmen, Radius 16px, Schatten); Kopf-Labels; Titel/Slug-Stil
- [x] 2.3 `.status-badge`-Varianten (published grün, archived grau, draft neutral, hidden) auf Handoff-Werte
- [x] 2.4 `.actions .btn-sm` neutral → Hover-Solid-Fill (normal `--c-accent`, `.danger` `--c-danger`, weiße Schrift/Icon)

## 3. Media

- [x] 3.1 `.media-library` Breite/Padding an die übrigen Übersichten angleichen (bündige Kante)
- [x] 3.2 Media-Detail-Panel-Buttons bewusst belassen (Kontext Detail-Panel; nur Breite angepasst)

## 4. Verifikation

- [x] 4.1 Frontend Lint/Build grün
- [x] 4.2 `openspec validate admin-lists-redesign --strict` grün
- [x] 4.3 Visuelle Kontrolle (Liste + Header-Dropdown + Button-Hover + Media-Breite)

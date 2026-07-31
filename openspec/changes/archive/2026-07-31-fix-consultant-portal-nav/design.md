## Context

`AuthContext` stellt zwei Helfer bereit:
- `hasRole(role)` = `user.roles.includes(role)`
- `isAdmin()` = `hasRole('ADMIN') || hasRole('CONSULTANT')` — **irreführend benannt**;
  meint faktisch „Personal" (ADMIN oder CONSULTANT).

In `portal-consultant-documents` wurde `isAdmin()` an mehreren Stellen als
ADMIN-only-Gate genutzt. Da es für Consultants `true` liefert, greifen die
Guards nicht: Ein Consultant sieht das Admin-Dashboard (das ADMIN-only
`/api/portal/**` abruft → 403 → leere Statistik) und die Nav-Einträge
„Dashboard"/„Benutzer".

## Goals / Non-Goals

**Goals:**
- Consultant landet direkt bei „Meine Dokumente"; keine ADMIN-only Nav.
- Admin-Verhalten unverändert.

**Non-Goals:**
- Kein globales Umbenennen/Refactoring von `isAdmin()` (wird an anderen Stellen
  bewusst als „Personal"-Check genutzt, z. B. AdminHome-Karten). Nur die konkret
  fehlerhaften ADMIN-only-Gates werden korrigiert.
- Kein Backend-Change.

## Decisions

**1. Gezielt `isAdmin()` → `hasRole('ADMIN')` an den ADMIN-only-Gates.**
Betroffen: `PortalDashboard` (Redirect-Guard + Effekt-Guard), `PortalLayout`
(Nav „Dashboard" und „Benutzer"), `AdminHome.handlePortalClick`.
Alternative (isAdmin global umbenennen/aufteilen) verworfen — größerer Eingriff,
riskiert die „Personal"-Nutzungen anderswo. Minimal-invasiver Punkt-Fix bevorzugt.

**2. `isAdmin()` bleibt anderswo unangetastet.**
Die AdminHome-Karten (Content-Management, Nachrichten) nutzen `isAdmin()` bewusst
als „Personal"-Sichtbarkeit — das ist korrekt (Consultants dürfen ins CMS) und
bleibt.

## Risks / Trade-offs

- [Verwechslungsgefahr durch die Fehlbenennung `isAdmin()` bleibt bestehen] →
  akzeptiert für v1; ein sauberes Umbenennen (`isStaff` vs. `isAdmin`) wäre ein
  separater, größerer Aufräum-Change.
- [Test deckt nur den Redirect ab] → ergänzter `PortalDashboard`-Test prüft den
  Consultant-Redirect; die Nav-Sichtbarkeit ist gering-riskant (einfaches Gate).

## Open Questions

- Folge-Change möglich: `isAdmin()` in `isStaff()` umbenennen und echte
  `isAdmin()`-Semantik einführen, um künftige Verwechslungen zu vermeiden.

## Context

`users` wird von vielen Tabellen per FK referenziert, keine mit
`ON DELETE CASCADE`. `deleteUser` räumt nichts auf → FK-Verletzung. Die
referenzierenden Spalten teilen sich in zwei Klassen:

- **Session/Audit/Relation (unkritisch):** `refresh_tokens.user_id`,
  `activity_log.user_id`, `document_shares.shared_by|shared_with`,
  `content_blocks.updated_by` (nullable).
- **Eigentum (NOT NULL, wertvoll):** `folders.owner_id`,
  `documents.uploaded_by`, `media.uploaded_by`, `pages.author_id`.

## Goals / Non-Goals

**Goals:**
- Löschen funktioniert für Benutzer ohne eigene Inhalte, inkl. Aufräumen der
  abhängigen Daten.
- Kein Datenverlust bei Inhalten; klare Ablehnung, wenn Eigentum besteht.

**Non-Goals:**
- Kein Kaskaden-Löschen von Inhalten, kein Eigentums-Transfer, keine Migration.

## Decisions

- **Aufräumen in der Anwendung statt DB-`ON DELETE CASCADE`:** vermeidet eine
  Schema-Migration und hält die Logik sichtbar/testbar in `UserService`.
  Reihenfolge: erst Guard prüfen, dann abhängige Zeilen entfernen bzw. `NULL`
  setzen, dann `users`-Zeile löschen. Methode wird `@Transactional`, damit
  Bereinigung und Löschen atomar sind.
- **`content_blocks.updated_by` → NULL** statt löschen: der CMS-Inhalt bleibt,
  nur die Bearbeiter-Attribution entfällt (Spalte ist nullable).
- **Eigentum blockiert (Option C)** statt still zu löschen: `IllegalArgumentException`
  → HTTP 400 (bestehender `@ExceptionHandler` in `UserController`). Die Meldung
  benennt die Inhaltsarten. `user_roles` wird von Hibernate über das
  `@ManyToMany`-Mapping automatisch mitgelöscht.

## Risks / Trade-offs

- [Verwaiste Attribution in `content_blocks`] → akzeptiert; nullable und rein
  informativ.
- [Admin muss Inhalte vor dem Löschen selbst übertragen/entfernen] → bewusst, um
  versehentlichen Inhaltsverlust zu verhindern; Eigentums-Transfer ist ein
  separates Feature.

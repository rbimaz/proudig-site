## ADDED Requirements

### Requirement: „Im Hero anzeigen" ist Default für neue News, mit Speicher-Hinweis
Beim Anlegen einer neuen News SHALL „Im Hero anzeigen" (`showInHero`) standardmäßig aktiviert sein.
Beim Bearbeiten bestehender News SHALL der gespeicherte Wert unverändert übernommen werden. Wird
eine News mit aktivem „Im Hero anzeigen" gespeichert oder veröffentlicht, SHALL die Bestätigung
darauf hinweisen, dass sie im Hero angezeigt wird.

#### Scenario: Neue News hat Hero-Anzeige vorbelegt
- **WHEN** eine Redakteurin eine neue News anlegt
- **THEN** ist „Im Hero anzeigen" standardmäßig aktiviert

#### Scenario: Hinweis beim Speichern
- **WHEN** eine News mit aktivem „Im Hero anzeigen" gespeichert oder veröffentlicht wird
- **THEN** weist die Erfolgsmeldung darauf hin, dass die News im Hero angezeigt wird

#### Scenario: Bestehende News unverändert
- **WHEN** eine bestehende News bearbeitet wird
- **THEN** entspricht der Zustand von „Im Hero anzeigen" dem gespeicherten Wert (kein automatisches Aktivieren)

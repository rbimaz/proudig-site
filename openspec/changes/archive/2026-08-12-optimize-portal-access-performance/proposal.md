## Why

`PortalAccessService.effectivePermission` lädt pro Aufruf die Gruppen des Nutzers (`findByMembersContains`) und fragt je Vorfahren-Ordner die Freigaben ab (`findByFolder`). In einer Ordnerliste wird das je Ordner erneut ausgeführt — Aufwand **O(Ordner × Tiefe)** an DB-Queries plus Lazy-Loads der Vorfahrenkette. Das war im ursprünglichen Change bewusst als Trade-off zurückgestellt. Bei mehr Ordnern/Nutzern/Freigaben wird das spürbar.

## What Changes

- **Kontextbasierte Bewertung.** Ein je Anfrage einmal aufgebauter Zugriffs-Kontext lädt die Gruppen des Nutzers **einmal** und dessen Freigaben (direkt + über Gruppen) **einmal** in eine Map `Freigabe-Ordner-ID → Berechtigung`.
- **Keine Freigabe-Queries mehr im Vorfahren-Walk.** Die effektive Berechtigung wird gegen diese vorab geladene Map ausgewertet — der Ancestor-Walk stellt nur noch Ownership fest, ohne pro Ordner eine Freigabe-Abfrage.
- **`FolderService`-Listen bauen den Kontext einmal** und bewerten alle Ordner damit.
- **Verhalten bleibt identisch** — reine Performance-/Query-Optimierung, gleiche Berechtigungen wie die Einzelprüfung.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `portal-folder-sharing`: ergänzt eine nicht-funktionale Anforderung zur **effizienten, kontextbasierten Zugriffsbewertung** (konstante Anzahl Freigabe-/Gruppen-Queries je Anfrage, identische Ergebnisse). Bestehende Berechtigungs-Requirements bleiben unverändert.

## Impact

- **Backend (`de.proudig.site.service`):** `PortalAccessService` erhält einen `AccessContext` (Gruppen + Freigabe-Map, je Anfrage einmal); `effectivePermission(context, folder)` wertet gegen die Map aus. Die bestehenden Einzel-Methoden (`canRead`/`canWrite`/… für `DocumentService`) bauen intern einen Kontext (kleiner Overhead, unverändertes Ergebnis). `FolderService`-Listen (`getRootFolders`/`getSubFolders`, `mapToDto`) nutzen einen gemeinsamen Kontext.
- **Tests:** Verhaltens-Invarianz (Kontext-Ergebnis == Einzelprüfung) + Query-Count-Guard via Hibernate-Statistics; bestehende `PortalAccessServiceTest`-Matrix bleibt grün.
- **Kein** Schema-, API- oder Verhaltens-Change; keine Frontend-Änderung.
- **Optional/Folge:** rekursive CTE zum Laden der Vorfahrenkette (gegen Lazy-Load-N+1 bei tiefen Bäumen) — separat, falls Profiling es zeigt.

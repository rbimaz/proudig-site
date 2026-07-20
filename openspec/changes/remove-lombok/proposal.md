## Why

Das Projekt hängt an Lombok (Annotationen `@Data`, `@Builder`,
`@RequiredArgsConstructor`, `@NoArgsConstructor`/`@AllArgsConstructor`, `@Value`,
`@Slf4j` in 59 Dateien). Lombok soll aus dem Projekt entfernt werden, damit der
Code ohne Annotation-Processor auskommt (explizites, navigierbares Java; keine
Abhängigkeit von Lombok-JDK-Kompatibilität).

## What Changes

- **Delombok:** Alle Lombok-Annotationen werden per Lomboks `delombok` automatisch
  in echtes Java expandiert (Getter/Setter, Konstruktoren, Builder,
  equals/hashCode/toString, SLF4J-Logger). Ausgeführt mit JDK 21 und
  Lombok 1.18.38; Ausgabe ohne `@Generated`/`@lombok.Generated`-Reste.
- Nur die 59 Lombok-nutzenden Dateien werden ersetzt; Dateien ohne Lombok bleiben
  unverändert.
- **`pom.xml`:** Lombok wird entfernt — Dependency, `annotationProcessorPaths`
  des Compiler-Plugins und der `spring-boot-maven-plugin`-`exclude`.

## Non-Goals

- Keine Verhaltens-/API-Änderung; nur interne Code-Repräsentation.
- Keine manuelle Umformatierung der delombok-Ausgabe (maschineller Stil mit
  voll-qualifizierten Namen wird akzeptiert).

## Capabilities

### New Capabilities
- `build`: Bau-/Abhängigkeits-Konventionen; hier: Verzicht auf Lombok.

## Impact

- 59 Java-Dateien in `src/main/java` und `src/test/java` (Domain, DTOs, Services,
  Controller, Security). `pom.xml`. Kein Frontend-Bezug.
- Verifikation über bestehende Tests (`./mvnw -B verify`, inkl. Testcontainers-
  Kontexttest).

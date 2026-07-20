## Context

Lombok wird in 59 Dateien genutzt: `@Data` (28), `@RequiredArgsConstructor` (30),
`@NoArgsConstructor`/`@AllArgsConstructor` (je 27), `@Builder` (22), `@Value` (5),
`@Slf4j` (3). Besonders `@Builder` ist relevant, weil Aufrufstellen
`.builder()...build()` nutzen — diese müssen weiterhin funktionieren.

## Goals / Non-Goals

**Goals:** Lombok vollständig entfernen (Annotationen + Dependency), ohne
Verhaltensänderung; Aufrufstellen (Builder) bleiben unverändert.

**Non-Goals:** Handoptimierung der generierten Klassen; Umbenennungen; API-Wechsel.

## Decisions

- **delombok statt Handarbeit:** Lomboks `delombok` expandiert alle Annotationen
  automatisch und korrekt (inkl. Builder-Klassen), sodass Aufrufstellen gleich
  bleiben. Handschriftlich wären 22 Builder + 28 `@Data`-Klassen fehleranfällig.
- **Ausführung:** JDK 21 (`temurin-21.0.3`) + `lombok-1.18.38.jar` mit
  `--add-opens jdk.compiler/...` (nötig ab JDK 16). Flags
  `-f suppressWarnings:skip -f generated:skip -f generateDelombokComment:skip`
  → Ausgabe ohne `@SuppressWarnings`, ohne `@javax…Generated`, ohne
  Delombok-Kommentare. Kein `@lombok.Generated` (verifiziert).
- **Selektives Zurückkopieren:** Der ganze Quellbaum wird delomboked, aber nur die
  59 Lombok-Dateien werden zurückkopiert — Dateien ohne Lombok bleiben
  unverändert (minimaler, gezielter Diff).
- **`@Slf4j` → SLF4J:** delombok erzeugt
  `private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(...)`
  — genau der gewünschte handschriftliche SLF4J-Logger.
- **pom.xml:** Lombok-Dependency, Compiler-`annotationProcessorPaths`-Eintrag und
  `spring-boot-maven-plugin`-`exclude` entfernen.

## Risks / Trade-offs

- [Maschineller Codestil (voll-qualifizierte Namen, `canEqual`)] → akzeptiert
  (bewusste Entscheidung für delombok statt Handarbeit).
- [Delombok-Kompatibilität JDK/Lombok] → durch feste Kombination JDK 21 +
  Lombok 1.18.38 abgesichert; Ergebnis wird über `./mvnw -B verify` (inkl.
  Kontexttest) verifiziert.

# build Specification

## Purpose
TBD - created by archiving change remove-lombok. Update Purpose after archive.
## Requirements
### Requirement: Kein Lombok im Projekt
Das Projekt SHALL nicht von Lombok abhängen. Der Quellcode SHALL keine
Lombok-Annotationen oder -Importe enthalten, und `pom.xml` SHALL keine
Lombok-Dependency, keinen Lombok-`annotationProcessorPath` und keinen
Lombok-`exclude` im `spring-boot-maven-plugin` enthalten. Das Projekt SHALL sich
weiterhin bauen lassen und alle Tests bestehen.

#### Scenario: Keine Lombok-Referenzen im Code
- **WHEN** der Quellbaum durchsucht wird
- **THEN** finden sich keine `import lombok`-Zeilen und keine Lombok-Annotationen

#### Scenario: Build ohne Lombok grün
- **WHEN** `./mvnw -B verify` ausgeführt wird
- **THEN** kompiliert das Projekt ohne Lombok und alle Tests bestehen


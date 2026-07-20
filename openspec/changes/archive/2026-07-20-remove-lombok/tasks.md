## 1. Delombok

- [x] 1.1 Liste der 59 Lombok-Dateien ermitteln
- [x] 1.2 `src/main/java` und `src/test/java` mit JDK 21 + Lombok 1.18.38 delomboken (`--add-opens`, Flags ohne Generated/SuppressWarnings)
- [x] 1.3 Nur die 59 Lombok-Dateien aus der delombok-Ausgabe zurückkopieren

## 2. pom.xml

- [x] 2.1 Lombok-Dependency entfernen
- [x] 2.2 Lombok aus `annotationProcessorPaths` des `maven-compiler-plugin` entfernen
- [x] 2.3 Lombok-`exclude` aus `spring-boot-maven-plugin` entfernen

## 3. Verifikation

- [x] 3.1 Keine `import lombok`/Lombok-Annotationen mehr im Code; keine Lombok-Reste in `pom.xml`
- [x] 3.2 `./mvnw -B verify` grün (Kompilierung + Tests inkl. Testcontainers-Kontext)
- [x] 3.3 Frontend unberührt (kein Bezug)
- [x] 3.4 `openspec validate remove-lombok --strict` erfolgreich

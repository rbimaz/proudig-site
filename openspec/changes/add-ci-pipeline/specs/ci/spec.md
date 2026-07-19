## ADDED Requirements

### Requirement: CI-Pipeline für Pull Requests und main
Das Projekt SHALL eine GitHub-Actions-Pipeline bereitstellen, die bei jedem
Pull Request und bei jedem Push auf `main` ausgeführt wird. Die Pipeline SHALL
einen Backend- und einen Frontend-Job enthalten, die unabhängig laufen. Schlägt
ein Job fehl, SHALL der zugehörige Statuscheck fehlschlagen.

#### Scenario: Ausführung bei Pull Request
- **WHEN** ein Pull Request geöffnet oder aktualisiert wird
- **THEN** laufen der Backend- und der Frontend-Job und melden ihren Status zurück

#### Scenario: Ausführung bei Push auf main
- **WHEN** ein Commit auf `main` gepusht wird
- **THEN** laufen beide Jobs

#### Scenario: Fehlschlag blockiert den Check
- **WHEN** ein Build- oder Testschritt fehlschlägt
- **THEN** schlägt der zugehörige Job und damit der Statuscheck fehl

### Requirement: Backend-Build und -Tests
Der Backend-Job SHALL auf Temurin JDK 21 mit Maven-Abhängigkeits-Cache
`./mvnw -B verify` ausführen. Der Kontexttest (`@SpringBootTest`) SHALL seine
PostgreSQL-Datenbank per Testcontainers selbst bereitstellen (Image
`postgres:14-alpine`, wie in Produktion), sodass keine extern konfigurierte
Datenbank nötig ist. Der Frontend-Build wird dabei über das
`frontend-maven-plugin` mitausgeführt.

#### Scenario: verify läuft mit Testcontainers-Datenbank
- **WHEN** der Backend-Job startet
- **THEN** startet der Kontexttest eine PostgreSQL-Instanz via Testcontainers und `./mvnw -B verify` führt Kompilierung, Frontend-Build und Backend-Tests (inkl. Kontexttest) aus

#### Scenario: Fehlgeschlagener Test bricht den Job ab
- **WHEN** ein Backend-Test fehlschlägt
- **THEN** endet `verify` mit Fehler und der Backend-Job schlägt fehl

### Requirement: Frontend-Lint, -Tests und -Build
Der Frontend-Job SHALL im Verzeichnis `src/main/frontend` auf Node 20 mit
npm-Cache laufen und `npm ci`, ESLint (`npm run lint`), die Vitest-Tests im
Nicht-Watch-Modus (`npm run test:run`) sowie den Produktions-Build
(`npm run build`) ausführen.

#### Scenario: Lint prüft den Code
- **WHEN** der Frontend-Job `npm run lint` ausführt
- **THEN** wird ESLint über das Frontend ausgeführt und schlägt bei Regelverstößen fehl

#### Scenario: Tests laufen ohne Watch-Modus
- **WHEN** der Frontend-Job die Tests ausführt
- **THEN** werden die Vitest-Tests einmalig ausgeführt (kein Watch) und der Job terminiert

#### Scenario: Build erzeugt Artefakte
- **WHEN** der Frontend-Job den Build ausführt
- **THEN** wird das Frontend fehlerfrei nach `src/main/resources/static` gebaut

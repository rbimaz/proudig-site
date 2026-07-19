## Why

Das Projekt hat keine automatisierte CI: Backend- und Frontend-Tests laufen nur
lokal. Als Vorlage dient eine CI-Datei eines anderen Projekts (GitHub Actions,
zwei Jobs: `backend` via Maven, `frontend` via npm). Ziel ist eine an dieses
Projekt angepasste GitHub-Actions-Pipeline, die bei jedem Pull Request und bei
Push auf `main` Build und Tests beider Seiten ausführt.

## Referenz vs. dieses Projekt (wichtige Abweichungen)

Die Vorlage lässt sich **nicht 1:1 übernehmen**:

1. **Frontend-Pfad:** `src/main/frontend` (Vorlage: `frontend`). `working-directory`
   und `cache-dependency-path` müssen entsprechend angepasst werden.
2. **Frontend-Testscript:** `npm test` ist hier `vitest` im **Watch-Modus** und
   würde die CI blockieren. Für CI ist `npm run test:run` (`vitest run`) zu
   verwenden.
3. **Kein Lint:** Es existiert weder ein `lint`-Script noch eine ESLint-Config.
   Der `npm run lint`-Schritt der Vorlage entfällt bzw. erfordert eine
   Entscheidung (siehe unten).
4. **Backend-Kontexttest braucht eine Datenbank:** `ProudigSiteApplicationTests`
   ist `@SpringBootTest` und lädt den vollen Context; `application.properties`
   zeigt auf PostgreSQL (`localhost:5434`, `proudig/proudig123`, DB `proudigdb`),
   Liquibase-Kontext `dev`, `ddl-auto=validate`. Ohne laufende DB **schlägt
   `./mvnw verify` fehl**. Die Vorlage nutzt Testcontainers — dieses Projekt hat
   keine.
5. **Maven baut das Frontend mit:** `frontend-maven-plugin` (Node v20.11.1)
   installiert Node/npm und führt `npm run build` in der `generate-resources`-Phase
   aus. `./mvnw verify` baut das Frontend also bereits (nur Build, keine
   Frontend-Tests). Node-Version des Projekts = **20**.

## What Changes

- Neue Datei `.github/workflows/ci.yml` mit Trigger `pull_request` und
  `push` auf `main`, zwei parallele Jobs:
  - **backend:** `actions/setup-java` (Temurin 21, Maven-Cache); `./mvnw -B verify`.
    Der Kontexttest läuft gegen eine per **Testcontainers** hochgefahrene
    PostgreSQL-Instanz (Docker steht auf `ubuntu-latest` bereit).
  - **frontend:** `actions/setup-node` (Node 20, npm-Cache,
    `cache-dependency-path: src/main/frontend/package-lock.json`),
    `working-directory: src/main/frontend`; `npm ci` + `npm run lint` +
    `npm run test:run` + `npm run build`.
- **Backend (D1 = Testcontainers):** Test-Dependencies `spring-boot-testcontainers`,
  `org.testcontainers:postgresql`, `org.testcontainers:junit-jupiter` (alle
  `test`-Scope). `ProudigSiteApplicationTests` wird mit `@Testcontainers` und
  einem `@ServiceConnection`-`PostgreSQLContainer` (`postgres:14-alpine`, wie
  Prod) versehen, sodass der Context gegen die Container-DB statt `localhost:5434`
  startet.
- **Frontend (D2 = ESLint):** ESLint-9-Flat-Config (`eslint.config.js`) mit
  React-Hooks-/React-Refresh-Plugins, `lint`-Script in `package.json`, neue
  devDependencies.

## Resolved Decisions

- **D1 → Testcontainers** (statt Postgres-Service-Container oder H2): größte
  Prod-Nähe, Test ist self-contained, Docker in CI vorhanden.
- **D2 → ESLint einführen**: Lint-Schritt der Vorlage wird beibehalten.
- **D3 → Frontend-Build im Job behalten**.

## Non-Goals

- Kein Deployment/CD, keine Release-Automatisierung.
- Kein Coverage-Gate, keine Caches über GitHub-Actions-Standard hinaus.

## Capabilities

### New Capabilities
- `ci`: Automatisierte Build-/Test-Pipeline für Backend und Frontend via GitHub
  Actions.

## Impact

- Neue Datei: `.github/workflows/ci.yml`.
- Backend: `pom.xml` (3 Test-Dependencies), `ProudigSiteApplicationTests.java`
  (Testcontainers-Annotationen).
- Frontend: `eslint.config.js` (neu), `package.json` + `package-lock.json`
  (ESLint-devDeps + `lint`-Script).
- Bezug: `docker-compose.yml` (`postgres:14-alpine`), `application.properties`.

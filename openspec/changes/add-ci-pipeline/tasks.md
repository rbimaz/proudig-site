## 1. Backend: Testcontainers

- [x] 1.1 Test-Dependencies in `pom.xml`: `spring-boot-testcontainers`, `org.testcontainers:testcontainers-postgresql`, `org.testcontainers:testcontainers-junit-jupiter` (test-Scope, Versionen via Spring-Boot-BOM = Testcontainers 2.0.3)
- [x] 1.2 `ProudigSiteApplicationTests` mit `@Testcontainers` + `@Container @ServiceConnection PostgreSQLContainer` (`postgres:14-alpine`) versehen
- [x] 1.3 `./mvnw -B verify` lokal grün (Context-Test startet gegen Container-DB)

## 2. Frontend: ESLint

- [x] 2.1 devDependencies: `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`
- [x] 2.2 `eslint.config.js` (Flat Config) für React 19 / JSX; Ignores für `dist`, `node_modules`
- [x] 2.3 `lint`-Script (`eslint .`) in `package.json`
- [x] 2.4 `npm run lint` lokal grün (bestehende Verstöße minimal beheben oder Regeln gezielt anpassen)

## 3. Workflow

- [x] 3.1 `.github/workflows/ci.yml` mit `on: pull_request` und `push: branches: [main]`
- [x] 3.2 Job `backend`: `checkout` + `setup-java@v4` (Temurin 21, `cache: maven`) + `./mvnw -B verify`
- [x] 3.3 Job `frontend`: `setup-node@v4` (Node 20, npm-Cache, `cache-dependency-path: src/main/frontend/package-lock.json`), `working-directory: src/main/frontend`; `npm ci` → `npm run lint` → `npm run test:run` → `npm run build`

## 4. Verifikation

- [x] 4.1 `openspec validate add-ci-pipeline --strict` erfolgreich
- [x] 4.2 Frontend-Tests grün (`npm run test:run`), Lint grün, Build grün
- [x] 4.3 Backend `./mvnw -B verify` grün (mit Docker)

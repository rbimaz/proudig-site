# ---- Stage 1: Build ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Maven Wrapper + POM kopieren (Cache-Layer)
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Frontend + Backend Quellcode kopieren
COPY src src

# Vollständiger Build: Frontend (npm) + Backend (Maven) → JAR
RUN ./mvnw clean package -DskipTests -q

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/proudig-site-*.jar app.jar

EXPOSE 8081

ENV PREVIEW_PASSWORD=proudig2026

ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8081"]

# ---- Build stage: compile the Spring Boot jar ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Cache dependencies first (only re-runs when pom.xml changes).
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Compile and package (tests skipped here; run them in CI instead).
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---- Runtime stage: lightweight JRE image ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user.
RUN addgroup -S app && adduser -S app -G app

COPY --from=build /build/target/*.jar app.jar

# Avatar upload directory (mounted as a volume in docker-compose).
RUN mkdir -p /var/uploads/avatars && chown -R app:app /var/uploads
USER app

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

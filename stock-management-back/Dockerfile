# Build stage - Optimisé pour Raspberry Pi Zero 2 W
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Runtime stage - Optimisé pour ARM et ressources limitées
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copier le JAR depuis le stage build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port 8001
EXPOSE 8001

# Optimisations JVM pour Raspberry Pi Zero (512MB RAM)
# -Xmx256m : Limite la mémoire heap à 256MB
# -Xms128m : Démarre avec 128MB de heap
# -XX:+UseSerialGC : Utilise le GC série (moins gourmand)
# -XX:MaxRAMPercentage=50 : Limite à 50% de la RAM disponible
ENTRYPOINT ["java", \
    "-Dspring.profiles.active=prod", \
    "-Xmx256m", \
    "-Xms128m", \
    "-XX:+UseSerialGC", \
    "-XX:MaxRAMPercentage=50", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
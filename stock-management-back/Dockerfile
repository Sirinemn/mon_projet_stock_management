# Build stage - Support multi-architecture
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copier le pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et compiler
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage - Support multi-architecture
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN groupadd -r spring && useradd -r -g spring spring

# Copier le JAR depuis le stage build
COPY --from=build /app/target/*.jar app.jar

# Vérifier que le JAR existe et ses permissions
RUN ls -la app.jar && file app.jar

# Changer le propriétaire du JAR
RUN chown spring:spring app.jar

# Exposer le port 8001
EXPOSE 8001

# Changer vers l'utilisateur non-root
USER spring

# Configuration JVM optimisée pour Raspberry Pi Zero 2 W
# Augmentation légère de la mémoire et options de débogage
ENTRYPOINT ["java", \
    "-Dspring.profiles.active=prod", \
    "-Xmx384m", \
    "-Xms192m", \
    "-XX:+UseSerialGC", \
    "-XX:MaxRAMPercentage=60", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.jpa.show-sql=false", \
    "-Dlogging.level.org.springframework.web=INFO", \
    "-jar", "app.jar"]
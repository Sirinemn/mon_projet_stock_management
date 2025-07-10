# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : Image optimisée pour exécution
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Exposer le port 8001
EXPOSE 8001

# Démarrage de l'application avec le profil production
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]


FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . /app
RUN mvn -f park_management/pom.xml clean package -DskipTests

# Use OpenJDK to run the app
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/park_management/target/park_management-1.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
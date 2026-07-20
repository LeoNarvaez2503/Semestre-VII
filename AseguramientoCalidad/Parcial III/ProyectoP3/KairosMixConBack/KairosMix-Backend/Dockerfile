# Etapa 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copiar archivos del proyecto
COPY pom.xml .
COPY src ./src

# Compilar sin pruebas (tests requieren H2)
RUN mvn clean package -DskipTests=true

# Etapa 2: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar JAR desde la etapa de build
COPY --from=builder /app/target/kairosmix-backend-1.0.0.jar kairosmix-backend.jar

# Exposer puerto
EXPOSE 8080

# Variable de entorno para base de datos
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/kairosmix_db
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "kairosmix-backend.jar"]

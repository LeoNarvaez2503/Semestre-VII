# KairosMix Backend

Backend para la plataforma de gestión de órdenes y mezclas de frutos secos, desarrollado con **Spring Boot 3.2**, **Java 21** y arquitectura **Hexagonal (Ports & Adapters)**.

## 📋 Características

✅ **Arquitectura Limpia**: Separación clara de Domain, Application e Infrastructure layers  
✅ **Validación de Negocio**: Lógica de correctitud dentro de las entidades  
✅ **Gestión de Stock**: Control automático de inventario con transacciones ACID  
✅ **Máquina de Estados**: Transiciones validadas de órdenes  
✅ **Motor de Calidad**: Cálculo de puntajes basado en métricas de software  
✅ **Pruebas Unitarias**: Cobertura >85% con JUnit 5 y Mockito  
✅ **CI/CD**: Pipeline automatizado con GitHub Actions  
✅ **Docker**: Containerización lista para producción  

## 🏗️ Estructura del Proyecto

```
KairosMix-Backend/
├── src/main/java/com/kairosmix/
│   ├── domain/              # Capa de Dominio
│   │   ├── entities/        # Entidades de negocio puras
│   │   └── ports/output/    # Puertos de salida
│   ├── application/         # Capa de Aplicación
│   │   └── usecases/        # Casos de uso
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── persistence/     # Adaptadores de persistencia
│   │   ├── rest/            # Controladores y DTOs
│   │   └── mapper/          # Mapeo de DTOs
│   └── quality/             # Motor de calidad
├── src/test/java/           # Pruebas unitarias
├── pom.xml                  # Dependencias Maven
├── Dockerfile               # Imagen Docker
├── docker-compose.yml       # Orquestación de servicios
└── .github/workflows/       # GitHub Actions CI/CD
```

## 🛠️ Requisitos Previos

- **Java 21** (o superior)
- **Maven 3.9+**
- **MySQL 8.0+** (o H2 para desarrollo)
- **Docker** y **Docker Compose** (opcional)

## 🚀 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd KairosMix-Backend
```

### 2. Configurar Base de Datos

Crear base de datos MySQL:
```sql
CREATE DATABASE kairosmix_db;
CREATE USER 'kairosmix'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON kairosmix_db.* TO 'kairosmix'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar application.yml

Editar `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/kairosmix_db
    username: kairosmix
    password: password
```

### 4. Compilar y Ejecutar

```bash
# Compilar
mvn clean compile

# Ejecutar pruebas
mvn test

# Construir JAR
mvn clean package

# Ejecutar aplicación
java -jar target/kairosmix-backend-1.0.0.jar
```

La aplicación estará disponible en `http://localhost:8080/api`

## 🐳 Ejecución con Docker

### Opción 1: Docker Compose (Recomendado)

```bash
docker-compose up -d
```

Esto inicia:
- Base de datos MySQL
- Backend KairosMix en puerto 8080

### Opción 2: Construir imagen manual

```bash
docker build -t kairosmix-backend:latest .
docker run -p 8080:8080 kairosmix-backend:latest
```

## 📚 API REST Endpoints

### Productos
```
POST   /api/v1/products              # Crear producto
GET    /api/v1/products              # Listar productos
GET    /api/v1/products/{id}         # Obtener producto
PUT    /api/v1/products/{id}         # Actualizar producto
DELETE /api/v1/products/{id}         # Eliminar producto
```

### Clientes
```
POST   /api/v1/clients               # Crear cliente
GET    /api/v1/clients               # Listar clientes
GET    /api/v1/clients/{id}          # Obtener cliente
GET    /api/v1/clients/document/{id} # Buscar por documento
DELETE /api/v1/clients/{id}          # Eliminar cliente
```

### Órdenes
```
POST   /api/v1/orders                # Crear orden
GET    /api/v1/orders                # Listar órdenes
GET    /api/v1/orders/{id}           # Obtener orden
GET    /api/v1/orders/client/{id}    # Órdenes de cliente
GET    /api/v1/orders/status/{status}# Órdenes por estado
PATCH  /api/v1/orders/{id}/status    # Cambiar estado
DELETE /api/v1/orders/{id}           # Eliminar orden
```

### Mezclas Personalizadas
```
POST   /api/v1/custom-mixes          # Crear mezcla
GET    /api/v1/custom-mixes          # Listar mezclas
GET    /api/v1/custom-mixes/{id}     # Obtener mezcla
GET    /api/v1/custom-mixes/client/{id} # Mezclas de cliente
DELETE /api/v1/custom-mixes/{id}     # Eliminar mezcla
```

## 🧪 Pruebas

### Ejecutar Pruebas Unitarias

```bash
mvn test
```

### Ejecutar Pruebas con Cobertura

```bash
mvn clean test jacoco:report
# Reporte en: target/site/jacoco/index.html
```

### Verificar Cobertura (85% mínimo)

```bash
mvn jacoco:check
```

## 📊 Calidad del Código

### Motor de Calidad

El motor de calidad evalúa el software en 4 dimensiones:

| Dimensión | Peso | Descripción |
|-----------|------|-------------|
| **Correctitud** | 30% | Bugs, vulnerabilidades, pruebas fallidas |
| **Testabilidad** | 30% | Cobertura de código (mín. 85%) |
| **Mantenibilidad** | 20% | Code smells, complejidad ciclomática |
| **Integridad** | 20% | Validaciones, consistencia de datos |

### Ejemplo de Uso

```java
QualityMetrics metrics = new QualityMetrics();
metrics.setCodeCoverage(92.0);
metrics.setValidationCoverage(100.0);
metrics.setBugCount(2);

QualityScoringEngine engine = new QualityScoringEngine();
QualityScore score = engine.calculateQualityScore(metrics);

System.out.println(score.getSummary());
// Output: Grade A, Score 89.50
```

## 🔄 CI/CD Pipeline

El pipeline de GitHub Actions automatiza:

1. **Build & Test**: Compilación y pruebas unitarias
2. **Cobertura**: Validación de cobertura JaCoCo
3. **Análisis SonarQube**: Análisis estático de código
4. **Seguridad**: Escaneo de vulnerabilidades con Trivy
5. **Docker**: Construcción de imagen
6. **Pruebas de Integración**: Con base de datos real

Triggea automáticamente en:
- `push` a `main` o `develop`
- Pull requests

## 📦 Dependencias Principales

```xml
<!-- Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>

<!-- JUnit 5 + Mockito -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- JaCoCo (Code Coverage) -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
</plugin>
```

## 🎯 Estados de Orden

```
CLIENT_PENDING
    ↓
PENDING → PROCESSING → EN_ESPERA → COMPLETED
    ↓         ↓          ↓
    └─────────→ CANCELLED ←─────────┘
```

## 🔐 Validaciones de Negocio

### Productos
- ✓ Código único
- ✓ Stock no negativo
- ✓ Precios válidos (> 0)

### Clientes
- ✓ Documento único
- ✓ Email válido
- ✓ Datos requeridos

### Órdenes
- ✓ Stock suficiente
- ✓ Transiciones de estado válidas
- ✓ Total calculado correctamente

### Mezclas
- ✓ Nombre único
- ✓ Mínimo un componente
- ✓ Cálculo de información nutricional

## 🐛 Manejo de Errores

Respuesta de error estándar:
```json
{
  "status": 400,
  "message": "El stock insuficiente para este producto",
  "timestamp": "2024-05-13T10:30:00Z"
}
```

## 📝 Logs

Nivel de logging por defecto:
- `DEBUG`: com.kairosmix
- `INFO`: org.springframework
- `WARN`: org.hibernate

Configurar en `application.yml`:
```yaml
logging:
  level:
    com.kairosmix: DEBUG
    org.springframework: INFO
```

## 🤝 Contribuir

1. Crear rama: `git checkout -b feature/mi-feature`
2. Commit: `git commit -m "Add: descripción"`
3. Push: `git push origin feature/mi-feature`
4. Pull Request

### Estándares de Código
- ✓ Cobertura de pruebas > 85%
- ✓ Sin warnings de SonarQube
- ✓ Formatter Java IDE estándar
- ✓ Javadoc en métodos públicos

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Autores

Proyecto grupal - Aseguramiento de Calidad - Semestre VII

---

**Última actualización**: Mayo 2024

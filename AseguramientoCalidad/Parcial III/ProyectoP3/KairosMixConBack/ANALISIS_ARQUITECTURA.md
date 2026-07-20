# Análisis de Arquitectura - KairosMix

## 📋 Resumen Ejecutivo

El proyecto KairosMix está estructurado como una **arquitectura de tres capas (Layered Architecture) con patrón Hexagonal (Ports & Adapters)**:
- **Backend**: Spring Boot 3.2.0 con Java 17 - Arquitectura Limpia/Hexagonal
- **Frontend**: React 19 + Vite - Aplicación SPA modular

---

## 🔙 BACKEND (KairosMix-Backend)

### 1️⃣ Estructura de Carpetas - Arquitectura de Capas

```
src/main/java/com/kairosmix/
├── domain/                          (Capa de Dominio)
│   ├── entities/                   (Entidades del negocio)
│   │   ├── Client.java            ✅ Entidad: Cliente con validaciones
│   │   ├── Product.java           ✅ Entidad: Producto
│   │   ├── Order.java             ✅ Entidad: Orden
│   │   ├── OrderItem.java         ✅ Entidad: Artículo de Orden
│   │   ├── CustomMix.java         ✅ Entidad: Mezcla Personalizada
│   │   ├── MixComponent.java      ✅ Entidad: Componente de Mezcla
│   │   └── MixNutritionalInfo.java ✅ Entidad: Info Nutricional
│   └── ports/output/              (Puertos/Interfaces de persistencia)
│       ├── ClientRepositoryPort.java
│       ├── OrderRepositoryPort.java
│       ├── ProductRepositoryPort.java
│       └── CustomMixRepositoryPort.java
│
├── application/                     (Capa de Aplicación - Use Cases)
│   └── usecases/
│       ├── CreateClientUseCase.java        ✅ UC: Crear Cliente
│       ├── CreateProductUseCase.java       ✅ UC: Crear Producto
│       ├── CreateOrderUseCase.java         ✅ UC: Crear Orden
│       ├── CreateCustomMixUseCase.java     ✅ UC: Crear Mezcla Personalizada
│       ├── UpdateProductUseCase.java       ✅ UC: Actualizar Producto
│       └── UpdateOrderStatusUseCase.java   ✅ UC: Actualizar Estado de Orden
│
├── infrastructure/                  (Capa de Infraestructura)
│   ├── mapper/                     (MapStruct Mappers - DTO ↔ Entity)
│   │   ├── ClientMapper.java
│   │   ├── ProductMapper.java
│   │   ├── OrderMapper.java
│   │   └── CustomMixMapper.java
│   ├── persistence/                (Implementación de Repositorios)
│   │   ├── JpaClientRepository.java       (Interface Spring Data JPA)
│   │   ├── JpaProductRepository.java
│   │   ├── JpaOrderRepository.java
│   │   ├── JpaCustomMixRepository.java
│   │   ├── ClientRepositoryAdapter.java        (Adaptador Hexagonal)
│   │   ├── ProductRepositoryAdapter.java
│   │   ├── OrderRepositoryAdapter.java
│   │   └── CustomMixRepositoryAdapter.java
│   └── rest/                       (Controladores REST)
│       ├── controller/
│       │   ├── ClientController.java       @RestController("/v1/clients")
│       │   ├── ProductController.java      @RestController("/v1/products")
│       │   ├── OrderController.java        @RestController("/v1/orders")
│       │   ├── CustomMixController.java    @RestController("/v1/custom-mixes")
│       │   └── GlobalExceptionHandler.java (Manejo centralizado de errores)
│       └── dto/                    (Data Transfer Objects)
│           ├── ClientDTO.java
│           ├── ProductDTO.java
│           ├── OrderDTO.java
│           ├── OrderItemDTO.java
│           ├── CustomMixDTO.java
│           ├── MixComponentDTO.java
│           └── MixNutritionalInfoDTO.java
│
├── quality/                        (Módulo de Calidad del Software)
│   ├── QualityScoringEngine.java  ✅ Motor de puntuación
│   └── QualityMetrics.java        ✅ Métricas compiladas
│
└── KairosMixApplication.java       (Punto de entrada Spring Boot)
```

### 2️⃣ Clases Principales y Organización

#### **CAPA DE DOMINIO (Domain Layer)**

| Clase | Descripción | Validaciones |
|-------|-------------|--------------|
| `Client` | Entidad cliente | NotBlank, Email, Unique DocumentId |
| `Product` | Productos disponibles | NotBlank, NotNull, Min/Max |
| `Order` | Órdenes de compra | Validaciones de integridad |
| `OrderItem` | Items de cada orden | - |
| `CustomMix` | Mezclas personalizadas | - |
| `MixComponent` | Componentes de mezcla | - |
| `MixNutritionalInfo` | Información nutricional | - |

**Puertos (Interfaces)**:
- `ClientRepositoryPort` - save, findById, findByDocumentId, findAll, delete
- `OrderRepositoryPort` - save, findById, findAll, update
- `ProductRepositoryPort` - save, findById, findAll, update, delete
- `CustomMixRepositoryPort` - save, findById, findAll, delete

#### **CAPA DE APLICACIÓN (Application Layer - UseCases)**

| Use Case | Propósito |
|----------|-----------|
| `CreateClientUseCase` | Registrar nuevos clientes con validación de documento único |
| `CreateProductUseCase` | Crear productos disponibles |
| `CreateOrderUseCase` | Crear órdenes con validaciones |
| `CreateCustomMixUseCase` | Crear mezclas personalizadas |
| `UpdateProductUseCase` | Actualizar datos de productos |
| `UpdateOrderStatusUseCase` | Cambiar estado de órdenes |

**Patrón**: `@Service @Transactional` - Cada UseCase es un servicio Spring transaccional.

#### **CAPA DE INFRAESTRUCTURA (Infrastructure Layer)**

**Repositorios Persistencia**:
- `JpaClientRepository extends JpaRepository<Client, Long>`
- `JpaProductRepository extends JpaRepository<Product, Long>`
- `JpaOrderRepository extends JpaRepository<Order, Long>`
- `JpaCustomMixRepository extends JpaRepository<CustomMix, Long>`

**Adaptadores (Hexagonal Pattern)**:
- `ClientRepositoryAdapter` - Implementa ClientRepositoryPort
- `ProductRepositoryAdapter` - Implementa ProductRepositoryPort
- `OrderRepositoryAdapter` - Implementa OrderRepositoryPort
- `CustomMixRepositoryAdapter` - Implementa CustomMixRepositoryPort

**Controladores REST**:
```java
@RestController @RequestMapping("/v1/...") @CrossOrigin(origins = "*")
- ClientController    → /v1/clients    [POST, GET, DELETE]
- ProductController   → /v1/products   [POST, GET, PUT, DELETE]
- OrderController     → /v1/orders     [POST, GET, PUT]
- CustomMixController → /v1/custom-mixes [POST, GET, DELETE]
```

**DTOs** - Mapean entre controlador y dominio (DTO → Entity vía Mappers)

#### **MÓDULO DE CALIDAD**

- `QualityScoringEngine`: Motor que calcula puntuaciones de calidad
  - **Dimensiones**:
    - Correctness (Correctitud) - 30%
    - Testability (Testabilidad) - 30%
    - Maintainability (Mantenibilidad) - 20%
    - Integrity (Integridad) - 20%
  - Retorna `QualityScore` con puntaje final (0-100)

### 3️⃣ Dependencias (pom.xml)

#### **Dependencias Principales**

```xml
<!-- Spring Boot 3.2.0 -->
spring-boot-starter-web                3.2.0   ← REST API
spring-boot-starter-data-jpa           3.2.0   ← ORM/Persistencia
spring-boot-starter-validation         3.2.0   ← Validaciones

<!-- Bases de Datos -->
h2 (desarrollo)                                 ← BD en memoria
mysql-connector-java                   8.0.33  ← BD producción

<!-- Utilidades -->
lombok                                  1.18.30 ← Anotaciones para POJOs
mapstruct                               1.5.5   ← Mapeo DTO ↔ Entity

<!-- Testing -->
spring-boot-starter-test               (scope: test)
mockito-core                            (scope: test)

<!-- Plugins -->
jacoco-maven-plugin                     0.8.10  ← Code Coverage
```

### 4️⃣ Archivo de Configuración (application.yml)

```yaml
📄 Ubicación: src/main/resources/application.yml

Configuración:
├── Spring Application
│   └── name: kairosmix-backend
├── JPA/Hibernate
│   ├── ddl-auto: update           (Actualiza schema automáticamente)
│   ├── show-sql: false
│   ├── Dialect: MySQL8Dialect
│   └── Format SQL: true
├── Datasource
│   ├── URL: jdbc:mysql://localhost:3306/kairosmix_db
│   ├── Username: root
│   ├── Password: [vacío]
│   └── Driver: com.mysql.cj.jdbc.Driver
├── Profiles
│   └── active: dev
├── Servidor
│   ├── port: 8080
│   └── context-path: /api
└── Logging
    ├── com.kairosmix: DEBUG
    ├── org.springframework: INFO
    └── org.hibernate: WARN
```

### 5️⃣ Tests Unitarios ✅

**Ubicación**: `src/test/java/com/kairosmix/`

**Tests Implementados** (Total: 10 tests):

```
✅ CreateClientUseCaseTest.java             → Test creación de clientes
✅ CreateCustomMixUseCaseTest.java          → Test creación mezclas
✅ CreateOrderUseCaseTest.java              → Test creación órdenes
✅ CreateProductUseCaseTest.java            → Test creación productos
✅ UpdateOrderStatusUseCaseTest.java        → Test actualización estado
✅ UpdateProductUseCaseTest.java            → Test actualización productos
✅ ClientTest.java                          → Test entidad Client
✅ OrderTest.java                           → Test entidad Order
✅ ProductTest.java                         → Test entidad Product
✅ QualityScoringEngineTest.java           → Test motor de calidad
```

**Coverage**: JaCoCo configurado en pom.xml (`target/site/jacoco/`)

**Reports generados**: 
- `target/surefire-reports/` - Reportes de ejecución de tests XML

---

## 🎨 FRONTEND (KairosMix)

### 1️⃣ Estructura de Componentes y Páginas

```
src/
├── pages/                            (Páginas principales)
│   ├── ClientsPage.jsx              ✅ Gestión de clientes
│   ├── ProductsPage.jsx             ✅ Catálogo de productos
│   ├── OrdersPage.jsx               ✅ Gestión de órdenes
│   └── CustomMixPage.jsx            ✅ Diseñador de mezclas personalizadas
│
├── components/                       (Componentes reutilizables)
│   ├── Clients/
│   │   ├── ClientManager.jsx        → Gestor de clientes (CRUD)
│   │   └── ClientForm.jsx           → Formulario de cliente
│   ├── Products/
│   │   ├── ProductManager.jsx       → Gestor de productos (CRUD)
│   │   └── ProductForm.jsx          → Formulario de producto
│   ├── Orders/
│   │   ├── OrderManager.jsx         → Gestor de órdenes
│   │   ├── OrderForm.jsx            → Formulario de orden
│   │   ├── OrderDetails.jsx         → Detalles de orden
│   │   └── OrderReport.jsx          → Reporte de órdenes
│   ├── CustomMix/
│   │   ├── CustomMixDesigner.jsx    → Diseñador visual de mezclas
│   │   ├── NutritionalInfo.jsx      → Panel nutricional
│   │   └── SavedMixSelector.jsx     → Selector de mezclas guardadas
│   └── Layout/
│       ├── Layout.jsx               → Layout principal
│       └── Sidebar.jsx              → Barra lateral navegación
│
├── utils/
│   ├── api.js                       → Cliente HTTP API
│   └── sweetAlertConfig.js          → Configuración de alertas
│
├── data/
│   └── seedData.js                  → Datos iniciales
│
└── assets/                          → Recursos estáticos
```

### 2️⃣ Conexión al Backend (api.js)

**Ubicación**: [src/utils/api.js](src/utils/api.js)

```javascript
BASE_URL = 'http://localhost:8080/api/v1'

Endpoints mapeados:
├── Products
│   ├── GET  /products               → getProducts()
│   ├── POST /products               → createProduct(product)
│   ├── PUT  /products/{id}          → updateProduct(id, product)
│   └── DELETE /products/{id}        → deleteProduct(id)
├── Clients
│   ├── GET  /clients                → getClients()
│   ├── POST /clients                → createClient(client)
│   └── DELETE /clients/{id}         → deleteClient(id)
├── Orders
│   ├── GET  /orders                 → getOrders()
│   ├── POST /orders                 → createOrder(order)
│   └── PUT  /orders/{id}/status     → updateOrderStatus(id, status)
└── Custom Mixes
    ├── GET  /custom-mixes           → getCustomMixes()
    ├── POST /custom-mixes           → createCustomMix(mix)
    └── DELETE /custom-mixes/{id}    → deleteCustomMix(id)
```

**Características**:
- Manejo de errores básico
- Retorna `[]` si falla petición GET
- Retorna respuesta JSON en POST/PUT/DELETE
- Headers: `Content-Type: application/json`

### 3️⃣ Dependencias (package.json)

```json
{
  "name": "kairosmix",
  "version": "0.0.0",
  "type": "module",

  Dependencias de Producción:
  ├── react                   19.1.0        ← Framework UI
  ├── react-dom               19.1.0        ← Rendering DOM
  ├── react-router-dom        7.7.1         ← Enrutamiento SPA
  ├── sweetalert2              11.22.2       ← Alertas interactivas
  ├── lucide-react            0.525.0       ← Iconos SVG
  └── xlsx                     0.18.5        ← Exportar Excel

  Dependencias de Desarrollo:
  ├── vite                    7.0.4         ← Build tool
  ├── @vitejs/plugin-react    4.6.0         ← Plugin React
  ├── eslint                  9.30.1        ← Linter
  ├── eslint-plugin-react-hooks 5.2.0       ← Reglas React Hooks
  ├── eslint-plugin-react-refresh 0.4.20    ← Refresh HMR
  ├── gh-pages                6.3.0         ← Despliegue GitHub Pages
  └── @types/react            19.1.8        ← Tipos TypeScript

  Scripts:
  ├── dev     → vite           (Servidor desarrollo puerto 3000)
  ├── build   → vite build     (Build producción)
  ├── lint    → eslint .       (Validar código)
  ├── preview → vite preview   (Preview build)
  └── deploy  → gh-pages       (Desplegar a GitHub Pages)
}
```

### 4️⃣ Configuración Vite (vite.config.js)

```javascript
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: { output: { manualChunks: undefined } }
    },
    
    server: {
      port: 3000,
      open: true          // Abre navegador automáticamente
    },
    
    base:
      - En desarrollo: '/'
      - En producción: '/KairosMix/'
  }
})
```

**Características**:
- React plugin incluido
- Resolución de extensiones múltiples
- Base path dinámico (GitHub Pages compatibility)
- Servidor dev en puerto 3000

### 5️⃣ Componentes Principales

#### **CustomMixDesigner.jsx** (Core del negocio)

```javascript
State:
├── mixName              → Nombre de la mezcla
├── selectedComponents   → Productos seleccionados
├── selectedProduct      → Producto actual
├── quantity             → Cantidad
├── showNutritionalInfo  → Toggle panel nutricional
├── editingIndex         → Índice en edición
├── savedMixes           → Mezclas guardadas
└── isClientMode         → Modo cliente (localStorage)

Features:
✅ Agregar/eliminar componentes
✅ Editar cantidades
✅ Calcular información nutricional
✅ Guardar mezclas personalizadas
✅ Crear orden desde mezcla
✅ Validación de formularios
```

#### **ClientManager & ProductManager**

```javascript
Funcionalidades:
✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
✅ Integración con API backend
✅ Validación de formularios
✅ Alertas SweetAlert2
✅ Actualización de lista en tiempo real
```

#### **OrderManager**

```javascript
Funcionalidades:
✅ Crear órdenes
✅ Visualizar estado
✅ Actualizar estado
✅ Reporte de órdenes
✅ Detalles expandibles
```

### 6️⃣ Utilidades

**sweetAlertConfig.js**: 
- Configuración centralizada de alertas SweetAlert2
- Funciones: `createSwalDialog()`, etc.

**seedData.js**:
- Datos iniciales para desarrollo
- Productos, clientes de demostración

---

## 📊 Mapa de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (React)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages: ClientsPage, ProductsPage, OrdersPage, etc. │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Components: ClientManager, ProductManager, etc.     │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ utils/api.js → HTTP Requests (fetch)               │  │
│  │ BASE_URL: http://localhost:8080/api/v1             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ (HTTP REST)
┌─────────────────────────────────────────────────────────────┐
│               SERVIDOR (Spring Boot)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Infrastructure: Controllers (/v1/clients, etc.)     │  │
│  │ GlobalExceptionHandler (Manejo errores)             │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ DTOs ← → Mappers → Entities                         │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Application: UseCases (Business Logic)              │  │
│  │ Service @Transactional                              │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Domain: Entities, Ports (Interfaces)                │  │
│  │ Validaciones de negocio                             │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Infrastructure: Adapters, JPA Repositories          │  │
│  │ Port Implementation                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ MySQL Database                                       │  │
│  │ (kairosmix_db)                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Tabla Resumen de Rutas de Archivos

### Backend

| Ruta | Archivo | Propósito |
|------|---------|-----------|
| `src/main/java/com/kairosmix/` | `KairosMixApplication.java` | Punto de entrada Spring Boot |
| `src/main/java/com/kairosmix/domain/entities/` | `Client.java` | Entidad Cliente |
| `src/main/java/com/kairosmix/domain/entities/` | `Product.java` | Entidad Producto |
| `src/main/java/com/kairosmix/domain/entities/` | `Order.java` | Entidad Orden |
| `src/main/java/com/kairosmix/domain/entities/` | `CustomMix.java` | Entidad Mezcla Personalizada |
| `src/main/java/com/kairosmix/domain/ports/output/` | `ClientRepositoryPort.java` | Puerto/Interface Repositorio |
| `src/main/java/com/kairosmix/application/usecases/` | `CreateClientUseCase.java` | Use Case: Crear Cliente |
| `src/main/java/com/kairosmix/application/usecases/` | `CreateOrderUseCase.java` | Use Case: Crear Orden |
| `src/main/java/com/kairosmix/infrastructure/rest/controller/` | `ClientController.java` | Controlador REST Clientes |
| `src/main/java/com/kairosmix/infrastructure/rest/controller/` | `OrderController.java` | Controlador REST Órdenes |
| `src/main/java/com/kairosmix/infrastructure/rest/dto/` | `ClientDTO.java` | DTO Cliente |
| `src/main/java/com/kairosmix/infrastructure/persistence/` | `ClientRepositoryAdapter.java` | Adaptador Repositorio |
| `src/main/java/com/kairosmix/infrastructure/mapper/` | `ClientMapper.java` | Mapper DTO ↔ Entity |
| `src/main/resources/` | `application.yml` | Configuración Spring |
| `pom.xml` | - | Dependencias Maven |
| `src/test/java/com/kairosmix/` | `*Test.java` | Tests unitarios (10 tests) |

### Frontend

| Ruta | Archivo | Propósito |
|------|---------|-----------|
| `src/pages/` | `ClientsPage.jsx` | Página gestión de clientes |
| `src/pages/` | `ProductsPage.jsx` | Página catálogo productos |
| `src/pages/` | `OrdersPage.jsx` | Página gestión de órdenes |
| `src/pages/` | `CustomMixPage.jsx` | Página diseñador de mezclas |
| `src/components/Clients/` | `ClientManager.jsx` | Componente CRUD clientes |
| `src/components/Products/` | `ProductManager.jsx` | Componente CRUD productos |
| `src/components/Orders/` | `OrderManager.jsx` | Componente gestor órdenes |
| `src/components/CustomMix/` | `CustomMixDesigner.jsx` | Componente diseñador visual |
| `src/components/CustomMix/` | `NutritionalInfo.jsx` | Panel información nutricional |
| `src/components/Layout/` | `Layout.jsx` | Layout principal |
| `src/components/Layout/` | `Sidebar.jsx` | Barra lateral navegación |
| `src/utils/` | `api.js` | Cliente HTTP - Llamadas al backend |
| `src/utils/` | `sweetAlertConfig.js` | Configuración alertas |
| `package.json` | - | Dependencias npm |
| `vite.config.js` | - | Configuración Vite |

---

## ✅ Conclusión

### Backend (KairosMix-Backend)
- ✅ **Arquitectura Limpia/Hexagonal** bien implementada
- ✅ **Separación de capas**: Domain, Application, Infrastructure
- ✅ **10 tests unitarios** con JaCoCo coverage
- ✅ **6 Use Cases** principales implementados
- ✅ **ORM JPA** con Hibernate
- ✅ **Validaciones** en entidades
- ✅ **CORS enabled** (@CrossOrigin)
- ✅ **Manejo centralizado** de excepciones
- ✅ **Motor de Calidad** integrado

### Frontend (KairosMix)
- ✅ **Arquitectura modular** por dominio (Clients, Products, Orders, CustomMix)
- ✅ **React 19** con Vite (build rápido)
- ✅ **Componentes reutilizables**
- ✅ **Enrutamiento SPA** con React Router
- ✅ **Alertas profesionales** con SweetAlert2
- ✅ **Integración API REST** completa
- ✅ **Iconografía moderna** (lucide-react)
- ✅ **Exportación Excel** (xlsx)
- ✅ **Modo cliente/administrador** (localStorage)

### Comunicación
- ✅ REST API en `http://localhost:8080/api/v1`
- ✅ CORS configurado
- ✅ DTOs para transferencia de datos
- ✅ Manejo de errores bidireccional

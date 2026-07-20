# 📚 Referencia Rápida - Rutas de Archivos Clave

## 📖 Documentos de Análisis Generados

Estos documentos están en la raíz del proyecto:

1. **[ANALISIS_ARQUITECTURA.md](ANALISIS_ARQUITECTURA.md)** ← LEER PRIMERO
   - Estructura completa backend y frontend
   - Clases principales y organización
   - Dependencias y configuración
   - Tests unitarios

2. **[FLUJOS_DETALLADOS.md](FLUJOS_DETALLADOS.md)** ← Para entender flujos específicos
   - Flujos de datos paso a paso
   - Modelos de base de datos SQL
   - Mapeos de DTOs
   - Endpoints REST disponibles

---

## 🔙 BACKEND - Rutas Clave

### Punto de Entrada
```
KairosMix-Backend/src/main/java/com/kairosmix/
└─ KairosMixApplication.java
   @SpringBootApplication - Main class con main()
```

### Arquitectura de Capas

#### Domain Layer (Lógica de Negocio)
```
KairosMix-Backend/src/main/java/com/kairosmix/domain/

entities/                          ← Entidades JPA
├─ Client.java                     ✅ @Entity cliente con validaciones
├─ Product.java                    ✅ @Entity producto
├─ Order.java                      ✅ @Entity orden
├─ OrderItem.java                  ✅ @Entity item de orden
├─ CustomMix.java                  ✅ @Entity mezcla personalizada
├─ MixComponent.java               ✅ Componente de mezcla
└─ MixNutritionalInfo.java         ✅ Info nutricional

ports/output/                      ← Puertos (Interfaces)
├─ ClientRepositoryPort.java       Puerto para repositorio clientes
├─ OrderRepositoryPort.java        Puerto para repositorio órdenes
├─ ProductRepositoryPort.java      Puerto para repositorio productos
└─ CustomMixRepositoryPort.java    Puerto para repositorio mezclas
```

**Características**:
- Entidades con anotaciones JPA (@Entity, @Table, etc)
- Validaciones Bean Validation (@NotBlank, @Email, etc)
- Timestamps automáticos (@CreationTimestamp, @UpdateTimestamp)
- Lombok (@Getter, @Setter, @Builder, etc)

#### Application Layer (Use Cases)
```
KairosMix-Backend/src/main/java/com/kairosmix/application/

usecases/
├─ CreateClientUseCase.java        Service para crear cliente
├─ CreateProductUseCase.java       Service para crear producto
├─ CreateOrderUseCase.java         Service para crear orden
├─ CreateCustomMixUseCase.java     Service para crear mezcla
├─ UpdateProductUseCase.java       Service para actualizar producto
└─ UpdateOrderStatusUseCase.java   Service para actualizar orden
```

**Patrón**: `@Service @Transactional @RequiredArgsConstructor` (constructor injection)

#### Infrastructure Layer (Adaptadores y Controladores)
```
KairosMix-Backend/src/main/java/com/kairosmix/infrastructure/

mapper/                            ← Conversión DTO ↔ Entity (MapStruct)
├─ ClientMapper.java
├─ ProductMapper.java
├─ OrderMapper.java
└─ CustomMixMapper.java

persistence/                       ← Implementación Repositorios
├─ JpaClientRepository.java        (Spring Data JPA interface)
├─ JpaProductRepository.java
├─ JpaOrderRepository.java
├─ JpaCustomMixRepository.java
├─ ClientRepositoryAdapter.java    (Implementa ClientRepositoryPort)
├─ ProductRepositoryAdapter.java   (Implementa ProductRepositoryPort)
├─ OrderRepositoryAdapter.java     (Implementa OrderRepositoryPort)
└─ CustomMixRepositoryAdapter.java (Implementa CustomMixRepositoryPort)

rest/
├─ controller/                     ← REST Endpoints
│  ├─ ClientController.java        @RestController @RequestMapping("/v1/clients")
│  ├─ ProductController.java       @RestController @RequestMapping("/v1/products")
│  ├─ OrderController.java         @RestController @RequestMapping("/v1/orders")
│  ├─ CustomMixController.java     @RestController @RequestMapping("/v1/custom-mixes")
│  └─ GlobalExceptionHandler.java  @ControllerAdvice (manejo errores)
│
└─ dto/                           ← Data Transfer Objects
   ├─ ClientDTO.java
   ├─ ProductDTO.java
   ├─ OrderDTO.java
   ├─ OrderItemDTO.java
   ├─ CustomMixDTO.java
   ├─ MixComponentDTO.java
   └─ MixNutritionalInfoDTO.java
```

**Controladores**: `@RestController @CrossOrigin(origins = "*")`

#### Quality Module
```
KairosMix-Backend/src/main/java/com/kairosmix/quality/

├─ QualityScoringEngine.java       Calcula puntajes de calidad
│  └─ calculateQualityScore(QualityMetrics)
│     Returns: QualityScore (0-100)
│     Dimensiones: Correctness(30%), Testability(30%), 
│                   Maintainability(20%), Integrity(20%)
│
└─ QualityMetrics.java             Contenedor de métricas
```

### Configuración Backend

```
KairosMix-Backend/

pom.xml                           ← Dependencias Maven
└─ Spring Boot 3.2.0 parent
   ├─ spring-boot-starter-web (REST)
   ├─ spring-boot-starter-data-jpa (Persistencia)
   ├─ spring-boot-starter-validation (Bean Validation)
   ├─ h2 (desarrollo)
   ├─ mysql-connector-java (producción)
   ├─ lombok (1.18.30)
   ├─ mapstruct (1.5.5)
   ├─ spring-boot-starter-test (JUnit5)
   └─ mockito-core

src/main/resources/
└─ application.yml                ← Configuración Spring
   ├─ spring.jpa.hibernate.ddl-auto: update
   ├─ spring.datasource.url: jdbc:mysql://localhost:3306/kairosmix_db
   ├─ spring.datasource.username: root
   ├─ server.port: 8080
   ├─ server.servlet.context-path: /api
   └─ logging.level: DEBUG (kairosmix), INFO (spring)

Dockerfile                        ← Configuración Docker
docker-compose.yml                ← Orquestación contenedores
```

### Tests Backend

```
KairosMix-Backend/src/test/java/com/kairosmix/

Tests de Entidades:
├─ domain/entities/
│  ├─ ClientTest.java
│  ├─ OrderTest.java
│  └─ ProductTest.java

Tests de Use Cases:
├─ application/usecases/
│  ├─ CreateClientUseCaseTest.java
│  ├─ CreateOrderUseCaseTest.java
│  ├─ CreateProductUseCaseTest.java
│  ├─ CreateCustomMixUseCaseTest.java
│  ├─ UpdateProductUseCaseTest.java
│  └─ UpdateOrderStatusUseCaseTest.java

Tests de Calidad:
└─ quality/
   └─ QualityScoringEngineTest.java

Coverage Reports:
target/site/jacoco/               ← Reporte JaCoCo
target/surefire-reports/          ← Reportes XML de tests
```

---

## 🎨 FRONTEND - Rutas Clave

### Punto de Entrada
```
KairosMix/

index.html                        ← HTML principal
├─ <div id="root"></div>
└─ <script type="module" src="/src/main.jsx"></script>

src/main.jsx                      ← Entry point React
└─ ReactDOM.createRoot(root).render(<App />)

src/App.jsx                       ← Root component
```

### Estructura Componentes

```
KairosMix/src/

pages/                           ← Páginas principales (rutas)
├─ ClientsPage.jsx              Página gestión de clientes
├─ ProductsPage.jsx             Página catálogo de productos
├─ OrdersPage.jsx               Página gestión de órdenes
└─ CustomMixPage.jsx            Página diseñador de mezclas

components/                      ← Componentes reutilizables

Clients/
├─ ClientManager.jsx            ← Principal: Gestiona CRUD completo
│  ├─ State: { clients, loading, errors }
│  ├─ Funciones: CREATE, READ, UPDATE, DELETE
│  ├─ Integración: api.getClients(), api.createClient(), etc
│  └─ Renderiza: Tabla + ClientForm
│
└─ ClientForm.jsx               Formulario de cliente

Products/
├─ ProductManager.jsx           ← Principal: Gestiona CRUD
│  └─ Similar a ClientManager
│
└─ ProductForm.jsx              Formulario de producto

Orders/
├─ OrderManager.jsx             ← Principal: Gestiona órdenes
│  ├─ Tabla de órdenes
│  ├─ Cambio de estado
│  └─ Detalles expandibles
│
├─ OrderForm.jsx                Formulario de orden
├─ OrderDetails.jsx             Detalles de orden (expandible)
└─ OrderReport.jsx              Reporte de órdenes

CustomMix/
├─ CustomMixDesigner.jsx        ← Principal: Diseñador visual
│  ├─ State complejo:
│  │  ├─ mixName, selectedComponents, selectedProduct
│  │  ├─ quantity, showNutritionalInfo, editingIndex
│  │  ├─ savedMixes, errors, isClientMode
│  │  └─ JSON de mezcla completa
│  │
│  ├─ Funciones:
│  │  ├─ onAddComponent()
│  │  ├─ onEditComponent()
│  │  ├─ onRemoveComponent()
│  │  ├─ onSaveMix()
│  │  └─ onCreateOrder()
│  │
│  ├─ Integración API:
│  │  ├─ api.getCustomMixes()
│  │  ├─ api.createCustomMix()
│  │  └─ api.createOrder()
│  │
│  └─ Renderiza:
│     ├─ SavedMixSelector
│     ├─ NutritionalInfo
│     └─ Interfaz diseñador
│
├─ NutritionalInfo.jsx          Panel información nutricional
│  └─ Muestra: Calorías, Proteínas, Grasas, Carbohidratos
│
└─ SavedMixSelector.jsx          Selector de mezclas guardadas
   └─ Carga y lista mezclas previas

Layout/
├─ Layout.jsx                   Layout principal
├─ Sidebar.jsx                  Barra lateral con navegación
└─ Menú: Clients, Products, Orders, CustomMix
```

### Utilidades

```
KairosMix/src/utils/

api.js                          ← Cliente HTTP REST
├─ BASE_URL: 'http://localhost:8080/api/v1'
│
├─ PRODUCTS
│  ├─ getProducts()             → GET /products
│  ├─ createProduct(product)    → POST /products
│  ├─ updateProduct(id, product)→ PUT /products/{id}
│  └─ deleteProduct(id)         → DELETE /products/{id}
│
├─ CLIENTS
│  ├─ getClients()              → GET /clients
│  ├─ createClient(client)      → POST /clients
│  └─ deleteClient(id)          → DELETE /clients/{id}
│
├─ ORDERS
│  ├─ getOrders()               → GET /orders
│  ├─ createOrder(order)        → POST /orders
│  └─ updateOrderStatus(id, status) → PUT /orders/{id}/status
│
└─ CUSTOM MIXES
   ├─ getCustomMixes()          → GET /custom-mixes
   ├─ createCustomMix(mix)      → POST /custom-mixes
   └─ deleteCustomMix(id)       → DELETE /custom-mixes/{id}

sweetAlertConfig.js             ← Configuración SweetAlert2
└─ createSwalDialog()           Función helper para alertas
```

### Datos

```
KairosMix/src/data/

seedData.js                     ← Datos iniciales para desarrollo
└─ Clientes, productos, órdenes de ejemplo
```

### Estilos

```
KairosMix/src/

index.css                       Estilos globales
App.css                         Estilos del App principal
components/*/                  
└─ Cada componente con su .css
```

### Configuración Frontend

```
KairosMix/

package.json                   ← Dependencias npm
├─ react 19.1.0
├─ react-dom 19.1.0
├─ react-router-dom 7.7.1
├─ sweetalert2 11.22.2
├─ lucide-react 0.525.0
├─ xlsx 0.18.5
└─ Scripts: dev, build, lint, preview, deploy

vite.config.js                 ← Configuración Vite
├─ Plugins: @vitejs/plugin-react
├─ Port: 3000 (dev)
├─ Base: '/' (dev), '/KairosMix/' (prod)
└─ Output: dist/

eslint.config.js               ← Reglas de linting

public/                        ← Archivos estáticos
├─ _headers                    Headers para Netlify/Vercel
├─ 404.html                    Página 404 personalizada
└─ Favicon, etc

index.html                     ← Plantilla HTML
```

---

## 🔗 Flujos de Integración

### Request-Response Cycle

```
Frontend (React)
    │
    ├─ Component state change
    │ └─ useEffect hook triggered
    │
    ├─ api.js function called
    │ └─ fetch() HTTP request
    │
    ↓ HTTP (XMLHttpRequest)

Backend (Spring Boot)
    │
    ├─ @RestController mapping match
    │ └─ @GetMapping, @PostMapping, etc.
    │
    ├─ Input validation
    │ └─ @Valid, @PathVariable, @RequestBody
    │
    ├─ Mapper: DTO → Entity
    │
    ├─ Use Case execution
    │ └─ Business logic
    │
    ├─ Repository adapter
    │ └─ JPA save/update/delete
    │
    ├─ MySQL CRUD
    │
    ├─ Mapper: Entity → DTO
    │
    └─ ResponseEntity<DTO> returned

    ↓ HTTP (JSON response)

Frontend
    │
    ├─ Response intercepted
    │
    ├─ setState() called
    │
    ├─ Component re-renders
    │
    └─ UI updated (table, form, etc)
```

---

## 📊 Resumen Estadísticas

### Backend
- **Total archivos Java**: 44+
- **Clases principales**: 6 (entidades)
- **Use Cases**: 6
- **Controladores**: 4
- **DTOs**: 7
- **Repositorios**: 8 (4 interfaces + 4 adapters)
- **Tests**: 10
- **Dependencias maven**: 15+
- **Líneas de configuración**: 20+ (application.yml)

### Frontend
- **Total componentes**: 13+
- **Páginas**: 4
- **Funciones API**: 16+
- **Dependencias npm**: 7
- **Dev Dependencies**: 10
- **Líneas de configuración**: 25+ (vite.config.js)

---

## 🚀 Comandos Útiles

### Backend

```bash
# Compilar
mvn clean compile

# Tests con coverage
mvn clean test

# Build JAR
mvn clean package

# Ejecutar aplicación
java -jar target/kairosmix-backend-1.0.0.jar

# O con Spring Boot Maven plugin
mvn spring-boot:run

# Ver cobertura JaCoCo
# Archivo: target/site/jacoco/index.html
```

### Frontend

```bash
# Instalar dependencias
npm install

# Servidor desarrollo (puerto 3000)
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Linting
npm run lint

# Deploy a GitHub Pages
npm run deploy
```

---

## 🎯 Puntos de Entrada Recomendados

**Para entender la arquitectura**:
1. Leer [ANALISIS_ARQUITECTURA.md](ANALISIS_ARQUITECTURA.md)
2. Ver estructura backend: `src/main/java/com/kairosmix/`
3. Ver estructura frontend: `src/pages/` y `src/components/`

**Para entender flujos específicos**:
1. Leer [FLUJOS_DETALLADOS.md](FLUJOS_DETALLADOS.md)
2. Seguir un flujo: Frontend → api.js → Controller → UseCase → Repositorio → BD

**Para modificar/extender**:
1. Backend: Copiar patrón de un UseCase existente
2. Frontend: Copiar estructura de un Manager existente
3. BD: Usar EntityManager para nuevas tablas

---

## ✅ Checklist de Exploración

- [x] Estructura backend (3 capas: Domain, Application, Infrastructure)
- [x] Arquitectura Hexagonal (Ports & Adapters)
- [x] Clases principales identificadas (6 entidades, 6 use cases)
- [x] Dependencias Maven revisadas (Spring Boot 3.2.0)
- [x] Configuración application.yml
- [x] Tests unitarios encontrados (10 tests)
- [x] Estructura frontend (componentes por dominio)
- [x] Conexión API (api.js con BASE_URL correcta)
- [x] Dependencias npm revisadas
- [x] Configuración Vite
- [x] Flujos de datos mapeados
- [x] Modelos BD identificados

---

**Generado**: 13 de Mayo 2026
**Proyecto**: KairosMix - Sistema de gestión de órdenes y mezclas de frutos secos
**Versión Backend**: 1.0.0
**Versión Frontend**: 0.0.0

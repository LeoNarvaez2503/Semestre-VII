# Diagrama Detallado de Flujos - KairosMix

## 🔄 Flujo 1: Crear Cliente

```
FRONTEND (React)
    ↓
    ClientsPage.jsx
    ↓
    ClientManager.jsx (gestiona lista)
    ├─ ClientForm.jsx (recibe datos)
    │ └─ state: { documentId, name, email, phone, ... }
    │
    ↓
    api.js::createClient(clientData)
    │ └─ POST http://localhost:8080/api/v1/clients
    │    Headers: { 'Content-Type': 'application/json' }
    │    Body: ClientDTO
    ↓
BACKEND (Spring Boot)
    │
    ├─ ClientController::createClient(@RequestBody ClientDTO)
    │ └─ @PostMapping /v1/clients
    │    @CrossOrigin(origins = "*")
    │    HttpStatus: 201 CREATED
    │
    ├─ ClientMapper::dtoToEntity(ClientDTO)
    │ └─ Convierte DTO → Client entity
    │
    ├─ CreateClientUseCase::execute(Client)
    │ ├─ Valida cliente no nulo
    │ ├─ Busca documento duplicado
    │ │ └─ ClientRepositoryPort::findByDocumentId(documentId)
    │ ├─ Valida integridad datos
    │ └─ ClientRepositoryPort::save(Client)
    │
    ├─ ClientRepositoryAdapter (implementa Puerto)
    │ └─ JpaClientRepository::save(Client)
    │    └─ Spring Data JPA
    │
    └─ MySQL Database
       └─ INSERT INTO clients (...)
         VALUES (...)

RESPUESTA ← JSON: ClientDTO (con ID generado)
         ← HTTP 201 CREATED

FRONTEND ← Recibe respuesta
        ← Actualiza lista de clientes
        ← Muestra alerta de éxito (SweetAlert2)
```

---

## 🛒 Flujo 2: Crear Orden con Mezcla Personalizada

```
FRONTEND (React)
    │
    ├─ CustomMixPage.jsx
    │  └─ CustomMixDesigner.jsx
    │     ├─ Estado inicial:
    │     │  ├─ mixName: "Mix Premium"
    │     │  ├─ selectedComponents: [
    │     │  │    { productId: 1, quantity: 200 },
    │     │  │    { productId: 2, quantity: 150 }
    │     │  │  ]
    │     │  └─ showNutritionalInfo: true
    │     │
    │     └─ Eventos:
    │        ├─ onAddComponent() → Agrega producto
    │        ├─ onEditComponent() → Edita cantidad
    │        ├─ onRemoveComponent() → Elimina componente
    │        ├─ onSaveMix() → Guarda mezcla personalizada
    │        └─ onCreateOrder() → Crea orden
    │
    ├─ NutritionalInfo.jsx
    │  └─ Calcula y muestra:
    │     ├─ Calorías totales
    │     ├─ Proteínas
    │     ├─ Grasas
    │     └─ Carbohidratos
    │
    ├─ SavedMixSelector.jsx
    │  └─ Carga mezclas guardadas
    │     GET api.getCustomMixes()
    │
    ↓
    api.js::createCustomMix(mixData)
    ├─ POST http://localhost:8080/api/v1/custom-mixes
    │  Body: {
    │    name: "Mix Premium",
    │    components: [
    │      { productId: 1, quantity: 200 },
    │      { productId: 2, quantity: 150 }
    │    ],
    │    nutritionalInfo: { ... }
    │  }
    ↓
BACKEND
    │
    ├─ CustomMixController::createCustomMix(@RequestBody CustomMixDTO)
    │
    ├─ CustomMixMapper::dtoToEntity(CustomMixDTO)
    │  └─ CustomMixDTO → CustomMix entity
    │
    ├─ CreateCustomMixUseCase::execute(CustomMix)
    │  ├─ Valida que tenga componentes
    │  ├─ Cálculo nutricional automático
    │  └─ CustomMixRepositoryPort::save(CustomMix)
    │
    ├─ CustomMixRepositoryAdapter
    │  └─ JpaCustomMixRepository::save(CustomMix)
    │
    └─ MySQL
       └─ INSERT INTO custom_mixes
          INSERT INTO mix_components

    ↓ (Retorna CustomMixDTO)

LUEGO: Crear Orden con CustomMix
    │
    ├─ api.js::createOrder(orderData)
    │  POST http://localhost:8080/api/v1/orders
    │  Body: {
    │    clientId: 1,
    │    items: [
    │      { customMixId: 5, quantity: 1, price: 45.00 }
    │    ],
    │    totalAmount: 45.00,
    │    status: "PENDING"
    │  }
    │
    ├─ OrderController::createOrder(@RequestBody OrderDTO)
    │
    ├─ CreateOrderUseCase::execute(Order)
    │  ├─ Valida cliente existe
    │  ├─ Valida items válidos
    │  ├─ Calcula total
    │  └─ OrderRepositoryPort::save(Order)
    │
    ├─ OrderRepositoryAdapter
    │  └─ JpaOrderRepository::save(Order)
    │
    └─ MySQL
       └─ INSERT INTO orders
          INSERT INTO order_items

FRONTEND ← Respuesta: OrderDTO (con ID)
        ← Actualiza estado de órdenes
        ← Limpia formulario
        ← Alerta de éxito
```

---

## 📊 Flujo 3: Actualizar Producto

```
FRONTEND
    │
    ├─ ProductsPage.jsx
    │
    ├─ ProductManager.jsx
    │  ├─ GET: api.getProducts()
    │  │  ├─ Carga lista de productos
    │  │  └─ Muestra en tabla
    │  │
    │  └─ EDIT: Clic en "Editar"
    │     ├─ ProductForm.jsx abierto en modo edición
    │     ├─ Precarga datos actuales
    │     │  { id: 1, name: "Almendras", price: 15.50, ... }
    │     │
    │     └─ Cambios:
    │        ├─ name: "Almendras Premium"
    │        ├─ price: 18.75
    │        └─ Submit

    ↓
    api.js::updateProduct(productId, updatedData)
    │
    ├─ PUT http://localhost:8080/api/v1/products/1
    │  Headers: { 'Content-Type': 'application/json' }
    │  Body: ProductDTO { name, price, ... }

    ↓
BACKEND
    │
    ├─ ProductController::updateProduct(
    │    @PathVariable id,
    │    @RequestBody ProductDTO
    │  )
    │  └─ @PutMapping /v1/products/{id}
    │
    ├─ ProductMapper::dtoToEntity(ProductDTO)
    │
    ├─ UpdateProductUseCase::execute(id, Product)
    │  ├─ Valida producto existe
    │  ├─ Actualiza propiedades
    │  ├─ Validaciones de negocio
    │  └─ ProductRepositoryPort::save(Product)
    │
    ├─ ProductRepositoryAdapter
    │  └─ JpaProductRepository::save(Product)
    │
    └─ MySQL
       └─ UPDATE products
          SET name = 'Almendras Premium',
              price = 18.75,
              updatedAt = NOW()
          WHERE id = 1

RESPUESTA ← JSON: ProductDTO actualizado
         ← HTTP 200 OK

FRONTEND ← Recibe ProductDTO actualizado
        ← Refresca tabla con datos nuevos
        ← Alerta de éxito
        ← Cierra modal de edición
```

---

## 📈 Estructura de Datos - Modelos de Base de Datos

```sql
-- CLIENTES
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id VARCHAR(20) UNIQUE NOT NULL,
    document_type ENUM('CC', 'NIT', 'PASSPORT') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PRODUCTOS
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    unit_type VARCHAR(20), -- kg, gr, etc
    calories_per_unit DECIMAL(8,2),
    proteins_per_unit DECIMAL(8,2),
    fats_per_unit DECIMAL(8,2),
    carbs_per_unit DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- MEZCLAS PERSONALIZADAS
CREATE TABLE custom_mixes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_calories DECIMAL(10,2),
    total_proteins DECIMAL(10,2),
    total_fats DECIMAL(10,2),
    total_carbs DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMPONENTES DE MEZCLA
CREATE TABLE mix_components (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    custom_mix_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (custom_mix_id) REFERENCES custom_mixes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ÓRDENES
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    total_amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ITEMS DE ORDEN
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    custom_mix_id BIGINT,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (custom_mix_id) REFERENCES custom_mixes(id)
);

-- INFORMACIÓN NUTRICIONAL MEZCLAS
CREATE TABLE mix_nutritional_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    custom_mix_id BIGINT NOT NULL,
    total_calories DECIMAL(10,2),
    total_proteins DECIMAL(10,2),
    total_fats DECIMAL(10,2),
    total_carbs DECIMAL(10,2),
    FOREIGN KEY (custom_mix_id) REFERENCES custom_mixes(id) ON DELETE CASCADE
);
```

---

## 🔗 Mapeos de DTOs

### ClientDTO ↔ Client Entity

```java
// DTO (Transferencia)
ClientDTO {
    Long id;
    String documentId;
    DocumentType documentType;      // Enum
    String name;
    String email;
    String phone;
    String address;
    String city;
}

// Entity (Dominio)
Client {
    @Id Long id;
    @NotBlank String documentId;
    @Enumerated DocumentType documentType;
    @Size(3-100) String name;
    @Email String email;
    String phone;
    String address;
    String city;
    @CreationTimestamp LocalDateTime createdAt;
    @UpdateTimestamp LocalDateTime updatedAt;
}

// Mapper (MapStruct)
ClientMapper::dtoToEntity(ClientDTO) → Client
ClientMapper::entityToDto(Client) → ClientDTO
```

---

## 🌐 Endpoints REST Disponibles

### Productos

```
GET  /api/v1/products
├─ Descripción: Obtener todos los productos
├─ Respuesta: List<ProductDTO>
└─ Errores: 500 (si BD cae)

POST /api/v1/products
├─ Descripción: Crear nuevo producto
├─ Body: ProductDTO (sin ID)
├─ Respuesta: ProductDTO (con ID generado)
├─ Status: 201 CREATED
└─ Errores: 400 (validación), 500

PUT  /api/v1/products/{id}
├─ Descripción: Actualizar producto
├─ Body: ProductDTO
├─ Respuesta: ProductDTO actualizado
├─ Status: 200 OK
└─ Errores: 404 (no existe), 400

DELETE /api/v1/products/{id}
├─ Descripción: Eliminar producto
├─ Respuesta: void (204 NO CONTENT)
└─ Errores: 404
```

### Clientes

```
GET  /api/v1/clients
├─ Respuesta: List<ClientDTO>

POST /api/v1/clients
├─ Body: ClientDTO
├─ Respuesta: ClientDTO
├─ Status: 201 CREATED
├─ Validaciones:
│  ├─ documentId: NotBlank, Unique
│  └─ email: Valid email format

DELETE /api/v1/clients/{id}
└─ Status: 204 NO CONTENT
```

### Órdenes

```
GET  /api/v1/orders
├─ Respuesta: List<OrderDTO>

POST /api/v1/orders
├─ Body: OrderDTO
├─ Respuesta: OrderDTO (201 CREATED)
├─ Validaciones:
│  ├─ clientId: existe en BD
│  ├─ items: mínimo 1
│  └─ totalAmount: > 0

PUT  /api/v1/orders/{id}/status
├─ Body: { status: "SHIPPED" }
├─ Respuesta: OrderDTO
└─ Estados válidos: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
```

### Mezclas Personalizadas

```
GET  /api/v1/custom-mixes
├─ Respuesta: List<CustomMixDTO>

POST /api/v1/custom-mixes
├─ Body: CustomMixDTO
├─ Respuesta: CustomMixDTO (201 CREATED)
├─ Validaciones:
│  ├─ name: NotBlank
│  ├─ components: mínimo 1
│  └─ Cálculo nutricional automático

DELETE /api/v1/custom-mixes/{id}
└─ Status: 204 NO CONTENT
```

---

## 🏗️ Patrón Hexagonal - Detalles de Implementación

```
┌─ PUERTO (Interface/Contrato)
│  public interface ClientRepositoryPort {
│      Client save(Client client);
│      Optional<Client> findById(Long id);
│      Optional<Client> findByDocumentId(String documentId);
│      List<Client> findAll();
│      void delete(Client client);
│  }
│
├─ ADAPTADOR 1 (Implementación Persistencia)
│  public class ClientRepositoryAdapter 
│      implements ClientRepositoryPort {
│      
│      private final JpaClientRepository jpaRepo;
│      
│      @Override
│      public Client save(Client client) {
│          return jpaRepo.save(client);
│      }
│      // ... resto de métodos
│  }
│
├─ ADAPTADOR 2 (Spring Data JPA)
│  public interface JpaClientRepository 
│      extends JpaRepository<Client, Long> {
│      Optional<Client> findByDocumentId(String documentId);
│  }
│
└─ USE CASE (Lógica de Negocio)
   public class CreateClientUseCase {
       private final ClientRepositoryPort clientRepository;
       
       public Client execute(Client client) {
           // Validaciones de negocio
           clientRepository.findByDocumentId(client.getDocumentId())
               .ifPresent(c -> {
                   throw new IllegalArgumentException("Documento duplicado");
               });
           
           client.validateClientData();
           return clientRepository.save(client);
       }
   }
```

**Ventajas**:
✅ Independencia de frameworks (cambiar JPA es fácil)
✅ Testeable (mockear puertos)
✅ Inversión de dependencias (DI)
✅ Lógica de negocio aislada

---

## 🧪 Cobertura de Tests

```
Test Suite por Componente:

DOMAIN LAYER:
✅ ClientTest           → Validaciones entidad Client
✅ ProductTest          → Validaciones entidad Product
✅ OrderTest            → Validaciones entidad Order

APPLICATION LAYER:
✅ CreateClientUseCaseTest      → UC crear cliente
✅ CreateProductUseCaseTest     → UC crear producto
✅ CreateOrderUseCaseTest       → UC crear orden
✅ CreateCustomMixUseCaseTest   → UC crear mezcla
✅ UpdateProductUseCaseTest     → UC actualizar producto
✅ UpdateOrderStatusUseCaseTest → UC actualizar estado orden

QUALITY LAYER:
✅ QualityScoringEngineTest    → Motor de puntuación

Total: 10 tests unitarios
Coverage: Reportado por JaCoCo (target/site/jacoco/)
```

---

## 🎯 Flujos de Navegación Frontend

### Ruta: Admin/Gestión

```
Inicio
  ├─ /             → Dashboard (si existe)
  ├─ /clients      → ClientsPage
  │   └─ Componente: ClientManager
  │       ├─ Tabla de clientes
  │       ├─ Botón "Nuevo Cliente"
  │       │   └─ ClientForm (modal)
  │       └─ Acciones: Edit, Delete
  │
  ├─ /products     → ProductsPage
  │   └─ Componente: ProductManager
  │       ├─ Tabla de productos
  │       ├─ Botón "Nuevo Producto"
  │       │   └─ ProductForm
  │       └─ Acciones: Edit, Delete
  │
  ├─ /orders       → OrdersPage
  │   └─ Componente: OrderManager
  │       ├─ Tabla de órdenes
  │       ├─ Botón "Nueva Orden"
  │       │   └─ OrderForm
  │       ├─ OrderDetails (expandible)
  │       ├─ OrderReport
  │       └─ Cambiar estado
  │
  └─ /custom-mix   → CustomMixPage
      └─ Componente: CustomMixDesigner
          ├─ SavedMixSelector (lado izquierdo)
          ├─ Diseñador visual (lado derecho)
          │   ├─ Agregar componentes
          │   ├─ Editar cantidades
          │   └─ Botón "Crear Orden"
          └─ NutritionalInfo (panel)
```

---

## 📝 Resumen de Configuración

| Componente | Configuración | Valor |
|------------|---------------|-------|
| **Backend** | Java Version | 17 |
| | Spring Boot | 3.2.0 |
| | Port | 8080 |
| | Context Path | /api |
| | Database | MySQL (localhost:3306) |
| | DB Name | kairosmix_db |
| | JPA DDL | update (automático) |
| | Logging Level | DEBUG (kairosmix), INFO (Spring) |
| **Frontend** | Node Version | module (ES6) |
| | React | 19.1.0 |
| | Vite | 7.0.4 |
| | Port Dev | 3000 |
| | Base Path | / (dev), /KairosMix/ (prod) |
| | API Base URL | http://localhost:8080/api/v1 |
| | CORS | Habilitado (*) |
| | Build Output | dist/ |

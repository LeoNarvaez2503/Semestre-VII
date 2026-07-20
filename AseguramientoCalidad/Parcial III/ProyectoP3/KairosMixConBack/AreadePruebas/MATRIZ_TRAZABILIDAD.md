# 🗺️ Matriz de Rastreabilidad de Requisitos vs Casos de Prueba (SQA KairosMix)

**Proyecto:** KairosMix Quality Assurance  
**Versión:** 1.0.0  
**Fecha:** Julio 2026  

---

## 📌 Mapeo de Requisitos Funcionales vs Casos de Prueba

| ID Requisito | Descripción del Requisito | ID Caso de Prueba | Tipo de Prueba | Componente / Capa | Cobertura / Estado |
|---|---|---|---|---|---|
| **RF-01** | Gestión de Clientes (Creación, búsqueda por documento, validación duplicados) | `TC-CLI-01` | Unitaria | `ClientTest.java` / `ClientMapperTest.java` | PASSED |
| | | `TC-CLI-02` | Integración REST | `ClientControllerTest.java` | PASSED |
| | | `TC-CLI-03` | E2E / BDD Cypress | `cypress/e2e/clients.feature` | PASSED |
| **RF-02** | Gestión del Catálogo de Productos (Creación, actualización, control stock) | `TC-PROD-01` | Unitaria | `ProductTest.java` / `ProductMapperTest.java` | PASSED |
| | | `TC-PROD-02` | Integración REST | `ProductControllerTest.java` | PASSED |
| | | `TC-PROD-03` | E2E Cypress | `cypress/e2e/products.cy.js` | PASSED |
| **RF-03** | Diseñador de Mezclas Personalizadas y Cálculo Nutricional | `TC-MIX-01` | Unitaria | `CustomMixTest.java` / `MixComponentTest.java` | PASSED |
| | | `TC-MIX-02` | Integración REST | `CustomMixControllerTest.java` | PASSED |
| | | `TC-MIX-03` | E2E / BDD Cypress | `cypress/e2e/custom_mix.feature` | PASSED |
| **RF-04** | Procesamiento y Gestión del Ciclo de Vida de Órdenes | `TC-ORD-01` | Unitaria | `OrderTest.java` / `OrderItemTest.java` | PASSED |
| | | `TC-ORD-02` | Integración REST | `OrderControllerTest.java` | PASSED |
| | | `TC-ORD-03` | E2E Cypress | `cypress/e2e/orders.cy.js` | PASSED |
| **RF-05** | Reglas de Negocio e Integridad (Totales, Stocks, Validación de Cantidades) | `TC-BIZ-01` | Unitaria | `CreateOrderUseCaseTest.java` | PASSED |
| | | `TC-BIZ-02` | Unitaria | `UpdateProductUseCaseFailuresTest.java` | PASSED |
| **RF-06** | Manejo Centralizado de Excepciones y Respuestas de Error (400, 404, 409, 500) | `TC-ERR-01` | Integración | `GlobalExceptionHandlerTest.java` | PASSED |
| | | `TC-ERR-02` | E2E Cypress | `cypress/e2e/error_handling.cy.js` | PASSED |
| **RF-07** | Engine de Medición de Calidad SQA (`/api/v1/quality/score`) | `TC-QA-01` | Unitaria | `QualityScoringEngineTest.java` | PASSED |
| **RF-08** | Interfaz de Usuario, Componentes React y Navegación SPA | `TC-UI-01` | Unitaria Frontend | `Vitest` (`src/components/*.test.jsx`) | PASSED |
| | | `TC-UI-02` | E2E Cypress | `cypress/e2e/navigation.cy.js` | PASSED |

---

## 📈 Resumen de Cobertura por Nivel de Prueba

```
TOTAL REQUISITOS EVALUADOS: 8/8 (100%)
TOTAL CASOS DE PRUEBA DISEÑADOS: 17
  ├── Unitarias (Backend/Frontend): 10 Casos
  ├── Integración REST (Spring Boot MockMvc): 4 Casos
  └── End-to-End / BDD (Cypress + Cucumber): 3 Suites / Features
ESTADO GLOBAL: 100% de Trazabilidad Verificada
```

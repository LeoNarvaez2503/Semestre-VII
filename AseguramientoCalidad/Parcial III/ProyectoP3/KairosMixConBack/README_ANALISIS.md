# 📑 ÍNDICE DE ANÁLISIS - KairosMix

## 📚 Documentos Disponibles

> **Nota**: Todos los documentos están en la raíz del proyecto para acceso rápido.

### 1. 🎯 [REFERENCIA_RAPIDA.md](REFERENCIA_RAPIDA.md) - **EMPEZAR AQUÍ**
   - **Propósito**: Referencia rápida con índices de archivos
   - **Contenido**:
     - Rutas clave del backend y frontend
     - Lista de archivos principales
     - Comandos útiles
     - Puntos de entrada recomendados
     - Checklist de exploración
   - **Tiempo de lectura**: 10-15 min
   - **Para**: Orientación general del proyecto

### 2. 📊 [ANALISIS_ARQUITECTURA.md](ANALISIS_ARQUITECTURA.md) - **LECTURA PRINCIPAL**
   - **Propósito**: Análisis completo de arquitectura
   - **Contenido**:
     - ✅ Estructura de carpetas backend (arquitectura de capas)
     - ✅ Clases principales organizadas por capa
     - ✅ Dependencias Maven (pom.xml)
     - ✅ Configuración application.yml
     - ✅ Tests unitarios (10 tests)
     - ✅ Estructura de componentes frontend
     - ✅ Configuración package.json
     - ✅ Configuración vite.config.js
     - ✅ Mapa de flujo de datos
     - ✅ Tabla resumen de rutas
     - ✅ Conclusiones
   - **Tiempo de lectura**: 30-40 min
   - **Para**: Entender la arquitectura completa

### 3. 🔄 [FLUJOS_DETALLADOS.md](FLUJOS_DETALLADOS.md) - **LECTURA TÉCNICA**
   - **Propósito**: Flujos específicos y detalles técnicos
   - **Contenido**:
     - 🔄 Flujo 1: Crear Cliente (paso a paso)
     - 🛒 Flujo 2: Crear Orden con Mezcla Personalizada
     - 📈 Flujo 3: Actualizar Producto
     - 📊 Estructura de datos (SQL)
     - 🔗 Mapeos de DTOs detallados
     - 🌐 Endpoints REST disponibles
     - 🏗️ Patrón Hexagonal (detalles implementación)
     - 🧪 Cobertura de tests
     - 🎯 Flujos de navegación frontend
     - 📝 Resumen de configuración
   - **Tiempo de lectura**: 30-40 min
   - **Para**: Entender flujos específicos y endpoints

---

## 🏗️ Estructura del Análisis

```
KairosMix-Backend/
├── src/main/java/com/kairosmix/
│   ├── domain/              → Capa de Dominio (Lógica de negocio)
│   ├── application/         → Capa de Aplicación (Use Cases)
│   ├── infrastructure/      → Capa de Infraestructura (Adaptadores)
│   └── quality/            → Módulo de Calidad
├── src/test/java/          → 10 Tests Unitarios
├── src/main/resources/
│   └── application.yml      → Configuración Spring
└── pom.xml                 → Dependencias Maven

KairosMix/
├── src/pages/              → 4 Páginas principales
├── src/components/         → 13+ Componentes reutilizables
│   ├── Clients/
│   ├── Products/
│   ├── Orders/
│   ├── CustomMix/
│   └── Layout/
├── src/utils/              → api.js (cliente HTTP)
├── package.json            → Dependencias npm
└── vite.config.js         → Configuración Vite
```

---

## 🎓 Guía de Lectura Recomendada

### Para Principiantes (Nuevo en el Proyecto)
```
1. REFERENCIA_RAPIDA.md
   ↓ (10 min)
2. ANALISIS_ARQUITECTURA.md - Lee hasta "Mapa de Flujo de Datos"
   ↓ (20 min)
3. FLUJOS_DETALLADOS.md - "Flujo 1: Crear Cliente"
   ↓ (10 min)
Total: ~40 min para entender el proyecto
```

### Para Desarrolladores (Modificar/Extender)
```
1. REFERENCIA_RAPIDA.md - Secciones "Rutas Clave"
   ↓ (15 min)
2. ANALISIS_ARQUITECTURA.md - Completo
   ↓ (35 min)
3. FLUJOS_DETALLADOS.md - Completo
   ↓ (35 min)
4. Revisar código: 
   - Backend: src/main/java/com/kairosmix/application/usecases/CreateClientUseCase.java
   - Frontend: src/components/Clients/ClientManager.jsx
   ↓ (20 min)
Total: ~2 horas para dominar el proyecto
```

### Para Code Review/QA
```
1. ANALISIS_ARQUITECTURA.md - Secciones "Tests Unitarios"
   ↓ (10 min)
2. FLUJOS_DETALLADOS.md - "Endpoints REST Disponibles"
   ↓ (15 min)
3. Revisar test files:
   - src/test/java/com/kairosmix/*Test.java
   ↓ (20 min)
Total: ~45 min para validar calidad
```

---

## 📍 Ubicación de Secciones Clave

### Backend - Archivos Principales

| Sección | Archivo | Documento |
|---------|---------|-----------|
| Punto entrada | `KairosMixApplication.java` | [REFERENCIA_RAPIDA.md#punto-de-entrada](REFERENCIA_RAPIDA.md) |
| Entidades | `src/main/java/com/kairosmix/domain/entities/` | [ANALISIS_ARQUITECTURA.md#capa-de-dominio](ANALISIS_ARQUITECTURA.md) |
| Use Cases | `src/main/java/com/kairosmix/application/usecases/` | [ANALISIS_ARQUITECTURA.md#capa-de-aplicación](ANALISIS_ARQUITECTURA.md) |
| Controladores | `src/main/java/com/kairosmix/infrastructure/rest/controller/` | [ANALISIS_ARQUITECTURA.md#capa-de-infraestructura](ANALISIS_ARQUITECTURA.md) |
| Configuración | `src/main/resources/application.yml` | [ANALISIS_ARQUITECTURA.md#archivo-de-configuración](ANALISIS_ARQUITECTURA.md) |
| Tests | `src/test/java/com/kairosmix/` | [ANALISIS_ARQUITECTURA.md#tests-unitarios](ANALISIS_ARQUITECTURA.md) |
| Endpoints | `/api/v1/*` | [FLUJOS_DETALLADOS.md#-endpoints-rest-disponibles](FLUJOS_DETALLADOS.md) |
| Base Datos | MySQL - kairosmix_db | [FLUJOS_DETALLADOS.md#-estructura-de-datos---modelos-de-base-de-datos](FLUJOS_DETALLADOS.md) |

### Frontend - Archivos Principales

| Sección | Archivo | Documento |
|---------|---------|-----------|
| Punto entrada | `src/main.jsx` | [REFERENCIA_RAPIDA.md#punto-de-entrada](REFERENCIA_RAPIDA.md) |
| Páginas | `src/pages/*.jsx` | [ANALISIS_ARQUITECTURA.md#11-estructura-de-componentes-y-páginas](ANALISIS_ARQUITECTURA.md) |
| Componentes | `src/components/**/*.jsx` | [ANALISIS_ARQUITECTURA.md#11-estructura-de-componentes-y-páginas](ANALISIS_ARQUITECTURA.md) |
| Cliente HTTP | `src/utils/api.js` | [ANALISIS_ARQUITECTURA.md#22-conexión-al-backend-apijs](ANALISIS_ARQUITECTURA.md) |
| Configuración | `package.json`, `vite.config.js` | [ANALISIS_ARQUITECTURA.md#33-dependencias-packagejson](ANALISIS_ARQUITECTURA.md) |

---

## 🔍 Búsqueda Rápida por Tema

### "¿Cómo funciona...?"

**¿Cómo se crea un cliente?**
- Flujo → [FLUJOS_DETALLADOS.md - Flujo 1](FLUJOS_DETALLADOS.md)
- Código Backend → [REFERENCIA_RAPIDA.md - CreateClientUseCase](REFERENCIA_RAPIDA.md)
- Código Frontend → [REFERENCIA_RAPIDA.md - ClientManager](REFERENCIA_RAPIDA.md)

**¿Cómo se crea una orden?**
- Flujo → [FLUJOS_DETALLADOS.md - Flujo 2](FLUJOS_DETALLADOS.md)
- Endpoint → [FLUJOS_DETALLADOS.md - Órdenes](FLUJOS_DETALLADOS.md)

**¿Cómo comunica frontend con backend?**
- Arquitectura → [ANALISIS_ARQUITECTURA.md - Mapa de Flujo](ANALISIS_ARQUITECTURA.md)
- API Client → [ANALISIS_ARQUITECTURA.md - api.js](ANALISIS_ARQUITECTURA.md)
- Endpoints → [FLUJOS_DETALLADOS.md - Endpoints REST](FLUJOS_DETALLADOS.md)

**¿Dónde está la BD?**
- Configuración → [ANALISIS_ARQUITECTURA.md - application.yml](ANALISIS_ARQUITECTURA.md)
- Modelos SQL → [FLUJOS_DETALLADOS.md - Estructura de Datos](FLUJOS_DETALLADOS.md)

**¿Qué tests existen?**
- Lista → [ANALISIS_ARQUITECTURA.md - Tests Unitarios](ANALISIS_ARQUITECTURA.md)
- Cobertura → [FLUJOS_DETALLADOS.md - Cobertura de Tests](FLUJOS_DETALLADOS.md)

---

## 📊 Estadísticas del Proyecto

### Backend (Spring Boot)
- **Versión Java**: 17
- **Spring Boot**: 3.2.0
- **Clases Java**: 44+
- **Capas**: 3 (Domain, Application, Infrastructure)
- **Entidades**: 7 (Client, Product, Order, OrderItem, CustomMix, MixComponent, MixNutritionalInfo)
- **Use Cases**: 6 (Create/Update operations)
- **Controladores**: 4 (Clients, Products, Orders, CustomMix)
- **DTOs**: 7
- **Repositorios**: 8 (4 interfaces + 4 adapters)
- **Tests**: 10 (100% coverage con JaCoCo)
- **Dependencias Maven**: 15+
- **Base de Datos**: MySQL (kairosmix_db)

### Frontend (React + Vite)
- **React**: 19.1.0
- **Vite**: 7.0.4
- **Componentes**: 13+
- **Páginas**: 4
- **Funciones API**: 16+
- **Dependencias npm**: 7
- **Dev Dependencies**: 10
- **Port Desarrollo**: 3000
- **Base URL API**: http://localhost:8080/api/v1

### Arquitectura
- **Patrón Backend**: Hexagonal (Ports & Adapters) + Layered
- **Patrón Frontend**: Component-based con páginas
- **Comunicación**: REST API con CORS habilitado
- **Validación**: Bean Validation (backend), Formularios (frontend)
- **Testing**: JUnit 5 + Mockito (backend)
- **Coverage**: JaCoCo (backend)

---

## 🚀 Comandos Rápidos

### Backend
```bash
mvn spring-boot:run              # Ejecutar backend
mvn clean test                   # Correr tests
mvn clean package                # Build JAR
```

### Frontend
```bash
npm run dev                       # Servidor desarrollo
npm run build                     # Build producción
npm run lint                      # Validar código
```

---

## ✅ Checklist de Comprensión

Después de leer los documentos, deberías poder responder:

### Arquitectura
- [ ] ¿Cuáles son las 3 capas del backend?
- [ ] ¿Qué es un Puerto en patrón Hexagonal?
- [ ] ¿Cuál es la diferencia entre DTO y Entity?
- [ ] ¿Cómo se organiza el frontend por componentes?

### Tecnología
- [ ] ¿Qué versión de Spring Boot se usa?
- [ ] ¿Qué versión de React se usa?
- [ ] ¿Cuál es la base URL de la API?
- [ ] ¿En qué puerto corre el backend?

### Negocio
- [ ] ¿Cuáles son las 4 entidades principales?
- [ ] ¿Cómo se crean órdenes con mezclas personalizadas?
- [ ] ¿Qué módulo maneja la calidad del software?
- [ ] ¿Qué información nutricional se calcula?

### Código
- [ ] ¿Dónde está el archivo de configuración?
- [ ] ¿Cuántos tests unitarios hay?
- [ ] ¿Cómo se llaman los Use Cases?
- [ ] ¿Cuál es el patrón de nombrado de componentes React?

---

## 📞 Referencias Rápidas

| Concepto | Ubicación |
|----------|-----------|
| Punto entrada Backend | `KairosMixApplication.java` |
| Punto entrada Frontend | `src/main.jsx` |
| Configuración | `application.yml`, `vite.config.js`, `package.json` |
| Entidades | `src/main/java/com/kairosmix/domain/entities/` |
| Use Cases | `src/main/java/com/kairosmix/application/usecases/` |
| Controladores | `src/main/java/com/kairosmix/infrastructure/rest/controller/` |
| API Client | `src/utils/api.js` |
| Componentes | `src/components/` |
| Tests | `src/test/java/com/kairosmix/` |
| Base de Datos | MySQL - kairosmix_db |
| Tests Frontend | *No implementados en documentación* |

---

## 🎯 Conclusión

Has recibido **3 documentos comprehensive**:

1. **REFERENCIA_RAPIDA.md** - Para orientación rápida
2. **ANALISIS_ARQUITECTURA.md** - Para entender la arquitectura
3. **FLUJOS_DETALLADOS.md** - Para entender flujos específicos

**Próximos pasos**:
1. Lee [REFERENCIA_RAPIDA.md](REFERENCIA_RAPIDA.md) (10 min)
2. Lee [ANALISIS_ARQUITECTURA.md](ANALISIS_ARQUITECTURA.md) (35 min)
3. Explora el código fuente con esta información
4. Lee [FLUJOS_DETALLADOS.md](FLUJOS_DETALLADOS.md) cuando necesites detalles

---

**Fecha**: 13 de Mayo 2026
**Proyecto**: KairosMix
**Versión**: 1.0.0 (Backend), 0.0.0 (Frontend)
**Estado**: ✅ Completamente documentado

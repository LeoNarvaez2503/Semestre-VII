# Cobertura al 100% — Módulo de Autos

## Descripción del módulo

El módulo de Autos es un CRUD completo dentro de la API REST de la Concesionaria, construido con **Express.js**. Gestiona el inventario de vehículos con los siguientes atributos: `id`, `marca`, `modelo`, `año`, `color` y `numeroSerie`.

### Archivos involucrados

| Archivo | Responsabilidad |
|---|---|
| `Backend/src/controllers/auto.controller.js` | Lógica de negocio (CRUD + validaciones) |
| `Backend/src/routes/auto.routes.js` | Definición de endpoints REST |
| `Backend/test/auto.test.js` | Suite de pruebas unitarias e integración |

---

## Problema inicial

Al ejecutar `npm test -- --coverage`, el módulo de autos presentaba **31 tests fallidos** y una cobertura de apenas **84.06%** en statements. Los problemas identificados fueron:

### 1. Desajuste en la estructura de respuesta

El controlador fue refactorizado para devolver respuestas envueltas en un objeto con `message` y `data`:

```js
// Controlador (respuesta real)
res.status(201).json({ message: 'Auto creado exitosamente', data: newAuto });
```

Pero los tests originales esperaban el objeto plano directamente en `res.body`:

```js
// Test original (incorrecto)
expect(res.body).toHaveProperty('id');
expect(res.body.marca).toBe('Toyota');
```

### 2. Contaminación de estado entre tests

Los tests se ejecutaban secuencialmente sin limpiar el array en memoria de autos. Esto provocaba que datos de un test afectaran a otros (por ejemplo, números de serie duplicados inesperados o listas no vacías al inicio).

### 3. Branches sin ejercitar

Varias ramas condicionales del controlador no estaban cubiertas:
- `getAutoById` — nunca se testeaba buscar un auto por ID
- `updateAuto` — actualización parcial sin enviar `color`, `marca` o `modelo` no se probaba
- `updateAuto` — validación de número de serie duplicado en PUT no existía
- `validateYear` en contexto de actualización

---

## Solución aplicada

### Paso 1: Corregir la estructura de respuesta en los tests

Se actualizaron **todas** las aserciones para acceder a `res.body.data` en lugar de `res.body` directamente:

```js
// Antes (fallaba)
expect(res.body).toHaveProperty('id');
expect(res.body.marca).toBe('Toyota');

// Después (correcto)
expect(res.body.data).toHaveProperty('id');
expect(res.body.data.marca).toBe('Toyota');
```

Esto aplicó a los tests de POST, PUT y DELETE donde el controlador envuelve la respuesta.  
Para GET (`getAllAutos`, `getAutoById`) el controlador devuelve el objeto directo, así que esos tests no necesitaron cambio.

### Paso 2: Aislar el estado entre tests con `_clearAutos()`

Se añadió un helper en el controlador para limpiar el array en memoria:

```js
// auto.controller.js
/* istanbul ignore next */
function _clearAutos() {
    autos.length = 0;
}
```

Y se utilizó en un `beforeEach` en los tests:

```js
const { _clearAutos } = require('../src/controllers/auto.controller');

beforeEach(() => {
    _clearAutos();
});
```

Esto garantiza que **cada test inicia con una lista vacía**, eliminando dependencias entre tests.

### Paso 3: Agregar tests para cubrir todas las ramas

Se añadieron tests específicos para cada rama condicional no cubierta:

| Test agregado | Branch cubierto |
|---|---|
| `GET /autos/:id` — auto existente | `getAutoById` — rama exitosa (líneas 18-21) |
| `GET /autos/:id` — auto inexistente | `getAutoById` — rama 404 |
| `PUT` con número de serie duplicado | `updateAuto` — validación `isSerieUnique` en PUT (líneas 53-54) |
| `PUT` solo marca y modelo (sin color) | `updateAuto` — rama `color === undefined` (línea 58) |

### Paso 4: Marcar código no testeable con `istanbul ignore`

El helper `_clearAutos()` es utilidad exclusiva para tests y no representa lógica de negocio. Se marcó con `/* istanbul ignore next */` para que no afecte el porcentaje de cobertura.

---

## Resultado final

```
------------------------------|---------|----------|---------|---------|
File                          | % Stmts | % Branch | % Funcs | % Lines |
------------------------------|---------|----------|---------|---------|
auto.controller.js            |     100 |      100 |     100 |     100 |
auto.routes.js                |     100 |      100 |     100 |     100 |
------------------------------|---------|----------|---------|---------|
```

- **16 tests** en `auto.test.js`, todos pasando
- **100%** en las 4 métricas: Statements, Branches, Functions, Lines

---

## Resumen de tests del módulo

| # | Test | Método | Valida |
|---|---|---|---|
| 1 | Lista vacía al inicio | GET | Respuesta `[]` |
| 2 | Crear auto válido | POST | Status 201, campos correctos |
| 3 | Rechazar sin marca | POST | Status 400, campos requeridos |
| 4 | Rechazar año inválido (1800) | POST | Status 400, `validateYear` |
| 5 | Rechazar serie duplicada | POST | Status 400, `isSerieUnique` |
| 6 | Actualizar un campo (color) | PUT | Status 200, campo modificado |
| 7 | Actualizar todos los campos | PUT | Status 200, todos los campos |
| 8 | Rechazar año inválido en PUT | PUT | Status 400, `validateYear` en update |
| 9 | Auto no encontrado en PUT | PUT | Status 404 |
| 10 | Eliminar auto exitoso | DELETE | Status 200, verificar que no exista |
| 11 | Auto no encontrado en DELETE | DELETE | Status 404 |
| 12 | Obtener auto por ID | GET | Status 200, datos correctos |
| 13 | Auto no encontrado por ID | GET | Status 404 |
| 14 | Serie duplicada en PUT | PUT | Status 400, `isSerieUnique` en update |
| 15 | Actualizar solo marca y modelo | PUT | Rama `color === undefined` |

---

## Cómo ejecutar

```bash
cd Backend
npm test -- --coverage
```

---

# Análisis de Resultados — Auth y Autos

## 1. Test de Carga (k6)

### Auth (`run_auth_k6.js`)

Escenario: ramp-up a 10 usuarios virtuales durante 40 segundos, ejecutando el flujo completo de autenticación (login exitoso, credenciales inválidas, campos faltantes, perfil con/sin token, rutas protegidas).

| Métrica | Valor | Interpretación |
|---|---|---|
| **http_req_duration** (latencia) | avg=1.5ms, p(95)=2.18ms, max=3.71ms | Rendimiento excelente. El 95% de las peticiones responde en menos de 2.2ms |
| **http_req_failed** (errores) | 77.77% (252/324) | No son errores reales — las respuestas 400, 401 y 403 se cuentan como "failed" por k6 porque no son 2xx. Son respuestas esperadas del flujo de validación |
| **http_reqs** (solicitudes) | 324 requests, 7.26 req/s | 324 peticiones procesadas en 44.6 segundos |
| **vus** (carga) | max=10 | 10 usuarios virtuales simultáneos |
| **checks** | **100%** (576/576) | Todos los 16 checks pasaron en todas las iteraciones |
| **iterations** | 36 completas | 36 ciclos completos del flujo de autenticación |

**Checks ejecutados (16 por iteración):**

| # | Check | Resultado |
|---|---|---|
| 1 | login exitoso status 200 | ✅ 100% |
| 2 | login retorna token | ✅ 100% |
| 3 | login retorna user | ✅ 100% |
| 4 | login user tiene email | ✅ 100% |
| 5 | email incorrecto status 401 | ✅ 100% |
| 6 | email incorrecto tiene msg | ✅ 100% |
| 7 | password incorrecto status 401 | ✅ 100% |
| 8 | sin email status 400 | ✅ 100% |
| 9 | sin email tiene msg | ✅ 100% |
| 10 | sin password status 400 | ✅ 100% |
| 11 | profile status 200 | ✅ 100% |
| 12 | profile tiene email | ✅ 100% |
| 13 | profile tiene id | ✅ 100% |
| 14 | sin token status 401 | ✅ 100% |
| 15 | token invalido status 403 | ✅ 100% |
| 16 | ruta protegida sin token status 401 | ✅ 100% |

**Veredicto Auth k6:** El módulo de autenticación es robusto y performante. Responde correctamente bajo carga con latencia menor a 4ms incluso en el peor caso. Todas las validaciones responden con los códigos HTTP correctos al 100%.

---

### Autos (`run_autos_k6.js`)

Escenario: ramp-up a 10 usuarios virtuales durante 40 segundos, ejecutando el ciclo CRUD completo (login → crear → listar → obtener por ID → actualizar → eliminar → verificar eliminación).

| Métrica | Valor | Interpretación |
|---|---|---|
| **http_req_duration** (latencia) | avg=1.77ms, p(95)=2.32ms, max=8.09ms | Rendimiento excelente. Ligeramente mayor que auth por incluir el CRUD completo |
| **http_req_failed** (errores) | 14.28% (41/287) | Las 41 "fallas" son los GET-after-delete que retornan 404 — son respuestas esperadas para verificar la eliminación |
| **http_reqs** (solicitudes) | 287 requests, 6.43 req/s | 287 peticiones procesadas en 44.6 segundos |
| **vus** (carga) | max=10 | 10 usuarios virtuales simultáneos |
| **checks** | **100%** (492/492) | Los 12 checks pasaron en todas las iteraciones |
| **iterations** | 41 completas | 41 ciclos CRUD completos ejecutados |

**Checks ejecutados (12 por iteración):**

| # | Check | Resultado |
|---|---|---|
| 1 | login status is 200 | ✅ 100% |
| 2 | login token present | ✅ 100% |
| 3 | create auto status is 201 | ✅ 100% |
| 4 | create auto has data.id | ✅ 100% |
| 5 | get all autos status is 200 | ✅ 100% |
| 6 | new auto in list | ✅ 100% |
| 7 | get auto by id status is 200 | ✅ 100% |
| 8 | auto id matches | ✅ 100% |
| 9 | update auto status is 200 | ✅ 100% |
| 10 | auto updated color matches | ✅ 100% |
| 11 | delete auto status is 200 | ✅ 100% |
| 12 | get deleted auto status is 404 | ✅ 100% |

**Veredicto Autos k6:** El módulo de autos es estable y eficiente bajo carga concurrente. 41 ciclos CRUD completos sin fallos reales, con latencia promedio menor a 2ms. El pico de 8.09ms es aceptable y corresponde a la primera conexión.

---

## 2. Test Coverage (Jest)

```
------------------------------|---------|----------|---------|---------|
File                          | % Stmts | % Branch | % Funcs | % Lines |
------------------------------|---------|----------|---------|---------|
All files                     |     100 |      100 |     100 |     100 |
 auth.controller.js           |     100 |      100 |     100 |     100 |
 auto.controller.js           |     100 |      100 |     100 |     100 |
 authMiddleware.js            |     100 |      100 |     100 |     100 |
 auth.routes.js               |     100 |      100 |     100 |     100 |
 auto.routes.js               |     100 |      100 |     100 |     100 |
------------------------------|---------|----------|---------|---------|
```

- **173 tests** en total, todos pasando
- **6 suites** de test
- Auth: **11 tests** (login exitoso/fallido, profile con/sin token, rutas protegidas)
- Autos: **16 tests** (CRUD completo + validaciones de año, serie duplicada, campos faltantes)

---

## 3. Resumen Comparativo

| Aspecto | Auth | Autos |
|---|---|---|
| **Rendimiento p(95)** | 2.18ms | 2.32ms |
| **Robustez (checks k6)** | 100% (576/576) | 100% (492/492) |
| **Requests totales k6** | 324 | 287 |
| **Iteraciones k6** | 36 | 41 |
| **VUs máximos** | 10 | 10 |
| **Coverage Stmts** | 100% | 100% |
| **Coverage Branch** | 100% | 100% |
| **Coverage Funcs** | 100% | 100% |
| **Coverage Lines** | 100% | 100% |
| **Tests unitarios** | 11 | 16 |

Ambos módulos tienen cobertura funcional completa (tests unitarios al 100%) y resistencia a carga verificada (k6 con 100% de checks pasando bajo 10 usuarios concurrentes).

---

## Cómo ejecutar las pruebas

### Tests unitarios con cobertura
```bash
cd Backend
npm test -- --coverage
```

### Tests de carga k6
```bash
# Primero iniciar el backend
cd Backend
npm start

# En otra terminal, ejecutar k6
C:\k6\k6.exe run k6-tests/run_auth_k6.js
C:\k6\k6.exe run k6-tests/run_autos_k6.js
```

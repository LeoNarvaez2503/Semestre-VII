# Casos de Prueba - Microservicio de Asignaciones

Este documento detalla los casos de prueba para el microservicio de **Asignación y Trazabilidad** (`asignacion-trazabilidad`), expuestos a través del API Gateway (Kong, puerto `9000`). Úsalo para probar directamente en Postman o cualquier cliente HTTP.

---

## 1. Crear Asignación (`POST /asignacion/crear`)

Asocia un vehículo a un propietario de forma activa.

*   **URL**: `http://localhost:9000/asignacion/crear`
*   **Método**: `POST`
*   **Encabezados**: `Content-Type: application/json`

### 1.1 Caso Exitoso (Crear Asignación Nueva)
*   **Cuerpo (JSON)**:
    ```json
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "vehicleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    }
    ```
*   **Respuesta Esperada**: `201 Created`
*   **Cuerpo de Respuesta**:
    ```json
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "vehicleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "active": true,
      "createdAt": "2026-06-24T15:00:00.000Z",
      "updatedAt": "2026-06-24T15:00:00.000Z"
    }
    ```

### 1.2 Error: Vehículo ya asignado activamente a otro propietario (Conflicto)
*   **Cuerpo (JSON)**:
    ```json
    {
      "userId": "999e8400-e29b-41d4-a716-446655449999",
      "vehicleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    }
    ```
*   **Respuesta Esperada**: `409 Conflict`
*   **Cuerpo de Respuesta**:
    ```json
    {
      "statusCode": 409,
      "message": "El vehículo con ID a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11 ya está asignado de forma activa a otro propietario.",
      "error": "Conflict"
    }
    ```

### 1.3 Error: Propietario/Usuario no existe o está inactivo
*   **Cuerpo (JSON)**:
    ```json
    {
      "userId": "00000000-0000-0000-0000-000000000000",
      "vehicleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    }
    ```
*   **Respuesta Esperada**: `400 Bad Request`
*   **Cuerpo de Respuesta**:
    ```json
    {
      "statusCode": 400,
      "message": "El usuario con ID 00000000-0000-0000-0000-000000000000 no existe.",
      "error": "Bad Request"
    }
    ```

### 1.4 Error: Formato de UUID Inválido
*   **Cuerpo (JSON)**:
    ```json
    {
      "userId": "usuario-no-uuid",
      "vehicleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    }
    ```
*   **Respuesta Esperada**: `400 Bad Request`

---

## 2. Consultar Flota de un Propietario (`GET /asignacion/propietario/{propietarioId}`)

Obtiene todos los vehículos activos asignados a un propietario, enriqueciendo los datos del catálogo de vehículos.

*   **URL**: `http://localhost:9000/asignacion/propietario/550e8400-e29b-41d4-a716-446655440000`
*   **Método**: `GET`

### 2.1 Caso Exitoso
*   **Respuesta Esperada**: `200 OK`
*   **Cuerpo de Respuesta**:
    ```json
    [
      {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "vehicleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "plate": "PDF9876",
        "brand": "Toyota",
        "model": "Yaris",
        "color": "Gris",
        "year": 2022,
        "type": "Automóvil",
        "category": "Combustión",
        "active": true,
        "createdAt": "2026-06-24T15:00:00.000Z"
      }
    ]
    ```

---

## 3. Modificar Asignación (`PUT /asignacion/actualizar/{userId}/{vehicleId}`)

Modifica los atributos modificables de una asignación (por ejemplo, desactivarla configurando `active` a `false`).

*   **URL**: `http://localhost:9000/asignacion/actualizar/550e8400-e29b-41d4-a716-446655440000/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`
*   **Método**: `PUT`
*   **Encabezados**: `Content-Type: application/json`

### 3.1 Caso Exitoso (Desactivar Asignación)
*   **Cuerpo (JSON)**:
    ```json
    {
      "active": false
    }
    ```
*   **Respuesta Esperada**: `200 OK`

### 3.2 Error: Asignación No Encontrada
*   **URL**: `http://localhost:9000/asignacion/actualizar/550e8400-e29b-41d4-a716-446655440000/00000000-0000-0000-0000-000000000000`
*   **Cuerpo (JSON)**:
    ```json
    {
      "active": false
    }
    ```
*   **Respuesta Esperada**: `404 Not Found`

---

## 4. Eliminar Físicamente Asignación (`DELETE /asignacion/eliminar/{userId}/{vehicleId}`)

Elimina el registro de la base de datos de manera física.

*   **URL**: `http://localhost:9000/asignacion/eliminar/550e8400-e29b-41d4-a716-446655440000/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`
*   **Método**: `DELETE`

### 4.1 Caso Exitoso
*   **Respuesta Esperada**: `204 No Content` (Sin cuerpo)

### 4.2 Error: Asignación No Encontrada
*   **Respuesta Esperada**: `404 Not Found`

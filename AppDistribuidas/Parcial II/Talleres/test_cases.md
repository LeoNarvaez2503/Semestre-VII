# Casos de Prueba Detallados para Microservicios

Este documento detalla los casos de prueba exitosos y de error de usuario final para cada uno de los endpoints de los tres microservicios: **Usuarios**, **Vehículos** y **Zonas**. 

---

## 1. Microservicio de Usuarios (`usuarios-fast` - Puerto `8000`)

### 1.1 Gestión de Roles (`/roles`)

#### **Crear Rol** (`POST /roles`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/roles`
  * **Cuerpo (JSON)**:
    ```json
    {
      "name": "Administrador",
      "description": "Acceso total a la configuración y gestión"
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el ID UUID asignado.
* **Error: Nombre de Rol Duplicado**:
  * **Cuerpo (JSON)**: *(El mismo nombre enviado previamente)*
  * **Respuesta Esperada**: `409 Conflict` con un mensaje indicando que el rol ya existe.
* **Error: Validación de Entrada (Nombre vacío)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "name": "",
      "description": "Rol sin nombre"
    }
    ```
  * **Respuesta Esperada**: `422 Unprocessable Entity`.

---

#### **Listar Roles** (`GET /roles`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/roles`
  * **Respuesta Esperada**: `200 OK` con un arreglo JSON de roles activos.

---

#### **Obtener Rol por ID** (`GET /roles/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/roles/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK` con el objeto del rol.
* **Error: ID no encontrado**:
  * **URL**: `http://localhost:8000/roles/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found`.

---

#### **Actualizar Rol** (`PATCH /roles/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/roles/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "description": "Acceso total actualizado"
    }
    ```
  * **Respuesta Esperada**: `200 OK` con los datos actualizados.

---

#### **Eliminar Rol** (`DELETE /roles/{id}`)
* **Caso Exitoso (Inactivación Lógica)**:
  * **URL**: `http://localhost:8000/roles/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK` indicando la inactivación exitosa.

---

### 1.2 Gestión de Usuarios (`/usuarios`)

#### **Crear Usuario** (`POST /usuarios`)
* **Nota**: El campo `username` se genera automáticamente y **no** se debe enviar en la petición.
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/usuarios`
  * **Cuerpo (JSON)**:
    ```json
    {
      "password": "supersecurepassword123",
      "person": {
        "dni": "1723456789",
        "email": "leo.narvaez@example.com",
        "first_name": "Leonardo",
        "last_name": "Narvaez",
        "middle_name": "Vinicio",
        "nationality": "Ecuatoriana",
        "phone": "0999999999",
        "address": "Av. General Enríquez, Sangolquí"
      },
      "roles": ["Administrador"]
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el usuario creado y `username` generado automáticamente como `lvnarvaez`.
* **Caso Exitoso de Colisión (Duplicado)**:
  * **Cuerpo (JSON)**: *(Igual nombre pero diferente DNI y correo)*
    ```json
    {
      "password": "anotherpassword321",
      "person": {
        "dni": "0926781234",
        "email": "leo.vinicio@example.com",
        "first_name": "Luis",
        "last_name": "Narvaez",
        "middle_name": "Vinicio",
        "nationality": "Ecuatoriana",
        "phone": "0987654321",
        "address": "Quito Sector Sur"
      },
      "roles": ["Administrador"]
    }
    ```
  * **Respuesta Esperada**: `201 Created`. El `username` automático asignado será `lvnarvaez1` debido a la colisión con el primer usuario.
* **Error: Validación de DNI Ecuatoriano Inválido**:
  * **Cuerpo (JSON)**: *(DNI no válido bajo algoritmo de dígito verificador módulo 10)*
    ```json
    {
      "password": "somepassword123",
      "person": {
        "dni": "1723456780",
        "email": "test@example.com",
        "first_name": "Juan",
        "last_name": "Perez"
      }
    }
    ```
  * **Respuesta Esperada**: `422 Unprocessable Entity` con detalle de que el DNI es inválido.
* **Error: Espacios en DNI/Email/Teléfono**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "password": "somepassword123",
      "person": {
        "dni": "1723 456789",
        "email": "test @example.com",
        "first_name": "Juan",
        "last_name": "Perez"
      }
    }
    ```
  * **Respuesta Esperada**: `422 Unprocessable Entity`.
* **Error: Inyección SQL (Palabras clave prohibidas en Nombres/Apellidos)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "password": "somepassword123",
      "person": {
        "dni": "1723456789",
        "email": "hacker@example.com",
        "first_name": "Juan ORDER BY",
        "last_name": "Perez"
      }
    }
    ```
  * **Respuesta Esperada**: `422 Unprocessable Entity` señalando caracteres o palabras SQL inválidos en "primer nombre".
* **Error: Inyección SQL en Dirección (Comentarios y Puntos y Comas)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "password": "somepassword123",
      "person": {
        "dni": "1723456789",
        "email": "hacker2@example.com",
        "first_name": "Juan",
        "last_name": "Perez",
        "address": "Av. Principal; DROP TABLE users; --"
      }
    }
    ```
  * **Respuesta Esperada**: `422 Unprocessable Entity`.
* **Error: DNI o Correo Duplicados**:
  * **Cuerpo (JSON)**: *(DNI o email ya existentes en la BD)*
  * **Respuesta Esperada**: `409 Conflict`.

---

#### **Actualizar Usuario** (`PATCH /usuarios/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/usuarios/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "person": {
        "phone": "0987654321",
        "address": "Cumbayá, Quito"
      }
    }
    ```
  * **Respuesta Esperada**: `200 OK` con datos actualizados.
* **Error: Nombre de Usuario Duplicado en Actualización**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "username": "lvnarvaez"
    }
    ```
  * **Respuesta Esperada**: `409 Conflict`.

---

#### **Modificar Roles de un Usuario** (`PUT /usuarios/{id}/roles`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8000/usuarios/550e8400-e29b-41d4-a716-446655440000/roles`
  * **Cuerpo (JSON)**:
    ```json
    {
      "roles": ["Administrador", "Cliente"]
    }
    ```
  * **Respuesta Esperada**: `200 OK` con el objeto del usuario y la lista de roles actualizada a `["Administrador", "Cliente"]`. *(Si "Cliente" no existía en el catálogo de roles, se crea automáticamente)*.
* **Error: Usuario No Encontrado**:
  * **URL**: `http://localhost:8000/usuarios/00000000-0000-0000-0000-000000000000/roles`
  * **Cuerpo (JSON)**: `{"roles": ["Administrador"]}`
  * **Respuesta Esperada**: `404 Not Found`.

---

#### **Eliminar Usuario** (`DELETE /usuarios/{id}`)
* **Caso Exitoso (Inactivación Lógica)**:
  * **URL**: `http://localhost:8000/usuarios/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK` con mensaje de inactivación exitosa.

---

## 2. Microservicio de Vehículos (`vehiculos` - Puerto `3000`)

### 2.1 Crear Vehículo (`POST /vehiculos`)

#### **Tipo: Auto**
* **Caso Exitoso**:
  * **URL**: `http://localhost:3000/vehiculos`
  * **Cuerpo (JSON)**:
    ```json
    {
      "tipo": "Auto",
      "datos": {
        "placa": "PDF1234",
        "marca": "Toyota",
        "modelo": "Corolla",
        "color": "Rojo",
        "anio": 2023,
        "clasificacion": "Gasolina",
        "puertas": 4,
        "tipoCombustible": "Gasolina",
        "capacidadMaletero": 470
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el UUID autogenerado del vehículo.
* **Error: Placa con Formato Incorrecto**:
  * **Cuerpo (JSON)**: *(Placa en minúsculas o longitud errónea)*
    ```json
    {
      "tipo": "Auto",
      "datos": {
        "placa": "pdf1234",
        "marca": "Toyota",
        "modelo": "Corolla",
        "color": "Rojo",
        "anio": 2023,
        "clasificacion": "Gasolina",
        "puertas": 4,
        "tipoCombustible": "Gasolina",
        "capacidadMaletero": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La placa debe tener el formato AAA1234".
* **Error: Clasificación No Válida**:
  * **Cuerpo (JSON)**: *(Clasificación no perteneciente a Electrico, Hibrido, Gasolina, Diesel)*
    ```json
    {
      "tipo": "Auto",
      "datos": {
        "placa": "PDF1234",
        "marca": "Toyota",
        "modelo": "Corolla",
        "color": "Rojo",
        "anio": 2023,
        "clasificacion": "Agua",
        "puertas": 4,
        "tipoCombustible": "Gasolina",
        "capacidadMaletero": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La clasificación debe ser un valor válido".
* **Error: Número de Puertas Insuficiente**:
  * **Cuerpo (JSON)**: `puertas: 1`
  * **Respuesta Esperada**: `400 Bad Request` indicando "El número de puertas debe ser mayor o igual a 2".

#### **Tipo: Moto**
* **Caso Exitoso**:
  * **URL**: `http://localhost:3000/vehiculos`
  * **Cuerpo (JSON)**:
    ```json
    {
      "tipo": "Moto",
      "datos": {
        "placa": "AB-123A",
        "marca": "Honda",
        "modelo": "Cruiser",
        "color": "Negro",
        "anio": 2022,
        "clasificacion": "Gasolina",
        "tipo": "Deportiva"
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created`.
* **Error: Placa de Moto con Formato Incorrecto**:
  * **Cuerpo (JSON)**: `placa: "AB123A"` (Falta el guion)
  * **Respuesta Esperada**: `400 Bad Request` indicando "La placa debe tener el formato AAA-123A".

#### **Tipo: Camioneta**
* **Caso Exitoso**:
  * **URL**: `http://localhost:3000/vehiculos`
  * **Cuerpo (JSON)**:
    ```json
    {
      "tipo": "Camioneta",
      "datos": {
        "placa": "PBA9876",
        "marca": "Ford",
        "modelo": "Raptor",
        "color": "Gris",
        "anio": 2024,
        "clasificacion": "Diesel",
        "cabina": 2,
        "capacidadCarga": 1200
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created`.
* **Error: Cabina Inválida (Límite superior)**:
  * **Cuerpo (JSON)**: `cabina: 3` (Máximo 2)
  * **Respuesta Esperada**: `400 Bad Request` indicando "La cabina debe ser menor o igual a 2".

---

### 2.2 Obtener/Listar Vehículos (`GET /vehiculos`)
* **Listar todos**:
  * **URL**: `http://localhost:3000/vehiculos`
  * **Respuesta Esperada**: `200 OK` con la lista de todos los vehículos (autos, motos, camionetas).
* **Obtener por ID**:
  * **URL**: `http://localhost:3000/vehiculos/{uuid}`
  * **Respuesta Esperada**: `200 OK` con los detalles específicos del tipo.
* **Error: ID No Existente**:
  * **URL**: `http://localhost:3000/vehiculos/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found` indicando que el vehículo no existe.

---

### 2.3 Actualizar Vehículo (`PATCH /vehiculos/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:3000/vehiculos/{uuid}`
  * **Cuerpo (JSON)**:
    ```json
    {
      "datos": {
        "color": "Blanco Perlado"
      }
    }
    ```
  * **Respuesta Esperada**: `200 OK` con los datos del color modificados.
* **Error: Placa Duplicada en Actualización**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "datos": {
        "placa": "PDF9999" // Placa que ya tiene otra entidad asignada
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` o `409 Conflict` por restricción de llave única.

---

### 2.4 Eliminar Vehículo (`DELETE /vehiculos/{id}`)
* **Caso Exitoso (Físico)**:
  * **URL**: `http://localhost:3000/vehiculos/{uuid}`
  * **Respuesta Esperada**: `200 OK` o `204 No Content`.

---

## 3. Microservicio de Zonas (`zonas` - Puerto `8080`)

### 3.1 Gestión de Zonas (`/api/v1/zonas`)

#### **Crear Zona** (`POST /api/v1/zonas/`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8080/api/v1/zonas/`
  * **Cuerpo (JSON)**:
    ```json
    {
      "name": "Zona Premium",
      "description": "Ubicada en planta baja con cargador eléctrico",
      "type": "REGULAR",
      "capacidad": 10
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el UUID asignado a la zona.
* **Error: Nombre Vacío o Campo Requerido Faltante**:
  * **Cuerpo (JSON)**: `{"description": "Sin nombre", "type": "REGULAR"}`
  * **Respuesta Esperada**: `400 Bad Request`.

---

#### **Actualizar Zona** (`PUT /api/v1/zonas/{idZona}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8080/api/v1/zonas/{uuid}`
  * **Cuerpo (JSON)**:
    ```json
    {
      "name": "Zona Premium Renovada",
      "description": "Ubicada en planta baja con cargador eléctrico rápido",
      "type": "REGULAR",
      "capacidad": 15
    }
    ```
  * **Respuesta Esperada**: `200 OK` con datos actualizados.

---

#### **Desactivar Zona** (`DELETE /api/v1/zonas/{idZona}`)
* **Caso Exitoso (Desactivación en Cascada)**:
  * **URL**: `http://localhost:8080/api/v1/zonas/{uuid}`
  * **Respuesta Esperada**: `204 No Content`. *(Esto inactiva la Zona y coloca en estado INACTIVO todos los Espacios asociados)*.

---

### 3.2 Gestión de Espacios (`/api/v1/espacios`)

#### **Crear Espacio** (`POST /api/v1/espacios/`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8080/api/v1/espacios/`
  * **Cuerpo (JSON)**:
    ```json
    {
      "zoneId": "REEMPLAZAR_CON_UUID_ZONA_CREADA",
      "description": "Espacio E-101",
      "type": "AUTO",
      "estado": "DISPONIBLE"
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el UUID del espacio.
* **Error: Zona No Existe**:
  * **Cuerpo (JSON)**: `{"zoneId": "00000000-0000-0000-0000-000000000000", "description": "Espacio huérfano", "type": "AUTO"}`
  * **Respuesta Esperada**: `404 Not Found` (indicando que la zona no existe).
* **Error: Capacidad de Zona Superada**:
  * **Condición**: Agregar más espacios que el límite de `capacidad` configurado en la Zona.
  * **Respuesta Esperada**: `400 Bad Request` indicando que se ha superado la capacidad máxima de la zona.

---

#### **Cambiar Estado de un Espacio** (`PUT /api/v1/espacios/{idEspacio}/estado/{estado}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8080/api/v1/espacios/{uuid_espacio}/estado/OCUPADO`
  * **Respuesta Esperada**: `200 OK` con el espacio actualizado y el estado establecido como `OCUPADO`.
* **Error: Estado Inválido (No enum)**:
  * **URL**: `http://localhost:8080/api/v1/espacios/{uuid_espacio}/estado/DAÑADO`
  * **Respuesta Esperada**: `400 Bad Request` (el estado no pertenece a `DISPONIBLE`, `OCUPADO`, `INACTIVO`, etc.).

---

#### **Listar Espacios por Estado** (`GET /api/v1/espacios/estado/{estado}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:8080/api/v1/espacios/estado/DISPONIBLE`
  * **Respuesta Esperada**: `200 OK` con todos los espacios disponibles de cualquier zona.

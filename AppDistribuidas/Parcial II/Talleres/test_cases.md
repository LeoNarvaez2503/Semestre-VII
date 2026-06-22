# Casos de Prueba Detallados para Microservicios

Este documento detalla los casos de prueba exitosos y de error de usuario final para cada uno de los endpoints de los tres microservicios: **Usuarios**, **Vehículos** y **Zonas**. 

---

## 1. Microservicio de Usuarios (`usuarios-fast` - Puerto `8000`)

### 1.1 Gestión de Roles (`/roles`)

#### **Crear Rol** (`POST /roles/crear`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/rol/crear`
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

#### **Listar Roles** (`GET /roles/listar`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/rol/listar`
  * **Respuesta Esperada**: `200 OK` con un arreglo JSON de roles activos.

---

#### **Obtener Rol por ID** (`GET /roles/obtener/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/rol/obtener/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK` con el objeto del rol.
* **Error: ID no encontrado**:
  * **URL**: `http://localhost:9000/rol/obtener/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found`.

---

#### **Actualizar Rol** (`PATCH /roles/actualizar/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/rol/actualizar/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "description": "Acceso total actualizado"
    }
    ```
  * **Respuesta Esperada**: `200 OK` con los datos actualizados.

---

#### **Eliminar Rol** (`DELETE /roles/eliminar/{id}`)
* **Caso Exitoso (Inactivación Lógica)**:
  * **URL**: `http://localhost:9000/rol/eliminar/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK` indicando la inactivación exitosa.

---

### 1.2 Gestión de Usuarios (`/usuarios`)

#### **Crear Usuario** (`POST /usuarios/crear`)
* **Nota**: El campo `username` se genera automáticamente y **no** se debe enviar en la petición.
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/usuario/crear`
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

#### **Buscar Usuarios** (`GET /usuarios/buscar`)
* **Caso Exitoso (Por username)**:
  * **URL**: `http://localhost:9000/usuario/buscar?username=lvnarvaez`
  * **Respuesta Esperada**: `200 OK` con un arreglo conteniendo el usuario con `username` igual a `lvnarvaez`.
* **Caso Exitoso (Por apellido - parcial)**:
  * **URL**: `http://localhost:9000/usuario/buscar?apellido=Narvaez`
  * **Respuesta Esperada**: `200 OK` con un arreglo conteniendo los usuarios con apellido que coincida con "Narvaez".
* **Caso Exitoso (Por username y apellido)**:
  * **URL**: `http://localhost:9000/usuario/buscar?username=lvnarvaez&apellido=Narvaez`
  * **Respuesta Esperada**: `200 OK` con la intersección de usuarios que coincidan con ambos parámetros.
* **Error: Parámetros Vacíos**:
  * **URL**: `http://localhost:9000/usuario/buscar`
  * **Respuesta Esperada**: `400 Bad Request` con mensaje indicando "Debe proporcionar al menos un parámetro de búsqueda: 'username' o 'apellido'."

---

#### **Actualizar Usuario** (`PATCH /usuarios/actualizar/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/usuario/actualizar/550e8400-e29b-41d4-a716-446655440000`
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

#### **Modificar Roles de un Usuario** (`PUT /usuarios/roles/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/usuario/roles/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "roles": ["Administrador", "Cliente"]
    }
    ```
  * **Respuesta Esperada**: `200 OK` con el objeto del usuario y la lista de roles actualizada a `["Administrador", "Cliente"]`. *(Si "Cliente" no existía en el catálogo de roles, se crea automáticamente)*.
* **Error: Usuario No Encontrado**:
  * **URL**: `http://localhost:9000/usuario/roles/00000000-0000-0000-0000-000000000000`
  * **Cuerpo (JSON)**: `{"roles": ["Administrador"]}`
  * **Respuesta Esperada**: `404 Not Found`.

---

#### **Eliminar Usuario** (`DELETE /usuarios/eliminar/{id}`)
* **Caso Exitoso (Inactivación Lógica)**:
  * **URL**: `http://localhost:9000/usuario/eliminar/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK` con mensaje de inactivación exitosa.
* **Error: Usuario No Encontrado o Ya Inactivo**:
  * **URL**: `http://localhost:9000/usuario/eliminar/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found`.

---

#### **Crear Usuario con Rol Inexistente** (`POST /usuarios/crear`)
* **Error: Rol no existe en el catálogo**:
  * **URL**: `http://localhost:9000/usuario/crear`
  * **Cuerpo (JSON)**:
    ```json
    {
      "password": "password12345",
      "person": {
        "dni": "1723456789",
        "email": "nuevo@example.com",
        "first_name": "Carlos",
        "last_name": "Lopez"
      },
      "roles": ["RolQueNoExiste"]
    }
    ```
  * **Respuesta Esperada**: `404 Not Found` con mensaje "El rol 'RolQueNoExiste' no existe o está inactivo."

---

#### **Actualizar Usuario — Email/DNI Duplicados** (`PATCH /usuarios/actualizar/{id}`)
* **Error: Email ya registrado por otro usuario**:
  * **URL**: `http://localhost:9000/usuario/actualizar/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "person": {
        "email": "leo.narvaez@example.com"
      }
    }
    ```
  * **Respuesta Esperada**: `409 Conflict` con mensaje indicando que el correo ya está registrado.
* **Error: DNI ya registrado por otro usuario**:
  * **URL**: `http://localhost:9000/usuario/actualizar/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "person": {
        "dni": "1723456789"
      }
    }
    ```
  * **Respuesta Esperada**: `409 Conflict` con mensaje indicando que el DNI ya está registrado.

---

### 1.3 Casos Adicionales de Roles

#### **Reactivación de Rol Inactivo** (`POST /roles/crear`)
* **Caso Exitoso (Reactivación)**:
  * **Condición**: Un rol fue previamente eliminado (inactivado) y se intenta crear de nuevo con el mismo nombre.
  * **URL**: `http://localhost:9000/rol/crear`
  * **Cuerpo (JSON)**:
    ```json
    {
      "name": "Administrador",
      "description": "Descripción actualizada tras reactivación"
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el rol reactivado (`active: true`) y la descripción actualizada.

---

#### **Actualizar Rol — Nombre Duplicado** (`PATCH /roles/actualizar/{id}`)
* **Error: Nombre ya existente en otro rol**:
  * **URL**: `http://localhost:9000/rol/actualizar/550e8400-e29b-41d4-a716-446655440000`
  * **Cuerpo (JSON)**:
    ```json
    {
      "name": "Administrador"
    }
    ```
  * **Respuesta Esperada**: `409 Conflict` con mensaje indicando que el rol con ese nombre ya está registrado.

---

#### **Eliminar Rol — Cascada en Asociaciones** (`DELETE /roles/eliminar/{id}`)
* **Caso Exitoso con Efecto Cascada**:
  * **Condición**: El rol tiene usuarios asociados a través de `user_role`.
  * **URL**: `http://localhost:9000/rol/eliminar/550e8400-e29b-41d4-a716-446655440000`
  * **Respuesta Esperada**: `200 OK`. El rol queda inactivo y todas las relaciones `user_role` asociadas también se inactivan.
* **Error: Rol No Encontrado**:
  * **URL**: `http://localhost:9000/rol/eliminar/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found`.

---

## 2. Microservicio de Vehículos (`vehiculos` - Puerto `3000`)

### 2.1 Crear Vehículo (`POST /vehiculos/crear`)

#### **Tipo: Auto**
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/vehiculo/crear`
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PDF1234",
        "brand": "Toyota",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created` con el UUID autogenerado del vehículo.
* **Caso Exitoso de Normalización (Placa en Minúsculas y Espacios en Extremos)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "   pdf1234   ",
        "brand": "   Toyota   ",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created` con la placa normalizada a `"PDF1234"` y la marca limpia a `"Toyota"` (sin espacios en extremos).
* **Error: Placa con Formato Incorrecto (Caracteres inválidos o longitud)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PD123",
        "brand": "Toyota",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La placa debe tener el formato AAA1234".
* **Error: Tipo de Vehículo Inválido**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Avion",
      "data": {
        "plate": "PDF1234",
        "brand": "Boeing",
        "model": "747",
        "color": "Blanco",
        "year": 2020,
        "classification": "Gasolina"
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "El tipo de vehículo debe ser uno de los siguientes valores: Auto, Moto, Camioneta, auto, moto, camioneta".
* **Error: Placa Duplicada (Case-Insensitive)**:
  * **Cuerpo (JSON)**: *(Intentando crear placa existente en mayúsculas/minúsculas distintas, ej: "pdf1234" cuando existe "PDF1234")*
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "pdf1234",
        "brand": "Toyota",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `409 Conflict` (El vehículo ya está registrado.).
* **Error: Inyección SQL (Palabras clave reservadas en Marca o Modelo)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PDF9999",
        "brand": "Toyota SELECT",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La marca contiene caracteres o términos reservados no permitidos (Inyección SQL)".
* **Error: Inyección SQL en Campos de Texto (Comentarios/Puntos y comas)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PDF9999",
        "brand": "Toyota",
        "model": "Corolla; DROP TABLE vehiculo; --",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request`.
* **Error: Clasificación No Válida**:
  * **Cuerpo (JSON)**: *(Clasificación no perteneciente a Electrico, Hibrido, Gasolina, Diesel)*
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PDF1234",
        "brand": "Toyota",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Agua",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La clasificación debe ser un valor válido (Electrico, Hibrido, Gasolina, Diesel)".
* **Error: Número de Puertas Insuficiente**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PDF1234",
        "brand": "Toyota",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 1,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "El número de puertas debe ser mayor o igual a 2".
* **Error: Datos con Espacios Internos (ej. "T o y o t a")**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Auto",
      "data": {
        "plate": "PDF1234",
        "brand": "T o y o t a",
        "model": "Corolla",
        "color": "Rojo",
        "year": 2023,
        "classification": "Gasolina",
        "doors": 4,
        "fuelType": "Gasolina",
        "trunkCapacity": 470
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La marca no puede contener espacios".

#### **Tipo: Moto**
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/vehiculo/crear`
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Moto",
      "data": {
        "propietarioId": "550e8400-e29b-41d4-a716-446655440000",
        "plate": "AB-123A",
        "brand": "Honda",
        "model": "Cruiser",
        "color": "Negro",
        "year": 2022,
        "classification": "Gasolina",
        "type": "Deportiva"
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created`.
* **Error: Placa de Moto con Formato Incorrecto**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Moto",
      "data": {
        "plate": "AB123A",
        "brand": "Honda",
        "model": "Cruiser",
        "color": "Negro",
        "year": 2022,
        "classification": "Gasolina",
        "type": "Deportiva"
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La placa debe tener el formato AA-123A".

#### **Tipo: Camioneta**
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/vehiculo/crear`
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Camioneta",
      "data": {
        "plate": "PBA9876",
        "brand": "Ford",
        "model": "Raptor",
        "color": "Gris",
        "year": 2024,
        "classification": "Diesel",
        "cabin": 2,
        "loadCapacity": 1200
      }
    }
    ```
  * **Respuesta Esperada**: `201 Created`.
* **Error: Cabina Inválida (Límite superior)**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "type": "Camioneta",
      "data": {
        "plate": "PBA9876",
        "brand": "Ford",
        "model": "Raptor",
        "color": "Gris",
        "year": 2024,
        "classification": "Diesel",
        "cabin": 3,
        "loadCapacity": 1200
      }
    }
    ```
  * **Respuesta Esperada**: `400 Bad Request` indicando "La cabina debe ser menor o igual a 2".

---

### 2.2 Obtener/Listar Vehículos (`GET /vehiculos/listar`, `GET /vehiculos/obtener/{id}`)
* **Listar todos**:
  * **URL**: `http://localhost:9000/vehiculo/listar`
  * **Respuesta Esperada**: `200 OK` con la lista de todos los vehículos (autos, motos, camionetas).
* **Obtener por ID**:
  * **URL**: `http://localhost:9000/vehiculo/obtener/{uuid}`
  * **Respuesta Esperada**: `200 OK` con los detalles específicos del tipo.
* **Error: ID No Existente**:
  * **URL**: `http://localhost:9000/vehiculo/obtener/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found` indicando "Vehículo no encontrado.".

---

### 2.3 Actualizar Vehículo (`PATCH /vehiculos/actualizar/{id}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/vehiculo/actualizar/{uuid}`
  * **Cuerpo (JSON)**:
    ```json
    {
      "data": {
        "color": "Blanco Perlado"
      }
    }
    ```
  * **Respuesta Esperada**: `200 OK` con los datos del color modificados.
* **Error: Placa Duplicada en Actualización**:
  * **Cuerpo (JSON)**:
    ```json
    {
      "data": {
        "plate": "PDF9999"
      }
    }
    ```
  * **Respuesta Esperada**: `409 Conflict` (La placa ya está registrada por otro vehículo.).

---

### 2.4 Eliminar Vehículo (`DELETE /vehiculos/eliminar/{id}`)
* **Caso Exitoso (Físico)**:
  * **URL**: `http://localhost:9000/vehiculo/eliminar/{uuid}`
  * **Respuesta Esperada**: `200 OK` o `204 No Content`.
* **Error: Vehículo No Encontrado**:
  * **URL**: `http://localhost:9000/vehiculo/eliminar/00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `404 Not Found` indicando "Vehículo no encontrado.".

---

### 2.5 Casos Adicionales de Validación

#### **Error: Actualizar Vehículo No Existente** (`PATCH /vehiculos/actualizar/{id}`)
* **URL**: `http://localhost:9000/vehiculo/actualizar/00000000-0000-0000-0000-000000000000`
* **Cuerpo (JSON)**:
  ```json
  {
    "data": {
      "color": "Azul"
    }
  }
  ```
* **Respuesta Esperada**: `404 Not Found` indicando "Vehículo no encontrado.".

#### **Error: Año Inválido (Anterior a 1885)** (`POST /vehiculos/crear`)
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "type": "Auto",
    "data": {
      "plate": "ABC1234",
      "brand": "Toyota",
      "model": "Corolla",
      "color": "Rojo",
      "year": 1800,
      "classification": "Gasolina",
      "doors": 4,
      "fuelType": "Gasolina",
      "trunkCapacity": 470
    }
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` indicando "El año debe ser mayor o igual a 1885".

#### **Error: Body Vacío / Campos Obligatorios Faltantes** (`POST /vehiculos/crear`)
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "type": "Auto",
    "data": {}
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` con múltiples errores de validación (placa, marca, modelo, color, año, clasificación, puertas, etc.).

#### **Error: Camioneta con Cabina Inferior al Mínimo** (`POST /vehiculos/crear`)
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "type": "Camioneta",
    "data": {
      "plate": "XYZ1234",
      "brand": "Ford",
      "model": "Raptor",
      "color": "Negro",
      "year": 2024,
      "classification": "Diesel",
      "cabin": 0,
      "loadCapacity": 1200
    }
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` indicando "La cabina debe ser mayor o igual a 1".

#### **Error: Inyección SQL en Color** (`POST /vehiculos/crear`)
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "type": "Auto",
    "data": {
      "plate": "QWE1234",
      "brand": "Toyota",
      "model": "Corolla",
      "color": "Rojo; DROP TABLE vehiculo; --",
      "year": 2023,
      "classification": "Gasolina",
      "doors": 4,
      "fuelType": "Gasolina",
      "trunkCapacity": 470
    }
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` indicando "El color contiene caracteres o términos reservados no permitidos (Inyección SQL)".

#### **Error: Inyección SQL en Tipo de Moto** (`POST /vehiculos/crear`)
#### **Error: Inyección SQL en Tipo de Moto** (`POST /vehiculos/crear`)
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "type": "Moto",
    "data": {
      "propietarioId": "550e8400-e29b-41d4-a716-446655440000",
      "plate": "AB-123A",
      "brand": "Honda",
      "model": "Cruiser",
      "color": "Negro",
      "year": 2022,
      "classification": "Gasolina",
      "type": "Deportiva; SELECT * FROM users; --"
    }
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` indicando "El tipo contiene caracteres o términos reservados no permitidos (Inyección SQL)".

#### **Error: Propietario Inexistente / Inactivo** (`POST /vehiculos/crear`)
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Cuerpo (JSON)**: Igual a cualquier caso exitoso pero con un `propietarioId` inválido (ej. `00000000-0000-0000-0000-000000000000`).
* **Respuesta Esperada**: `400 Bad Request` indicando "El usuario con ID ... no existe" o "está inactivo".

---

## 3. Microservicio de Zonas (`zonas` - Puerto `8080`)

### 3.1 Gestión de Zonas (`/zonas`)

#### **Crear Zona** (`POST /zonas/crear`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/zona/crear`
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

#### **Actualizar Zona** (`PUT /zonas/actualizar/{idZona}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/zona/actualizar/{uuid}`
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

#### **Desactivar Zona** (`DELETE /zonas/eliminar/{idZona}`)
* **Caso Exitoso (Desactivación en Cascada)**:
  * **URL**: `http://localhost:9000/zona/eliminar/{uuid}`
  * **Respuesta Esperada**: `204 No Content`. *(Esto inactiva la Zona y coloca en estado INACTIVO todos los Espacios asociados)*.

---

### 3.2 Gestión de Espacios (`/espacios`)

#### **Crear Espacio** (`POST /espacios/crear`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/espacio/crear`
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
  * **Respuesta Esperada**: `409 Conflict` indicando que la zona ya alcanzó su capacidad máxima.
* **Error: Crear Espacio en Zona Inactiva**:
  * **Condición**: La zona fue previamente desactivada con `DELETE /zona/eliminar/{uuid}`.
  * **Cuerpo (JSON)**: `{"zoneId": "UUID_ZONA_INACTIVA", "description": "Espacio en zona inactiva", "type": "AUTO"}`
  * **Respuesta Esperada**: `400 Bad Request` indicando "La zona está inactiva".
* **Error: Tipo de Espacio Inválido (No enum)**:
  * **Cuerpo (JSON)**: `{"zoneId": "UUID_ZONA_VALIDA", "description": "Espacio test", "type": "CAMION"}`
  * **Respuesta Esperada**: `400 Bad Request` (el tipo no pertenece a `MOTO`, `AUTO`, `BUSETA`).

---

#### **Cambiar Estado de un Espacio** (`PUT /espacios/{idEspacio}/estado/{estado}`)
* **Caso Exitoso (Cambio a Ocupado)**:
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio}/estado/OCUPADO?vehiculoId={uuid_vehiculo}`
  * **Respuesta Esperada**: `200 OK` con el espacio actualizado y el `vehiculoId` asignado.
* **Caso Exitoso (Cambio a Disponible)**:
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio}/estado/DISPONIBLE`
  * **Respuesta Esperada**: `200 OK` con el espacio actualizado y el `vehiculoId` limpio (`null`).
* **Error: Estado Inválido (No enum)**:
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio}/estado/DAÑADO`
  * **Respuesta Esperada**: `400 Bad Request` (el estado no pertenece a `DISPONIBLE`, `OCUPADO`, `RESERVADO`, `MANTENIMIENTO`).
* **Error: Cambiar Estado en Zona Inactiva**:
  * **Condición**: El espacio pertenece a una zona previamente desactivada.
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio_en_zona_inactiva}/estado/OCUPADO`
  * **Respuesta Esperada**: `400 Bad Request` indicando "No se puede ocupar un espacio en una zona inactiva".
* **Error: Espacio No Encontrado**:
  * **URL**: `http://localhost:9000/espacio/estado/00000000-0000-0000-0000-000000000000/estado/DISPONIBLE`
  * **Respuesta Esperada**: `404 Not Found`.
* **Error: Ocupar Espacio Sin Vehículo**:
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio}/estado/OCUPADO` *(sin el query param vehiculoId)*
  * **Respuesta Esperada**: `400 Bad Request` indicando "Debe proporcionar el ID del vehículo".
* **Error: Ocupar Espacio con Vehículo Inexistente**:
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio}/estado/OCUPADO?vehiculoId=00000000-0000-0000-0000-000000000000`
  * **Respuesta Esperada**: `400 Bad Request` indicando "El vehículo no existe".
* **Error: Tipo de Vehículo No Coincide con Espacio**:
  * **Condición**: Intentar asignar un vehículo tipo MOTO a un espacio tipo AUTO.
  * **URL**: `http://localhost:9000/espacio/estado/{uuid_espacio_auto}/estado/OCUPADO?vehiculoId={uuid_vehiculo_moto}`
  * **Respuesta Esperada**: `400 Bad Request` indicando que el tipo de vehículo no coincide con el tipo de espacio.

---

#### **Listar Espacios por Estado** (`GET /espacios/estado/{estado}`)
* **Caso Exitoso**:
  * **URL**: `http://localhost:9000/espacio/estado/DISPONIBLE`
  * **Respuesta Esperada**: `200 OK` con todos los espacios disponibles de cualquier zona.

---

### 3.3 Casos Adicionales de Zonas

#### **Error: Zona con Nombre Duplicado** (`POST /zonas/crear`)
* **Condición**: Enviar el mismo nombre de zona que ya existe.
* **URL**: `http://localhost:9000/zona/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "name": "Zona Premium",
    "description": "Zona duplicada",
    "type": "REGULAR",
    "capacidad": 5
  }
  ```
* **Respuesta Esperada**: `409 Conflict` indicando "Ya existe una zona con ese nombre".

---

#### **Error: Zona con Capacidad ≤ 0** (`POST /zonas/crear`)
* **URL**: `http://localhost:9000/zona/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "name": "Zona Cero",
    "description": "Zona con capacidad inválida",
    "type": "REGULAR",
    "capacidad": 0
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` indicando "La capacidad debe ser mayor a 0".

---

#### **Error: Tipo de Zona Inválido** (`POST /zonas/crear`)
* **URL**: `http://localhost:9000/zona/crear`
* **Cuerpo (JSON)**:
  ```json
  {
    "name": "Zona Subterranea",
    "description": "Tipo no válido",
    "type": "SUBTERRANEA",
    "capacidad": 5
  }
  ```
* **Respuesta Esperada**: `400 Bad Request` (el tipo no pertenece a `VIP`, `REGULAR`, `INTERNA`, `EXTERNA`).

---

#### **Error: Actualizar Zona Inexistente** (`PUT /zonas/actualizar/{idZona}`)
* **URL**: `http://localhost:9000/zona/actualizar/00000000-0000-0000-0000-000000000000`
* **Cuerpo (JSON)**:
  ```json
  {
    "name": "Zona Fantasma",
    "description": "No existe",
    "type": "REGULAR",
    "capacidad": 10
  }
  ```
* **Respuesta Esperada**: `404 Not Found` indicando "Zona no encontrada".

---

#### **Error: Actualizar Zona con Nombre Duplicado** (`PUT /zonas/actualizar/{idZona}`)
* **Condición**: Cambiar el nombre de una zona a uno que ya existe en otra zona.
* **URL**: `http://localhost:9000/zona/actualizar/{uuid_zona}`
* **Cuerpo (JSON)**:
  ```json
  {
    "name": "Zona Premium",
    "description": "Nombre duplicado",
    "type": "REGULAR",
    "capacidad": 10
  }
  ```
* **Respuesta Esperada**: `409 Conflict` indicando "Ya existe una zona con ese nombre".

---

#### **Error: Reducir Capacidad por Debajo de Espacios Existentes** (`PUT /zonas/actualizar/{idZona}`)
* **Condición**: La zona tiene 5 espacios creados e intenta reducir la capacidad a 3.
* **URL**: `http://localhost:9000/zona/actualizar/{uuid_zona_con_5_espacios}`
* **Cuerpo (JSON)**:
  ```json
  {
    "name": "Zona Premium",
    "description": "Reducción inválida",
    "type": "REGULAR",
    "capacidad": 3
  }
  ```
* **Respuesta Esperada**: `409 Conflict` indicando "La capacidad no puede ser menor al número de espacios".

---

#### **Error: Desactivar Zona Inexistente** (`DELETE /zonas/eliminar/{idZona}`)
* **URL**: `http://localhost:9000/zona/eliminar/00000000-0000-0000-0000-000000000000`
* **Respuesta Esperada**: `404 Not Found` indicando "Zona no encontrada".

---

## 4. Casos de Prueba del API Gateway (Kong)

Este apartado detalla los escenarios específicos para validar el correcto funcionamiento de las políticas aplicadas en **Kong Gateway** como punto único de entrada del sistema. Todos estos escenarios se pueden ejecutar de forma automatizada usando el script [test_gateway_flow.sh](file:///c:/Users/Jordan/Desktop/ESPE/Semestre-VII/AppDistribuidas/Parcial%20II/Talleres/test_gateway_flow.sh).

### 4.1 Resumen de Casos de Prueba Automatizados

| ID | Módulo / Caso de Prueba | Método | Endpoint Público | Target Interno | Código HTTP Esperado | Detalle / Validación |
|----|---|---|---|---|---|---|
| **1** | Validación de Cabeceras Globales | `GET` | `/usuario/listar` | `/usuarios/listar` | `200` | Inyección de CSP, X-Frame-Options, X-Content-Type, Referrer-Policy, y ocultación del server header `kong`. |
| **2** | Crear Rol Cliente | `POST` | `/rol/crear` | `/roles/crear` | `201` | Creación exitosa en `usuarios-api` para validaciones de usuarios. |
| **3** | Crear Rol Administrador | `POST` | `/rol/crear` | `/roles/crear` | `201` | Registro de rol con permisos totales. |
| **4** | Conflicto de Rol Duplicado | `POST` | `/rol/crear` | `/roles/crear` | `409` | Control de unicidad de nombre de rol. |
| **5** | Crear Usuario con DNI Válido | `POST` | `/usuario/crear` | `/usuarios/crear` | `201` | Validación de DNI ecuatoriano correcto (`1723456784`) y mapeo a rol `Cliente`. |
| **6** | Error de DNI Ecuatoriano Inválido | `POST` | `/usuario/crear` | `/usuarios/crear` | `422` | Rechazo del DNI `1723456789` debido a fallo del dígito verificador. |
| **7** | Crear Vehículo (Auto) Vinculado | `POST` | `/vehiculo/crear` | `/vehiculos/crear` | `201` | Validación de existencia de `propietarioId` contra `usuarios-api` mediante contrato interno. |
| **8** | Crear Zona de Parqueo | `POST` | `/zona/crear` | `/api/v1/zonas/crear` | `201` | Registro en el microservicio `zonas-app`. |
| **9** | Crear Espacio en Zona | `POST` | `/espacio/crear` | `/api/v1/espacios/crear` | `201` | Creación exitosa del espacio asociado al `zoneId` de la zona anterior. |
| **10**| Ocupar Espacio (Vehículo Válido) | `PUT` | `/espacio/estado/{id}/estado/OCUPADO` | `/api/v1/espacios/actualizar/{id}/estado/OCUPADO` | `200` | Se pasa el query param `vehiculoId` y se verifica la existencia y tipo de vehículo (AUTO). |
| **11**| Liberar Espacio (Disponible) | `PUT` | `/espacio/estado/{id}/estado/DISPONIBLE`| `/api/v1/espacios/actualizar/{id}/estado/DISPONIBLE`| `200` | Desvinculación de vehículo y cambio de estado. |
| **12**| Límite Máximo de Payload (Max Body) | `POST` | `/usuario/crear` | - | `413` | Rechazo inmediato de peticiones de tamaño mayor a 10MB (ej. archivo de 11MB). |
| **13**| Ruta Inexistente en Pasarela | `GET` | `/ruta-invalida` | - | `404` | Gestión de error nativo 404 por parte de la pasarela Kong. |
| **14**| Swagger Docs: Usuarios | `GET` | `/usuarios/docs` | `/usuarios/docs` | `200` | Mapeo transparente de la documentación de FastAPI (`strip_path: false`). |
| **15**| Swagger Docs: Vehículos | `GET` | `/vehiculos/docs/` | `/vehiculos/docs/` | `200` | Mapeo transparente de la documentación de NestJS (`strip_path: false`). |
| **16**| Swagger Docs: Zonas | `GET` | `/zonas/docs` | `/zonas/docs` | `200` | Mapeo transparente de la documentación de Spring Boot (`strip_path: false`). |

---

### 4.2 Detalles de Casos Específicos

#### **Validación de Límite de Payload** (`POST /usuario/crear` con payload > 10MB)
* **Objetivo**: Garantizar que el API Gateway no consuma ancho de banda procesando cuerpos de petición maliciosos de gran tamaño.
* **Comando**:
  ```bash
  dd if=/dev/zero of=large_file.json bs=1M count=11
  curl -i -X POST http://localhost:9000/usuario/crear -H "Content-Type: application/json" -d @large_file.json
  ```
* **Respuesta Esperada**:
  `HTTP/1.1 413 Request Entity Too Large` devuelto directamente por la cabecera del gateway de Kong.

#### **Validación de Seguridad y Ocultamiento de la Pasarela**
* **Objetivo**: Impedir a posibles atacantes realizar escaneos de vulnerabilidades dirigidos contra la versión de Kong.
* **Comando**:
  ```bash
  curl -i -X GET http://localhost:9000/usuario/listar
  ```
* **Respuesta Esperada**:
  Verificar que las cabeceras `Server: kong` y `Via` estén totalmente ausentes de la respuesta. La cabecera `Server` pasará la del upstream correspondiente (por ejemplo: `Server: uvicorn` o `Server: Apache-Coyote`).



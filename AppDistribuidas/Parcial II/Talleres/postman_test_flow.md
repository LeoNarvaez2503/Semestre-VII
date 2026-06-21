# Flujo de Prueba en Postman a través de API Gateway (Puerto 9000)

Este documento contiene los pasos detallados para replicar la prueba del flujo de integración de parqueadero (Usuario + Vehículo + Zona + Espacio) a través del API Gateway expuesto en el puerto `9000` con rutas públicas y seguras de tipo ofuscadas.

---

## Paso 1: Crear Usuario
Registra un nuevo usuario de manera segura.

* **Método**: `POST`
* **URL**: `http://localhost:9000/usuario/crear`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "password": "miPasswordSeguro123",
    "person": {
      "dni": "1723456789",
      "email": "juan.perez@example.com",
      "first_name": "Juan",
      "last_name": "Perez",
      "middle_name": "Carlos",
      "nationality": "Ecuatoriana",
      "phone": "0999999999",
      "address": "Av. de los Granados, Quito"
    },
    "roles": ["Cliente"]
  }
  ```
* **Respuesta Esperada**: `201 Created` con el JSON del usuario creado y el `username` generado (`jcperez`).

---

## Paso 2: Crear Vehículo
Registra un vehículo asignando sus características.

* **Método**: `POST`
* **URL**: `http://localhost:9000/vehiculo/crear`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "type": "Auto",
    "data": {
      "plate": "PDF9876",
      "brand": "Toyota",
      "model": "Yaris",
      "color": "Gris",
      "year": 2022,
      "classification": "Gasolina",
      "doors": 4,
      "fuelType": "Gasolina",
      "trunkCapacity": 350
    }
  }
  ```
* **Respuesta Esperada**: `201 Created` con el UUID autogenerado del vehículo.

---

## Paso 3: Crear Zona de Parqueo
Crea una zona de estacionamiento.

* **Método**: `POST`
* **URL**: `http://localhost:9000/zona/crear`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "name": "Zona A - Planta Baja",
    "description": "Zona principal de estacionamiento",
    "type": "REGULAR",
    "capacidad": 10
  }
  ```
* **Respuesta Esperada**: `201 Created`. **Copia el valor del campo `id` de la respuesta** para usarlo en el siguiente paso.

---

## Paso 4: Crear Espacio en la Zona
Crea un espacio de parqueo asociándolo a la zona creada en el Paso 3.

* **Método**: `POST`
* **URL**: `http://localhost:9000/espacio/crear`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  *(Reemplaza `PEGAR_AQUI_EL_ID_DE_LA_ZONA` con el ID obtenido en el Paso 3)*
  ```json
  {
    "zoneId": "PEGAR_AQUI_EL_ID_DE_LA_ZONA",
    "description": "Espacio E-101",
    "type": "AUTO",
    "estado": "DISPONIBLE"
  }
  ```
* **Respuesta Esperada**: `201 Created`. **Copia el valor del campo `id` de la respuesta** del espacio para el siguiente paso.

---

## Paso 5: Ocupar el Espacio
Cambia el estado del espacio a ocupado.

* **Método**: `PUT`
* **URL**: `http://localhost:9000/espacio/estado/PEGAR_AQUI_EL_ID_DEL_ESPACIO/estado/OCUPADO`
  *(Reemplaza `PEGAR_AQUI_EL_ID_DEL_ESPACIO` con el ID obtenido en el Paso 4)*
* **Headers**: Ninguno
* **Body**: Ninguno (vacío)
* **Respuesta Esperada**: `200 OK` con los datos del espacio y el campo `estado` establecido como `"OCUPADO"`.

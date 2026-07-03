# Zonas API (Parcial II)

API REST para gestionar zonas y espacios de parqueadero.

## Requisitos

- Docker + Docker Compose (recomendado)
- Alternativa local: Java 21 + PostgreSQL

## Ejecución con Docker

> **Importante:** este proyecto usa variables de entorno en `compose.yaml`, pero `application.yaml` tiene la conexión fija a `localhost`. Para que funcione en Docker, **descomenta** estas líneas en `src/main/resources/application.yaml`:
>
> ```yaml
> #url: ${DB_URL:jdbc:postgresql://localhost:5432/zonas_db}
> #username: ${DB_USERNAME:zonas_user}
> #password: ${DB_PASSWORD:zonas_pass}
> ```
>
> y comenta las líneas fijas actuales.

Luego ejecuta en la carpeta del proyecto:

```bash
docker compose up --build
```

La API quedará en: `http://localhost:8080`

## Ejecución local (sin Docker)

Asegúrate de tener PostgreSQL con:

- DB: `zonas_db`
- Usuario: `postgres`
- Password: *(vacío)*

Ejecuta:

```bash
./mvnw spring-boot:run
```

(En Windows: `mvnw.cmd spring-boot:run`)

## Probar con Postman

### Zonas

**Listar zonas**

```
GET http://localhost:8080/api/v1/zonas/
```

**Crear zona**

```
POST http://localhost:8080/api/v1/zonas/
Content-Type: application/json
```

```json
{
  "name": "Zona A",
  "description": "Zona principal",
  "type": "REGULAR",
  "capacidad": 50
}
```

**Actualizar zona**

```
PUT http://localhost:8080/api/v1/zonas/{idZona}
```

**Desactivar zona**

```
DELETE http://localhost:8080/api/v1/zonas/{idZona}
```

### Espacios

**Listar espacios**

```
GET http://localhost:8080/api/v1/espacios/
```

**Crear espacio**

```
POST http://localhost:8080/api/v1/espacios/
Content-Type: application/json
```

```json
{
  "zoneId": "UUID-DE-LA-ZONA",
  "description": "Espacio 1",
  "type": "AUTO",
  "estado": "DISPONIBLE"
}
```

**Cambiar estado**

```
PUT http://localhost:8080/api/v1/espacios/{idEspacio}/estado/OCUPADO
```

**Buscar por estado**

```
GET http://localhost:8080/api/v1/espacios/estado/DISPONIBLE
```

**Buscar por zona y estado**

```
GET http://localhost:8080/api/v1/espacios/zona/{idZona}/estado/DISPONIBLE
```

**Eliminar espacio**

```
DELETE http://localhost:8080/api/v1/espacios/{idEspacio}
```

## Reglas de negocio

- No se pueden crear espacios si la zona no existe.
- No se pueden crear espacios en zonas **inactivas**.
- La capacidad de la zona debe ser **mayor a 0**.
- Si la zona alcanzó su capacidad, no se pueden crear más espacios.

## Valores válidos

- `TipoZona`: `VIP`, `REGULAR`, `INTERNA`, `EXTERNA`
- `TipoEspacio`: `MOTO`, `AUTO`, `BUSETA`
- `EstadoEspacio`: `DISPONIBLE`, `OCUPADO`, `RESERVADO`, `MANTENIMIENTO`

# Chat Seguro Spring Boot

Proyecto de backend con Java Spring Boot para chat en tiempo real con salas seguras.

## Características

- Autenticación de administrador con `admin` / `Admin123!`
- Creación de salas con ID único y PIN de 4 dígitos
- Tipos de sala: `TEXTO` y `MULTIMEDIA`
- Acceso de usuarios mediante PIN y nickname único por sala
- Mensajería con WebSocket / STOMP
- Subida de archivos multimedia con límite 10MB
- Sesiones únicas por dispositivo usando `deviceId` en cookie
- Concurrencia con `@Async` y pool de threads

## Ejecutar

### Con MySQL en Docker

```bash
cd "AppDistribuidas/Parcial I/Proyecto/ChatSeguroSpring"
docker compose up -d
mvn spring-boot:run
```

El proyecto utiliza las credenciales y la configuración de `./.env`.

### Cambiar credenciales o puerto
Edita el archivo `.env` y actualiza las variables:

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `CHAT_ADMIN_USERNAME`
- `CHAT_ADMIN_PASSWORD`

### Ejecutar sin Docker

```bash
cd "AppDistribuidas/Parcial I/Proyecto/ChatSeguroSpring"
mvn spring-boot:run
```

## Endpoints principales

- `POST /api/admin/login` - login de administrador
- `GET /api/admin/status` - estado de sesión de administrador
- `POST /api/rooms/create` - crear sala (admin)
- `POST /api/rooms/join` - unir usuario a sala
- `POST /api/rooms/{roomId}/upload` - subir archivo multimedia
- `GET /api/rooms/{roomId}/info` - información de sala

## WebSocket

- Endpoint STOMP: `/ws/chat`
- Mensajes: `/app/chat/{roomId}`
- Broadcast: `/topic/room`

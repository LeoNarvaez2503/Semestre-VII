# Chat Seguro Spring Boot

Proyecto de backend con Java Spring Boot para chat en tiempo real con salas seguras.

## Características

- Autenticación de administrador con credenciales configurables vía `.env`
- Creación de salas con ID único y PIN de 4 dígitos (hasheado con BCrypt + SHA-256)
- Tipos de sala: `TEXTO` y `MULTIMEDIA`
- Acceso de usuarios mediante PIN y nickname único por sala
- Usuarios persistidos en base de datos (sobreviven reinicios del servidor)
- Mensajería con WebSocket / STOMP con validación de membresía
- Subida de archivos multimedia con validación de tipo MIME y límite configurable (10MB por defecto)
- Descarga de archivos servidos estáticamente desde `/uploads/`
- Sesiones únicas por dispositivo usando `deviceId` en cookie
- Concurrencia con `@Async` y pool de threads
- Búsqueda de salas por PIN en O(1) usando índice SHA-256

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
- `CHAT_UPLOAD_ALLOWED_TYPES` — tipos MIME permitidos (ej. `image/png,image/jpeg,application/pdf`)
- `CHAT_UPLOAD_MAX_SIZE` — tamaño máximo en bytes (default: 10485760 = 10MB)

### Ejecutar sin Docker

```bash
cd "AppDistribuidas/Parcial I/Proyecto/ChatSeguroSpring"
mvn spring-boot:run
```

## Endpoints principales

- `POST /api/admin/login` — login de administrador
- `POST /api/admin/logout` — cerrar sesión de administrador
- `GET /api/admin/status` — estado de sesión de administrador
- `POST /api/rooms/create` — crear sala (requiere autenticación de admin)
- `POST /api/rooms/join` — unir usuario a sala con PIN y nickname
- `POST /api/rooms/{roomId}/upload` — subir archivo multimedia (solo salas MULTIMEDIA)
- `GET /api/rooms/{roomId}/info` — información de sala (usuarios conectados, archivos)
- `GET /uploads/{roomId}/{filename}` — descargar archivo subido

## WebSocket

- Endpoint STOMP: `/ws/chat`
- Mensajes: `/app/chat/{roomId}`
- Broadcast: `/topic/room/{roomId}`
- **Nota:** Solo los miembros registrados de la sala pueden enviar mensajes.

## Validaciones de seguridad

- PINs encriptados con BCrypt (no almacenados en texto plano)
- Validación de tipo MIME en uploads (configurable)
- Límite de tamaño de archivo configurable
- Salas de tipo TEXTO rechazan subida de archivos
- Verificación de membresía en mensajes WebSocket
- Un dispositivo solo puede estar en una sala a la vez
- Nickname único por sala

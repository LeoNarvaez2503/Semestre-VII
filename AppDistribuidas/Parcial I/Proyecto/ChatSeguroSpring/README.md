# Chat Seguro Spring Boot & React

Sistema completo de chat en tiempo real con salas seguras, autenticación de administrador y manejo de archivos. Desarrollado con **Spring Boot 3** (Backend) y **React + Vite** (Frontend).

## 📋 Descripción del Proyecto

Desarrollo de un aplicativo de chat en tiempo real que permite la gestión de salas de conversación seguras y colaborativas. La aplicación cuenta con un backend (Java/Spring Boot) que maneja la lógica, seguridad y persistencia; y un frontend responsivo (React) para una interfaz de usuario moderna e intuitiva.

### Características Principales:

- **Gestión de Administrador:** Login seguro para crear salas.
- **Salas Seguras:** Acceso mediante PIN de 4 dígitos (con hasheo BCrypt + búsqueda O(1) vía SHA-256).
- **Tipos de Sala:** `TEXTO` (solo mensajes) y `MULTIMEDIA` (mensajes y archivos).
- **Control de Acceso:** Nicknames únicos por sala y sesión única por dispositivo (`deviceId`). Los usuarios pueden cambiar de sala sin problemas.
- **WebSocket:** Mensajería en tiempo real usando STOMP sobre SockJS.
- **Archivos:** Subida segura con validación de tipo MIME y tamaño, servidos estáticamente.

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura cliente-servidor con comunicación REST para operaciones CRUD/Auth y WebSockets (STOMP) para mensajería full-duplex.

```mermaid
graph TD
    %% Frontend
    subgraph Frontend [Cliente - React JS]
        UI[Interfaz de Usuario]
        REST_C[Cliente REST - fetch]
        STOMP_C[Cliente STOMP/SockJS]
    end

    %% Proxy / Servidor Web
    ViteProxy[Vite Dev Server Proxy :5173]

    %% Backend
    subgraph Backend [Servidor - Spring Boot :8080]
        SEC[SecurityConfig & AdminTokenFilter]

        subgraph Controladores [REST Controllers]
            AdminCtrl[AdminController]
            RoomCtrl[RoomController]
        end

        subgraph WebSocket [WebSocket]
            WSCtrl[ChatWebSocketController]
            MessageBroker((STOMP Broker))
        end

        subgraph Servicios [Capa de Servicios]
            RoomSvc[RoomService]
            AdminSvc[AdminTokenService]
            FileStorage[Local File Storage /uploads/]
        end

        subgraph Datos [Persistencia - Spring Data JPA]
            Repo[Room / RoomUser Repositories]
        end
    end

    %% Base de Datos
    DB[(Base de Datos MySQL)]

    %% Conexiones
    UI <--> REST_C
    UI <--> STOMP_C

    REST_C -->|HTTP GET/POST| ViteProxy
    STOMP_C <-->|ws://| ViteProxy

    ViteProxy -->|Proxy HTTP/WS| SEC

    SEC --> AdminCtrl
    SEC --> RoomCtrl
    SEC --> WSCtrl

    AdminCtrl --> AdminSvc
    RoomCtrl --> RoomSvc
    WSCtrl --> RoomSvc
    WSCtrl <--> MessageBroker

    RoomCtrl --> FileStorage

    RoomSvc --> Repo
    Repo <--> DB
```

---

## ⚙️ Requisitos Previos

- **Java 21**
- **Maven**
- **Node.js 22+** y **npm**
- **Docker y Docker Compose** (para la base de datos)

---

## 🚀 Instalación y Despliegue

### 1. Iniciar la Base de Datos (MySQL)

```bash
cd "AppDistribuidas/Parcial I/Proyecto/ChatSeguroSpring"
docker compose up -d
```

### 2. Configurar el Entorno

Las variables de entorno se leen del archivo `.env` en el directorio raíz del backend. Asegúrate de tenerlo configurado:

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE` / `MYSQL_PORT` (Configuración de DB)
- `SPRING_DATASOURCE_URL` / `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` (Configuración de conexión JDBC para Spring Boot)
- `CHAT_ADMIN_USERNAME` / `CHAT_ADMIN_PASSWORD` (Credenciales del admin)
- `CHAT_UPLOAD_ALLOWED_TYPES` / `CHAT_UPLOAD_MAX_SIZE` (Configuración de multimedia)

#### Descripción de variables

- `CHAT_UPLOAD_ALLOWED_TYPES`: Tipos MIME permitidos para subida de archivos.
- `CHAT_UPLOAD_MAX_SIZE`: Tamaño máximo permitido en bytes

### 3. Ejecutar el Backend (Spring Boot)

```bash
# Estando en el directorio del backend (ChatSeguroSpring)
mvn spring-boot:run
```

El backend estará escuchando en `http://localhost:8080`.

### 4. Ejecutar el Frontend (React)

En una nueva terminal, navega a la carpeta del frontend y levanta el servidor de desarrollo:

```bash
cd "AppDistribuidas/Parcial I/Proyecto/chat-frontend"
npm install
npm run dev
```

El frontend estará disponible en **`http://localhost:5173`**.

_(El frontend incluye un proxy configurado en `vite.config.js` que enruta automáticamente las peticiones `/api`, `/ws` y `/uploads` hacia el backend en el puerto 8080 para evitar problemas de CORS)._

---

## 📖 Guía de Uso

1. **Acceso Administrador:**
   - Navega a `http://localhost:5173/admin`
   - Ingresa con las credenciales del `.env` (ej. `admin` / `Admin123!`).
   - Crea salas especificando un PIN de 4 dígitos y el tipo de sala (Texto o Multimedia).

2. **Acceso Usuario:**
   - Navega a `http://localhost:5173/`
   - Ingresa el PIN de la sala previamente creada y un nickname.
   - Serás redirigido a la sala en tiempo real.
   - Si la sala es multimedia, podrás adjuntar y enviar archivos (PNG, JPEG, PDF, etc.) de hasta 10MB.
   - Puedes abrir múltiples pestañas o navegadores para simular varios usuarios chateando simultáneamente.

---

## 🛡️ Seguridad Implementada

- **Criptografía de PINs:** Almacenamiento en base de datos usando un digest **SHA-256** (para búsquedas optimizadas O(1)) y validación final segura con **BCrypt** (protección contra colisiones).
- **Control de Acceso (WebSocket):** El servidor verifica que el `nickname` que intenta enviar un mensaje a través de STOMP realmente pertenezca a la sala (`RoomService.isMember()`), evitando falsificación de identidad (spoofing).
- **Manejo de Sesiones:** Cookie-based `deviceId` para asegurar que un dispositivo/pestaña no ocupe más de un usuario a la vez, con auto-limpieza al cambiar de sala.
- **Validación Multimedia:** Restricción por tipo MIME (`Content-Type`) configurado desde `.env`, no confiando solo en la extensión del archivo. Las salas de `TEXTO` bloquean uploads a nivel de backend.

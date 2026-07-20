# 🚀 Guía de Despliegue y Ejecución - UrbanFlow

Esta guía detalla los pasos para compilar, levantar y ejecutar el proyecto **UrbanFlow (Smart Parking System)** completo (Backend Microservicios + Kong API Gateway + Frontend Angular) en cualquier sistema operativo (**Linux, Windows o macOS**).

---

## 📋 Requisitos Previos

Antes de iniciar, asegúrate de contar con los siguientes programas instalados en tu equipo:

1. **Git** (Para clonar el repositorio).
2. **Docker Desktop** (en Windows/macOS) o **Docker Engine + Docker Compose** (en Linux).
3. **Node.js >= 22.x** y **npm** *(Opcional, solo si deseas ejecutar el Frontend Angular en modo desarrollo local).*

> [!IMPORTANT]
> Verificación rápida de instalación en tu terminal:
> ```bash
> docker --version
> docker compose version
> node -v
> ```

---

## 💻 Paso 1: Obtener el Código Fuente

Clona el repositorio e ingresa a la rama de desarrollo del Frontend:

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Entrar a la carpeta del proyecto
cd Proyecto

# Asegurarse de estar en la rama del frontend
git checkout ParkingAppP3FrontEnd
```

---

## 🐳 Método 1: Ejecución Completa con Docker (Recomendado)

Este método levanta los **15 contenedores** aislados en background (Bases de datos PostgreSQL, RabbitMQ, Microservicios FastAPI / NestJS / Spring Boot, Kong API Gateway y el Frontend Angular en Nginx).

### 1️⃣ Levantar todos los servicios

Abre una terminal en la carpeta principal del proyecto (`Proyecto/`) y ejecuta:

#### En Linux / macOS / Windows (Bash o PowerShell):
```bash
docker compose up --build -d
```

> 💡 *En versiones antiguas de Docker Compose, el comando equivalente es `docker-compose up --build -d`.*

### 2️⃣ Verificar que los contenedores estén activos

```bash
docker ps
```

Deberás ver activos los 15 servicios principales, incluyendo `frontend_angular_app`, `api_gateway_seguro`, `usuarios_api`, `tickets_api`, `vehiculos_app`, `zonas_app`, `asignaciones_app`, `audit_app`, `rabbitmq-audit` y las 6 bases de datos PostgreSQL.

### 🌐 Puertos y URLs de Acceso

Una vez levantado el entorno, accede a través de tu navegador:

| Servicio | URL de Acceso | Descripción |
| :--- | :--- | :--- |
| 📱 **Frontend Angular** | **[http://localhost:4200](http://localhost:4200)** | Interfaz gráfica moderna (Clean Architecture) |
| 🌐 **Kong API Gateway** | **[http://localhost:9000](http://localhost:9000)** | Punto de entrada seguro para las APIs |
| 🖥️ **Dashboard Clásico** | **[http://localhost:8070](http://localhost:8070)** | Interfaz de respaldo minimalista |
| 🐇 **RabbitMQ Admin** | **[http://localhost:15672](http://localhost:15672)** | Panel de gestión de eventos (User: `guest` / Pass: `guest`) |

---

## 🛠️ Método 2: Modo Desarrollo (Backend en Docker + Frontend Angular Local)

Si eres desarrollador y deseas modificar el código del Frontend Angular recibiendo **Hot Reload** (recarga en vivo automática al guardar cambios):

### 1️⃣ Iniciar solo el Backend en Docker

```bash
cd Proyecto
docker compose up -d
```

### 2️⃣ Detener el contenedor Docker del Frontend (para evitar conflicto en el puerto 4200)

```bash
docker compose stop frontend-angular
```

### 3️⃣ Iniciar el servidor de desarrollo local del Frontend

```bash
cd frontend-angular

# Instalar dependencias
npm install

# Iniciar servidor local
npm start
```

Navega a **[http://localhost:4200](http://localhost:4200)**. Cada cambio que guardes en los archivos `.ts`, `.html` o `.css` se reflejará al instante.

---

## 🔐 Credenciales de Acceso Sembradas

El sistema cuenta con datos iniciales listos para probar:

| Rol | Usuario / Correo | Contraseña | Privilegios |
| :--- | :--- | :--- | :--- |
| **Root (Superusuario)** | `root`<br>`root@parqueadero.com` | `rootpassword123` | Privilegios totales (Administración RBAC) |
| **Administrador** | `janarvaez`<br>`admin.jordan@parqueadero.com` | `adminpassword123` | Gestión de plazas, zonas y roles |
| **Cliente 1** | `jcperez`<br>`cliente.juan@parqueadero.com` | `clientepassword123` | Consulta de espacios de parqueadero |
| **Cliente 2** | `melopez`<br>`cliente.maria@parqueadero.com` | `clientepassword123` | Consulta de espacios de parqueadero |

---

## 🖥️ Notas Específicas por Sistema Operativo

### 🐧 En Linux (Ubuntu / Debian / Fedora)
Si encuentras errores de permisos al ejecutar Docker sin `sudo`, añade tu usuario al grupo `docker`:
```bash
sudo usermod -aG docker $USER
# Reinicia tu sesión para aplicar el cambio
```

### 🪟 En Windows (10 / 11)
* Se recomienda utilizar **Docker Desktop con WSL 2 Backend** (Windows Subsystem for Linux).
* Puedes ejecutar los comandos desde **PowerShell**, **Command Prompt (CMD)** o la terminal de **Git Bash**.

### 🍎 En macOS (Intel / Apple Silicon M1/M2/M3)
* Asegúrate de tener **Docker Desktop para Mac** abierto e iniciado antes de ejecutar los comandos en la Terminal.
* Las imágenes multi-etapa se compilan automáticamente para arquitectura ARM64/x86_64 sin configuración adicional.

---

## ⚙️ Comandos Útiles de Mantenimiento

* **Ver logs de un microservicio específico**:
  ```bash
  docker compose logs -f usuarios-api
  ```
* **Detener todos los servicios**:
  ```bash
  docker compose down
  ```
* **Detener y borrar bases de datos (Reinicio limpio)**:
  ```bash
  docker compose down -v
  ```
* **Reconstruir un contenedor específico después de cambios**:
  ```bash
  docker compose up -d --build frontend-angular
  ```

# 🚀 Guía Completa de Despliegue y Ejecución - UrbanFlow

Esta guía detalla los pasos para compilar, desplegar y ejecutar el sistema distribuido **UrbanFlow (Smart Parking System)** tanto en **Kubernetes (Minikube + Ingress + Kong API Gateway)** como **sin Kubernetes (Docker Compose)**. 

Compatible con **Linux, macOS y Windows**.

---

# 🚀 OPCIÓN 1: Despliegue en Kubernetes (Minikube + Ingress + Kong)

Esta opción despliega el sistema distribuido completo (17 Pods: Microservicios, Bases de Datos PostgreSQL con persisencia PVC, RabbitMQ, Kong API Gateway y Frontend Angular) expuesto al exterior mediante un recurso **Ingress** con el dominio local `http://parqueo-espe.local`.

---

## 📋 Requisitos Previos

Asegúrate de contar con los siguientes programas instalados en tu sistema operativo:
1. **Docker Desktop** (Windows/macOS) o **Docker Engine** (Linux).
2. **Minikube** (v1.30+).
3. **kubectl** (v1.26+).

---

## 🛠️ Pasos de Despliegue en Kubernetes

### Paso 1: Iniciar Minikube
Abre una terminal y ejecuta:

```bash
minikube start
```

---

### Paso 2: Configurar la terminal para usar el demonio Docker de Minikube

Este paso permite compilar las imágenes directamente en la memoria interna de Minikube sin necesidad de subirlas a un registro público (`Docker Hub`).

* **En Linux / macOS (Bash / Zsh):**
  ```bash
  eval $(minikube docker-env)
  ```
* **En Windows (PowerShell):**
  ```powershell
  minikube docker-env | Invoke-Expression
  ```
* **En Windows (Command Prompt / CMD):**
  ```cmd
  @FOR /f "tokens=*" %i IN ('minikube -p minikube docker-env --shell cmd') DO @%i
  ```

---

### Paso 3: Construir las imágenes Docker de los Microservicios
Ejecuta los siguientes comandos desde la raíz del proyecto (`Proyecto/`):

```bash
docker build -t auth-service:latest ./backend/auth-service
docker build -t parking-service:latest ./backend/parking-service
docker build -t ticket-service:latest ./backend/ticket-service
docker build -t billing-service:latest ./backend/billing-service
docker build -t notification-service:latest ./backend/notification-service
docker build -t vehiculos-service:latest ./backend/vehiculos
docker build -t asignacion-service:latest ./backend/asignacion-trazabilidad
docker build -t api-gateway:latest ./gateway
docker build -t frontend-angular:latest ./frontend
```

---

### Paso 4: Desplegar todo en Kubernetes
Ejecuta un solo comando desde la raíz del proyecto (`Proyecto/`):

```bash
kubectl apply -k .
```

Este comando creará automáticamente el namespace `floresguamanmoralesnarvaez` y desplegará en orden idempotente:
1. Bases de Datos PostgreSQL con persisencia (PVCs).
2. Broker de mensajes RabbitMQ.
3. Microservicios backend (Auth, Parking, Tickets, Billing, Notification, Vehículos, Asignaciones).
4. Kong API Gateway.
5. Frontend Angular.
6. Recurso Ingress con anotaciones SSE sin buffering.

---

### Paso 5: Habilitar el Addon de Ingress en Minikube

```bash
minikube addons enable ingress
```

Verifica que los Pods estén listos (`1/1 Running`):

```bash
# Pods de la aplicación
kubectl get pods -n floresguamanmoralesnarvaez

# Pods del Ingress Controller
kubectl get pods -n ingress-nginx
```

---

### Paso 6: Configurar el Dominio Local `parqueo-espe.local`

Obtén la IP interna de Minikube:

```bash
minikube ip
```

Agrega la entrada al archivo de hosts de tu sistema operativo:

* **En Linux / macOS:**
  ```bash
  echo "$(minikube ip) parqueo-espe.local" | sudo tee -a /etc/hosts
  ```
* **En Windows (Ejecutar PowerShell como Administrador):**
  ```powershell
  Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "$((minikube ip).Trim()) parqueo-espe.local"
  ```

---

### Paso 7: Acceso a la Aplicación
Abre en tu navegador web:

👉 **[http://parqueo-espe.local](http://parqueo-espe.local)**

---

### 🧹 Limpieza en Kubernetes
Para eliminar todo el despliegue del clúster:

```bash
kubectl delete -k .
```

---
---

# 🐳 OPCIÓN 2: Despliegue Sin Kubernetes (Docker Compose)

Esta opción permite levantar todo el sistema en contenedores aislados mediante **Docker Compose** en un solo comando, ideal para desarrollo local o pruebas rápidas.

---

## 📋 Requisitos Previos

1. **Git**
2. **Docker Engine / Docker Desktop** (v24+) con **Docker Compose** (v2+).

---

## 🛠️ Pasos de Despliegue con Docker Compose

### Paso 1: Ingresar a la carpeta del proyecto
```bash
cd Proyecto
```

### Paso 2: Levantar todos los contenedores
Ejecuta desde la raíz del proyecto (`Proyecto/`):

* **Linux / macOS / Windows (Docker Compose v2+):**
  ```bash
  docker compose up --build -d
  ```
* **En versiones antiguas (Docker Compose v1):**
  ```bash
  docker-compose up --build -d
  ```

---

### Paso 3: Verificar Contenedores Activos

```bash
docker ps
```
Deberás ver activos los **15 contenedores** principales (Bases de datos, RabbitMQ, Microservicios, Kong API Gateway y Frontend Angular).

---

### 🌐 URLs de Acceso en Modo Docker Compose

| Componente | Dirección / URL | Descripción |
| :--- | :--- | :--- |
| 📱 **Frontend Angular** | **[http://localhost:4200](http://localhost:4200)** | Interfaz Web Principal |
| 🌐 **Kong API Gateway** | **[http://localhost:9000](http://localhost:9000)** | Punto de entrada a las APIs REST |
| 🐇 **RabbitMQ Admin** | **[http://localhost:15672](http://localhost:15672)** | Panel de Control de Eventos (`guest` / `guest`) |

---

### ⚙️ Comandos Útiles de Mantenimiento Docker

* **Ver logs de un servicio específico**:
  ```bash
  docker compose logs -f api-gateway
  ```
* **Detener todos los servicios**:
  ```bash
  docker compose down
  ```
* **Detener y borrar bases de datos (Reinicio limpio)**:
  ```bash
  docker compose down -v
  ```

---
---

## 🔐 Credenciales de Prueba (Para Ambos Métodos)

El JWT incluye el rol del usuario en su payload (`role`). El Frontend Angular y el API Gateway adaptan la interfaz dinámicamente:

| Rol RBAC | Usuario | Contraseña | Privilegios |
| :--- | :--- | :--- | :--- |
| **ROOT** | `root` | `rootpassword123` | Administración total del sistema y superusuario |
| **ADMIN** | `janarvaez` | `adminpassword123` | Gestión de zonas, espacios de parqueo y roles |
| **CAJERO** | `cajero1` | `cajeropassword123` | Emisión y cobro de tickets de estacionamiento |
| **USUARIO** | `jcperez` | `clientepassword123` | Consulta de plazas libres y pago de tickets propios |

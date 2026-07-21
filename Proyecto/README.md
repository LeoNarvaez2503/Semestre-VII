# 🚀 Despliegue en Kubernetes (Minikube & Kong API Gateway) - UrbanFlow

Sistema distribuido de gestión de parqueadero con arquitectura de microservicios, API Gateway con Kong como único punto de entrada, bases de datos independientes por microservicio, comunicación asíncrona mediante RabbitMQ, autenticación centralizada JWT con control de acceso basado en roles (RBAC) y actualización en tiempo real con Server-Sent Events (SSE).

---

## 📌 1. Prerrequisitos

Asegúrate de contar con los siguientes componentes instalados en tu sistema:

* **Minikube** (v1.30+)
* **kubectl** (v1.26+)
* **Docker CLI** (v24+)

---

## 🛠️ 2. Flujo de Despliegue Completo (Un solo comando `kubectl apply -f .`)

### Paso 1: Iniciar Minikube y configurar el entorno de Docker
```bash
minikube start
eval $(minikube docker-env)
```

### Paso 2: Construir las imágenes de Docker de los microservicios
```bash
docker build -t auth-service:latest ./auth-service
docker build -t parking-service:latest ./parking-service
docker build -t ticket-service:latest ./ticket-service
docker build -t billing-service:latest ./billing-service
docker build -t notification-service:latest ./notification-service
docker build -t api-gateway:latest ./api-gateway
docker build -t frontend-angular:latest ./frontend-angular
```

### Paso 3: Desplegar TODO en Kubernetes con un solo comando
Ejecuta desde la raíz del proyecto (`Proyecto/`):
```bash
kubectl apply -f .
```

Este comando creará automáticamente el namespace `FloresGuamanMoralesNarvaez` (mediante `00-namespace.yml` y `kustomization.yaml`) y desplegará en orden idempotente:
1. Namespace `FloresGuamanMoralesNarvaez`
2. Bases de datos PostgreSQL (`auth-db`, `parking-db`, `ticket-db`, `billing-db`, `notification-db`) con sus PVCs
3. RabbitMQ con PVC para colas y eventos asíncronos
4. Microservicios (`auth-service`, `parking-service`, `ticket-service`, `billing-service`, `notification-service`)
5. API Gateway Kong como punto de entrada único
6. Frontend Angular SPA

### Paso 4: Iniciar el túnel de Minikube para exponer los servicios
```bash
minikube tunnel
```

---

## 🌐 3. Acceso al Sistema

Toda la comunicación externa ingresa a través del API Gateway de Kong.

| Componente | Dirección / URL | Descripción |
| :--- | :--- | :--- |
| 📱 **Frontend SPA Angular** | `http://localhost:9000/` | Interfaz Web Adaptativa por Roles (Clean Architecture) |
| 🌐 **Kong API Gateway** | `http://localhost:9000` | Único Punto de Entrada para APIs y Frontend |
| 🐇 **RabbitMQ Management** | `http://localhost:15672` | Panel de Control de Eventos (User: `guest` / Pass: `guest`) |

---

## 🔐 4. Credenciales de Prueba por Rol (Control de Acceso RBAC)

El JWT incluye el rol del usuario en su payload (`role`). El Frontend Angular y el API Gateway adaptan la interfaz y permisos dinámicamente según el rol:

| Rol RBAC | Usuario | Contraseña | Comportamiento en Frontend | Privilegios |
| :--- | :--- | :--- | :--- | :--- |
| **ROOT** | `root` | `rootpassword123` | Botón **"Cobrar"** en tickets | Administración total del sistema y superusuario |
| **ADMIN** | `janarvaez` | `adminpassword123` | Botón **"Cobrar"** en tickets | Gestión de zonas, espacios de parqueo y roles |
| **CAJERO** | `cajero1` | `cajeropassword123` | Botón **"Cobrar"** en tickets | Emisión y cobro de tickets de estacionamiento |
| **USUARIO** | `jcperez` | `clientepassword123` | Botón **"Pagar"** en tickets | Consulta de plazas libres y pago de tickets propios |

---

## ⚡ 5. Verificación de SSE (Server-Sent Events) en Tiempo Real

El sistema utiliza **Server-Sent Events (SSE)** en lugar de polling HTTP para la actualización de plazas y tickets en el mapa del parqueadero.

Para verificar que la conexión SSE está emitiendo eventos sin polling:

```bash
# Probar el stream de eventos SSE a través de Kong API Gateway:
curl -N http://localhost:9000/tickets/stream
```

Respuesta esperada en consola (stream continuo mantenido por el servidor):
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

event: espacios
data: {"id": "E-101", "estado": "OCUPADO", "vehiculoId": "PDF-9876", "timestamp": "2026-07-21T18:00:00Z"}
```

El Frontend Angular escucha directamente este endpoint a través de `SpaceSseService` sin realizar llamadas repetitivas de polling (`setInterval`/`HTTP GET`).

---

## 🛡️ 6. Arquitectura y Restricciones Cumplidas

* **Namespace Unificado:** Todos los recursos se despliegan bajo el namespace `FloresGuamanMoralesNarvaez`.
* **Aislamiento de Red:** Los microservicios backend no están expuestos al exterior; todo el tráfico transita obligatoriamente por Kong.
* **Resiliencia & Health Checks:** Todos los Deployments cuentan con `livenessProbe` y `readinessProbe` configurados.
* **Persistencia:** Las bases de datos y RabbitMQ utilizan `PersistentVolumeClaim` (PVC) para garantizar la integridad de los datos.
* **Seguridad & Sanitización:** Los inputs (PLACA, montos, UUIDs, credenciales) son validados y sanitizados (XSS, SQLi). Se suprimen los stack traces en las respuestas de error.

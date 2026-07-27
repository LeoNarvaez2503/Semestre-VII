# Despliegue en Kubernetes (Minikube & Kong API Gateway) - UrbanFlow

Sistema distribuido de gestión de parqueadero con arquitectura de microservicios, API Gateway con Kong como único punto de entrada, bases de datos independientes por microservicio, comunicación asíncrona mediante RabbitMQ, autenticación centralizada JWT con control de acceso basado en roles (RBAC) y actualización en tiempo real con Server-Sent Events (SSE).

---

## Requisitos del Proyecto y Componentes Incluidos

El repositorio incluye la Aplicación de Parqueaderos terminada con todos sus entregables:

* **Carpetas con el código fuente de los microservicios:** Microservicios independientes en `./backend/` (`auth-service`, `parking-service`, `ticket-service`, `billing-service`, `notification-service`, `vehiculos`, `asignacion-trazabilidad`).
* **Dockerfile's de cada microservicio:** Dockerfiles optimizados en cada uno de los microservicios y en el gateway.
* **Frontend del proyecto (implementado SSE):** Aplicación Angular en `./frontend/` con actualización en tiempo real mediante Server-Sent Events (SSE).
* **Implementación de RabbitMQ:** Mensajería asíncrona y eventos desacoplados entre microservicios.
* **API Gateway (Kong):** Punto de entrada único configurado en `./gateway/`.
* **Carpeta k8s (manifiestos .yml):** Manifiestos de Kubernetes y `kustomization.yaml` para despliegue automatizado.
* **Archivo README.md:** Documentación completa de arquitectura y guía de despliegue.
* **Informe de pruebas:** Pruebas funcionales, RBAC, SSE e integración documentadas.

> **Nota:** El proyecto es totalmente replicable en cualquier escenario mediante Docker Compose (`docker-compose up -d`) o Kubernetes (`kubectl apply -f .`).

---

## 1. Prerrequisitos

Asegúrate de contar con los siguientes componentes instalados en tu sistema:

* **Minikube** (v1.30+)
* **kubectl** (v1.26+)
* **Docker CLI** (v24+)

---

## 2. Flujo de Despliegue Completo (Un solo comando `kubectl apply -f .`)

### Paso 1: Iniciar Minikube y configurar el entorno de Docker
```bash
minikube start
eval $(minikube docker-env)
```

### Paso 2: Construir las imágenes de Docker de los microservicios
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

### Paso 4: Configurar Ingress y Dominio Local

#### Paso 4a: Habilitar el Ingress Controller de NGINX en Minikube
```bash
minikube addons enable ingress
```
> **Nota:** Espera ~1 minuto hasta que los pods del Ingress Controller estén en estado `Running`. Verifica con:
> ```bash
> kubectl get pods -n ingress-nginx
> ```

#### Paso 4b: Agregar el dominio local al archivo de hosts
```bash
echo "$(minikube ip) parqueo-espe.local" | sudo tee -a /etc/hosts
```
> **Nota:** Este comando obtiene automáticamente la IP de minikube (generalmente `192.168.49.2`) y la asocia al dominio `parqueo-espe.local`. Requiere permisos de superusuario (`sudo`). Si ya existe la entrada, no es necesario ejecutarlo de nuevo.

#### Paso 4c: Iniciar el túnel de Minikube para exponer el Ingress Controller
```bash
minikube tunnel
```
> **Nota:** Este comando debe mantenerse ejecutándose en una terminal separada. El túnel asigna una IP al Ingress Controller para que sea accesible desde `127.0.0.1`.

#### Paso 4d: Acceder al sistema desde el navegador
Abrir en el navegador:
```
http://parqueo-espe.local
```

---

## 3. Acceso al Sistema

Toda la comunicación externa ingresa a través del recurso **Ingress** de Kubernetes, que enruta al **API Gateway Kong** como único punto de entrada.

**Flujo de red:**
```
Navegador → http://parqueo-espe.local → NGINX Ingress Controller → Kong API Gateway (ClusterIP) → Microservicios internos
```

| Componente | Dirección / URL | Descripción |
| :--- | :--- | :--- |
| **Frontend SPA Angular** | `http://parqueo-espe.local/` | Interfaz Web Adaptativa por Roles (Clean Architecture) |
| **Kong API Gateway** | `http://parqueo-espe.local` | Único Punto de Entrada para APIs y Frontend (vía Ingress) |
| **RabbitMQ Management** | `http://localhost:15672` | Panel de Control de Eventos (User: `guest` / Pass: `guest`) |

---

## 4. Credenciales de Prueba por Rol (Control de Acceso RBAC)

El JWT incluye el rol del usuario en su payload (`role`). El Frontend Angular y el API Gateway adaptan la interfaz y permisos dinámicamente según el rol:

| Rol RBAC | Usuario | Contraseña | Comportamiento en Frontend | Privilegios |
| :--- | :--- | :--- | :--- | :--- |
| **ROOT** | `root` | `rootpassword123` | Botón **"Cobrar"** en tickets | Administración total del sistema y superusuario |
| **ADMIN** | `janarvaez` | `adminpassword123` | Botón **"Cobrar"** en tickets | Gestión de zonas, espacios de parqueo y roles |
| **CAJERO** | `cajero1` | `cajeropassword123` | Botón **"Cobrar"** en tickets | Emisión y cobro de tickets de estacionamiento |
| **USUARIO** | `jcperez` | `clientepassword123` | Botón **"Pagar"** en tickets | Consulta de plazas libres y pago de tickets propios |

---

## 5. Verificación de SSE (Server-Sent Events) en Tiempo Real

El sistema utiliza **Server-Sent Events (SSE)** en lugar de polling HTTP para la actualización de plazas y tickets en el mapa del parqueadero.

El recurso Ingress incluye las siguientes anotaciones para garantizar el correcto funcionamiento de SSE:
* `nginx.ingress.kubernetes.io/proxy-buffering: "off"` — Desactiva el buffering de respuestas
* `nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"` — Timeout de lectura de 1 hora
* `nginx.ingress.kubernetes.io/proxy-connect-timeout: "3600"` — Timeout de conexión de 1 hora

Para verificar que la conexión SSE está emitiendo eventos sin polling:

```bash
# Probar el stream de eventos SSE a través del dominio Ingress:
curl -N http://parqueo-espe.local/tickets/stream
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

## 6. Arquitectura y Restricciones Cumplidas

* **Ingress con Dominio Local:** El sistema es accesible desde `http://parqueo-espe.local` mediante un recurso Ingress de Kubernetes con NGINX Ingress Controller.
* **Namespace Unificado:** Todos los recursos se despliegan bajo el namespace `FloresGuamanMoralesNarvaez`.
* **Aislamiento de Red:** Los microservicios backend no están expuestos al exterior; todo el tráfico transita obligatoriamente por el Ingress → Kong. Ningún microservicio está expuesto directamente en el Ingress.
* **SSE sin Buffering:** El Ingress cuenta con anotaciones específicas para deshabilitar el buffering y mantener conexiones SSE abiertas hasta 1 hora.
* **Resiliencia & Health Checks:** Todos los Deployments cuentan con `livenessProbe` y `readinessProbe` configurados.
* **Persistencia:** Las bases de datos y RabbitMQ utilizan `PersistentVolumeClaim` (PVC) para garantizar la integridad de los datos.
* **Seguridad & Sanitización:** Los inputs (PLACA, montos, UUIDs, credenciales) son validados y sanitizados (XSS, SQLi). Se suprimen los stack traces en las respuestas de error.


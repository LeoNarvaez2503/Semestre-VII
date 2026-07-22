# 🚀 Guía Rápida de Despliegue en Kubernetes (Minikube) - UrbanFlow

Esta guía contiene la lista exacta de comandos necesarios para levantar y desplegar todo el sistema **UrbanFlow** en Kubernetes local (Minikube) utilizando los manifiestos optimizados.

---

## 📋 1. Iniciar Minikube

Abre una terminal PowerShell como Administrador e inicia Minikube asignando 4GB de RAM y 2 CPUs:

```powershell
minikube start --driver=docker --memory=4096 --cpus=2
```

---

## 🔗 2. Conectar Docker al Daemon de Minikube

Este paso es **indispensable** para que las imágenes creadas localmente estén disponibles directamente dentro del cluster sin necesidad de subirlas a Docker Hub:

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

---

## 🏗️ 3. Construir las Imágenes Docker

Compila las 7 imágenes en el daemon de Minikube (ejecutar desde la carpeta `Proyecto/`):

```powershell
# Cambiar al directorio del proyecto si no estás en él
cd Proyecto

# Construir imágenes de microservicios
docker build -t auth-service:latest ./auth-service/
docker build -t parking-service:latest ./parking-service/
docker build -t ticket-service:latest ./ticket-service/
docker build -t billing-service:latest ./billing-service/
docker build -t notification-service:latest ./notification-service/
docker build -t api-gateway:latest ./api-gateway/
docker build -t frontend-angular:latest ./frontend-angular/
```

---

## 🚀 4. Desplegar todo el Stack en Kubernetes

Aplica la configuración completa (Namespace, ConfigMaps, Secrets, PVCs, Services y Deployments) con Kustomize:

```powershell
kubectl apply -k .
```

---

## 🔍 5. Verificar el Estado del Despliegue

Revisa que los **13 pods** estén en estado `1/1 READY / Running`:

```powershell
# Ver pods en tiempo real
kubectl get pods -n floresguamanmoralesnarvaez -w

# Ver consumo real de CPU y Memoria (Optimizados)
kubectl top pods -n floresguamanmoralesnarvaez
```

---

## 🌐 6. Acceder a las Aplicaciones (Port Forwarding)

Abre los puertos en tu maquina local para acceder a las URLs principales:

```powershell
# Exponer Frontend Angular (http://localhost:4200)
kubectl port-forward svc/frontend-angular -n floresguamanmoralesnarvaez 4200:80

# Exponer Kong API Gateway (http://localhost:9000)
kubectl port-forward svc/api-gateway -n floresguamanmoralesnarvaez 9000:9000 8001:8001

# Exponer Panel RabbitMQ (http://localhost:15672)
kubectl port-forward svc/rabbitmq -n floresguamanmoralesnarvaez 15672:15672
```

> 💡 **Alternativa rápida con Minikube:**
> ```powershell
> minikube service api-gateway -n floresguamanmoralesnarvaez
> ```

---

## 🧹 7. Comandos de Limpieza / Reinicio Limpio

Si necesitas eliminar todo el despliegue para redeclarar desde cero:

```powershell
# Eliminar el namespace y todos sus recursos
kubectl delete namespace floresguamanmoralesnarvaez

# Re-aplicar despliegue limpio
kubectl apply -k .
```

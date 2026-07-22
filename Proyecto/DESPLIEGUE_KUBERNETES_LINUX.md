# 🚀 Guía Rápida de Despliegue en Kubernetes (Minikube) para Linux (Bash / Zsh) - UrbanFlow

Esta guía contiene los comandos formateados para **Linux (Bash/Zsh)** para levantar todo el sistema **UrbanFlow** en Kubernetes local (Minikube).

---

## 📋 1. Iniciar Minikube

```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

---

## 🔗 2. Conectar Docker al Daemon de Minikube

Configura tu terminal Bash/Zsh para enviar los comandos de Docker directamente al daemon dentro de Minikube:

```bash
eval $(minikube -p minikube docker-env)
```

---

## 🏗️ 3. Construir las Imágenes Docker

Navega a la carpeta del proyecto y compila las 7 imágenes:

```bash
cd Proyecto

docker build -t auth-service:latest ./auth-service/
docker build -t parking-service:latest ./parking-service/
docker build -t ticket-service:latest ./ticket-service/
docker build -t billing-service:latest ./billing-service/
docker build -t notification-service:latest ./notification-service/
docker build -t api-gateway:latest ./api-gateway/
docker build -t frontend-angular:latest ./frontend-angular/
```

---

## 🚀 4. Desplegar todo en Kubernetes

Aplica todos los manifiestos optimizados con Kustomize:

```bash
kubectl apply -k .
```

---

## 🔍 5. Verificar el Estado del Despliegue

```bash
# Ver pods en tiempo real
kubectl get pods -n floresguamanmoralesnarvaez -w

# Ver consumo real de recursos (CPU / Memoria)
kubectl top pods -n floresguamanmoralesnarvaez
```

---

## 🌐 6. Acceder a las Aplicaciones

En Linux puedes redirigir los puertos o usar el túnel de Minikube:

### Opción A: Port Forwarding en segundo plano (Recomendado)
```bash
# Frontend Angular (http://localhost:4200)
kubectl port-forward svc/frontend-angular -n floresguamanmoralesnarvaez 4200:80 &

# Kong API Gateway (http://localhost:9000)
kubectl port-forward svc/api-gateway -n floresguamanmoralesnarvaez 9000:9000 8001:8001 &

# RabbitMQ Panel (http://localhost:15672)
kubectl port-forward svc/rabbitmq -n floresguamanmoralesnarvaez 15672:15672 &
```

### Opción B: Túnel de Minikube Directo
```bash
minikube service api-gateway -n floresguamanmoralesnarvaez
```

---

## 🧹 7. Reiniciar o Borrar todo

```bash
# Destruir namespace y redeplegar limpio
kubectl delete namespace floresguamanmoralesnarvaez
kubectl apply -k .
```

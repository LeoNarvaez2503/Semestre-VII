# Comandos de Instalación de Kubernetes (Minikube + kubectl)
## Paso a paso para Windows y Linux

---

## 🪟 Windows 11

### 1. Requisitos previos
- Virtualización habilitada en BIOS (VT-x/AMD-V)
- PowerShell como administrador
- Docker Desktop, WSL2 o Hyper-V instalado

### 2. Instalar Minikube

```powershell
winget install Kubernetes.minikube
```

o con Chocolatey:

```powershell
choco install minikube
```

### 3. Instalar kubectl

```powershell
winget install -e --id Kubernetes.kubectl
```

o con Chocolatey:

```powershell
choco install kubernetes-cli -y
```

### 4. Verificar instalaciones

```powershell
minikube version
kubectl version --client
```

### 5. Iniciar el clúster

```powershell
minikube start --driver=docker
```

### 6. Verificar el clúster

```powershell
kubectl get nodes
```

Salida esperada: `NAME  STATUS  ROLES  AGE  VERSION` con el nodo en estado `Ready`.

### 7. Dashboard (opcional)

```powershell
minikube dashboard
```

### 8. Deploy de prueba

```powershell
kubectl create deployment hello-world --image=kicbase/echo-server:1.0
kubectl expose deployment hello-world --type=NodePort --port=8080
kubectl get services hello-world
kubectl port-forward service/hello-world 7080:8080
```

Verificar en: `http://localhost:7080`

### 9. Limpiar

```powershell
minikube delete --all
```

---

## 🐧 Linux (Ubuntu/Debian como referencia)

### 1. Requisitos previos

```bash
# Verificar virtualización habilitada
egrep -c '(vmx|svm)' /proc/cpuinfo
```

Si el resultado es `0`, la virtualización no está activa.

### 2. Instalar Docker (driver recomendado)

```bash
sudo apt update
sudo apt install -y docker.io
sudo usermod -aG docker $USER && newgrp docker
```

### 3. Instalar Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### 4. Instalar kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### 5. Verificar instalaciones

```bash
minikube version
kubectl version --client
```

### 6. Iniciar el clúster

```bash
minikube start --driver=docker
```

### 7. Verificar el clúster

```bash
kubectl get nodes
```

### 8. Dashboard (opcional)

```bash
minikube dashboard
```

### 9. Deploy de prueba

```bash
kubectl create deployment hello-world --image=kicbase/echo-server:1.0
kubectl expose deployment hello-world --type=NodePort --port=8080
kubectl get services hello-world
kubectl port-forward service/hello-world 7080:8080
```

Verificar en: `http://localhost:7080`

### 10. Limpiar

```bash
minikube delete --all
```

---

## ✅ Verificaciones adicionales comunes (ambos SO)

```bash
kubectl cluster-info
kubectl get pods -A
kubectl get svc -A
docker ps          # ver que el contenedor de minikube esté corriendo
```

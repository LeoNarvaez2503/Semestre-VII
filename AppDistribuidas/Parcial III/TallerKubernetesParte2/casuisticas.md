# Casuísticas adicionales para validar la persistencia y el funcionamiento de Kubernetes

---

## Caso 1. Eliminación del Pod de MongoDB (Persistencia)

### Objetivo

Comprobar que los datos no se pierden cuando Kubernetes recrea el Pod.

### Procedimiento

```bash
kubectl delete pod <pod-mongo> -n ejemplo
```

Esperar a que Kubernetes cree un nuevo Pod.

```bash
kubectl get pods -n ejemplo -w
```

Ingresar nuevamente a MongoDB.

```bash
kubectl exec -it -n ejemplo <nuevo-pod> -- mongosh
```

Consultar la información.

```javascript
use ejemplo
db.Tarea.find().pretty()
```

### Resultado esperado

Los datos continúan almacenados.

### Conclusión

El PVC mantiene la información incluso cuando el contenedor desaparece.

---

# Caso 2. Reinicio del Deployment de MongoDB

### Objetivo

Verificar que un reinicio controlado del Deployment no elimina los datos.

### Procedimiento

```bash
kubectl rollout restart deployment mongo -n ejemplo
```

Esperar que termine.

```bash
kubectl rollout status deployment mongo -n ejemplo
```

Ingresar nuevamente.

```javascript
use ejemplo
db.Tarea.find().pretty()
```

### Resultado esperado

La colección conserva todos los documentos.

---

# Caso 3. Reinicio completo de Minikube

### Objetivo

Verificar que los datos sobreviven al reinicio del clúster.

### Procedimiento

Detener Minikube.

```bash
minikube stop
```

Iniciar nuevamente.

```bash
minikube start
```

Consultar los Pods.

```bash
kubectl get pods -n ejemplo
```

Entrar nuevamente a MongoDB.

### Resultado esperado

La información sigue existiendo.

---

# Caso 4. Escalamiento del Backend

### Objetivo

Comprobar que múltiples réplicas utilizan la misma base de datos.

### Procedimiento

Escalar el backend.

```bash
kubectl scale deployment backend --replicas=4 -n ejemplo
```

Verificar.

```bash
kubectl get pods -n ejemplo
```

Crear nuevas tareas desde el Frontend.

Consultar Mongo.

```javascript
db.Tarea.find().pretty()
```

### Resultado esperado

Todas las réplicas almacenan información en la misma base de datos.

---

# Caso 5. Escalamiento del Frontend

### Objetivo

Comprobar el balanceo de carga del Service.

### Procedimiento

```bash
kubectl scale deployment frontend --replicas=3 -n ejemplo
```

Verificar.

```bash
kubectl get pods -n ejemplo
```

### Resultado esperado

La aplicación continúa funcionando sin interrupciones.

---

# Caso 6. Eliminación del Backend

### Objetivo

Comprobar la autorrecuperación del Deployment.

### Procedimiento

```bash
kubectl delete pod <pod-backend> -n ejemplo
```

### Resultado esperado

Kubernetes crea automáticamente otro Pod.

---

# Caso 7. Eliminación del Frontend

### Objetivo

Comprobar la disponibilidad del servicio.

### Procedimiento

```bash
kubectl delete pod <pod-frontend> -n ejemplo
```

### Resultado esperado

El Deployment crea otro Pod automáticamente.

---

# Caso 8. Inserción de nuevos datos

### Objetivo

Verificar que la aplicación almacena correctamente nuevos registros.

### Procedimiento

Crear una tarea desde la interfaz web.

Consultar Mongo.

```javascript
db.Tarea.find().pretty()
```

### Resultado esperado

Debe aparecer un nuevo documento.

---

# Caso 9. Actualización de datos

### Objetivo

Verificar modificaciones.

### Procedimiento

Modificar una tarea desde la aplicación.

Consultar nuevamente.

```javascript
db.Tarea.find().pretty()
```

### Resultado esperado

El documento refleja los cambios.

---

# Caso 10. Eliminación de datos

### Objetivo

Verificar operaciones DELETE.

### Procedimiento

Eliminar una tarea desde el Frontend.

Consultar Mongo.

```javascript
db.Tarea.find().pretty()
```

### Resultado esperado

El documento eliminado ya no aparece.

---

# Caso 11. Verificación del PVC

### Procedimiento

```bash
kubectl get pvc -n ejemplo
```

Resultado esperado.

```text
STATUS: Bound
```

---

# Caso 12. Verificación del PV

```bash
kubectl get pv
```

Resultado esperado.

```text
STATUS: Bound
```

---

# Caso 13. Verificación del montaje del volumen

```bash
kubectl describe pod <pod-mongo> -n ejemplo
```

Buscar.

```text
Volumes:
PersistentVolumeClaim
ClaimName: mongo-pvc
```

---

# Caso 14. Verificación mediante Dashboard

Entrar al Dashboard.

```bash
minikube dashboard
```

Comprobar:

- Deployment Mongo
- Deployment Backend
- Deployment Frontend
- Services
- PVC
- Pods
- Eventos

---

# Caso 15. Verificación de Logs del Backend

```bash
kubectl logs -f deployment/backend -n ejemplo
```

Crear una nueva tarea desde el navegador.

Resultado esperado.

```text
POST /tareas
Mongo Connected
Documento insertado
```

---

# Caso 16. Verificación del consumo de recursos

```bash
kubectl top pods -n ejemplo
```

Permite observar CPU y memoria utilizados por Mongo, Backend y Frontend.

---

# Caso 17. Comprobación del Ingress

```bash
kubectl get ingress -n ejemplo
```

Resultado esperado.

```text
frontend.io
backend.io
```

Abrir la aplicación mediante el dominio configurado.

---

# Caso 18. Simulación de fallo de MongoDB

Eliminar el Pod.

```bash
kubectl delete pod <pod-mongo> -n ejemplo
```

Mientras el nuevo Pod inicia:

- El Backend puede devolver errores de conexión.
- Una vez Mongo esté nuevamente disponible, el Backend vuelve a funcionar sin intervención manual.

---

# Caso 19. Verificación de la recuperación automática

```bash
kubectl get deployments -n ejemplo
```

Resultado esperado.

```text
AVAILABLE = DESIRED
```

Todos los Deployments recuperan automáticamente sus Pods.

---

# Caso 20. Eliminación del clúster

```bash
minikube delete
```

**Observación**

Este comando elimina completamente el clúster local, incluyendo los PersistentVolumes creados por Minikube. Al crear un clúster nuevo, los datos ya no estarán disponibles.

**Conclusión**

Un PVC garantiza persistencia mientras el almacenamiento físico permanezca disponible. Si el clúster y sus volúmenes son eliminados por completo, también se pierde la información.
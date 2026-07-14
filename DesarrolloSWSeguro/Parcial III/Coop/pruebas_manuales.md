# Guía de Pruebas Manuales de Seguridad (Hardening)

Esta guía detalla los pasos para validar localmente que las configuraciones de seguridad y endurecimiento (Hardening) programadas en el entorno Docker de **Mushuc Runa** están activas y funcionando correctamente.

---

## Prueba 1: Ocultamiento de la Versión del Servidor

Esta prueba confirma que ningún atacante externo puede conocer qué versión exacta de software usas mediante las cabeceras HTTP de respuesta.

### Paso A: Verificar el Frontend (Nginx)
Ejecuta el siguiente comando en la terminal para obtener únicamente las cabeceras HTTP del frontend:
```bash
curl -I http://localhost:3000
```
* **Resultado esperado**: En la cabecera `Server`, debe mostrarse únicamente `Server: nginx` sin números de versión (por ejemplo, **no** debe aparecer `Server: nginx/1.25.1`).

### Paso B: Verificar el Backend (NestJS/Express)
Ejecuta el siguiente comando en la terminal:
```bash
curl -I http://localhost:4001/clientes
```
* **Resultado esperado**: En las cabeceras devueltas **no** debe existir la línea `X-Powered-By: Express`. Esta cabecera fue removida del bootstrap de la aplicación.

---

## Prueba 2: Límite del Tamaño de Request (Prevención de DoS)

Esta prueba asegura que el servidor rechace de forma inmediata peticiones con cuerpos de tamaño excesivo.

1. **Crear un archivo temporal grande (2MB)** usando PowerShell:
   ```powershell
   [io.file]::WriteAllBytes("large_file.json", [byte[]](1..2MB))
   ```
2. **Enviar el archivo grande al backend** a través de `curl`:
   ```bash
   curl -X POST http://localhost:4001/clientes -H "Content-Type: application/json" -d @large_file.json
   ```
3. **Resultado esperado**: El servidor debe responder con un error HTTP:
   `HTTP/1.1 413 Payload Too Large` (o similar indicando que el tamaño supera el límite de 1MB).
4. **Limpiar el archivo de prueba** ejecutando:
   ```powershell
   Remove-Item large_file.json
   ```

---

## Prueba 3: Hardening de Sockets y Puertos (Red)

Esta prueba comprueba que la base de datos está totalmente privada dentro de Docker y que los puertos abiertos solo escuchan localmente.

### Paso A: Acceso a la Base de Datos
Intenta conectarte a la base de datos PostgreSQL desde el host local (`localhost:5432`) utilizando cualquier herramienta de base de datos (DBeaver, pgAdmin) o la consola `psql`.
* **Resultado esperado**: La conexión debe fallar con error de "Conexión rechazada". El puerto `5432` ya no se expone a nivel de máquina host.

### Paso B: Enlace exclusivo a Localhost
Ejecuta este comando en tu terminal de PowerShell:
```powershell
netstat -ano | findstr -i "listening" | findstr "3000 4001 4002 4003"
```
* **Resultado esperado**: En la columna "Dirección local", los puertos asociados deben enlazarse estrictamente a `127.0.0.1` (o `[::1]`) y **no** a `0.0.0.0`. Esto confirma que las APIs y la web solo son accesibles desde tu máquina y no desde tu red WiFi/LAN.

---

## Prueba 4: Verificación de Usuario No-Root y Privilegios en Contenedores

### Paso A: Verificar usuario no-root en el Frontend
Comprueba qué usuario corre la ejecución de Nginx dentro del contenedor:
```bash
docker exec mushuc_runa_frontend whoami
```
* **Resultado esperado**: Debe retornar el usuario `nginx` o una ID numérica de usuario no privilegiado. **No** debe retornar `root`.

### Paso B: Verificar restricción de privilegios
Inspecciona si el flag de bloqueo para prevenir escalaciones de privilegios está activo:
```bash
docker inspect --format='{{.HostConfig.SecurityOpt}}' mushuc_runa_frontend
```
* **Resultado esperado**: Debe imprimir en pantalla la opción:
  `[no-new-privileges:true]`.

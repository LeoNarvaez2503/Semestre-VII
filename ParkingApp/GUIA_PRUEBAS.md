# Guía de Pruebas y Validación (QA) - ParkingApp

Esta guía detalla los pasos a seguir para ejecutar las pruebas integrales de la plataforma de validación de tickets y registro express. El objetivo es asegurar que la lógica de negocio y las reglas de validación cruzada funcionen correctamente en un entorno local.

## 📌 Requisitos Previos

1. **Docker y Docker Compose**: Asegúrate de tener Docker instalado y ejecutándose.
2. **Python 3.x**: Requerido para ejecutar el script automatizado (incluye la librería estándar, no requiere dependencias externas adicionales para las solicitudes base).
3. **Postman**: Para ejecutar las pruebas manualmente a través de las colecciones.

---

## 🛠️ Preparación del Entorno

Antes de correr cualquier prueba, debes asegurarte de que los microservicios estén levantados usando la versión más reciente del código (esto garantiza que los nuevos endpoints como `/tickets/express` y las rutas del Gateway estén activos):

```bash
# Navega al directorio raíz del proyecto
cd ParkingApp

# Reconstruye y levanta los contenedores en segundo plano
docker compose up -d --build
```

Comprueba que todos los contenedores estén sanos (`healthy`) usando:
```bash
docker ps
```

---

## 🚀 Método 1: Pruebas Automáticas (Script de Python)

He creado un script llamado `verify_validation_flow.py` que actúa como un cliente End-to-End. Este script limpia las bases de datos de forma segura, crea datos de prueba y bombardea el sistema con escenarios positivos y negativos.

### ¿Cómo ejecutarlo?

```bash
python verify_validation_flow.py
```

### Casuísticas que se validan automáticamente:

El script imprimirá en consola el resultado de cada prueba. Valida las siguientes casuísticas:

1. **Flujo Base (Happy Path):**
   - Autenticación segura.
   - Creación de un Empleado y un Auto.
   - Asignación correcta del vehículo al empleado.
2. **Validación Cruzada (Cédula y Placa):**
   - Búsqueda de un usuario por su DNI real (Espera lista de vehículos).
   - Búsqueda de un usuario por DNI inexistente (Espera manejar el error sin crashear).
   - Búsqueda de un vehículo por Placa real (Espera obtener su trazabilidad y cédula asociada).
   - Búsqueda de vehículo por Placa fantasma.
3. **Casos Borde de Emisión de Tickets (Edge Cases):**
   - Rechazo de emitir un ticket si el usuario/vehículo **ya tiene un ticket activo**.
   - Rechazo de emitir ticket por **incompatibilidad** (Intentar aparcar un Auto en un espacio diseñado para Moto).
   - Rechazo si el empleado intenta aparcar un vehículo que **no le pertenece**.
   - Identificación de UUIDs falsos o espacios inexistentes.
   - Rechazo de parqueo en un espacio con estado de **MANTENIMIENTO**.
4. **Registro Express de Invitados (Opción 2):**
   - Generación de un ticket temporal proporcionando únicamente **DNI y Placa**.
   - Comprueba la creación de un usuario `Cliente` fantasma y su vehículo correspondiente de forma transparente.

> [!TIP]
> Si el script finaliza con todas las pruebas marcadas como **EXITO** y finaliza en la sección `FIN DE LAS PRUEBAS`, la orquestación está funcionando al 100%.

---

## 🧪 Método 2: Pruebas Manuales (Postman)

Para explorar las respuestas paso a paso o realizar pruebas de seguridad aisladas, se proporciona una colección de Postman pre-configurada.

### Paso 1: Importar la Colección
- Abre Postman.
- Arrastra el archivo **`Flujos_Validacion_Tickets.postman_collection.json`** (ubicado en la raíz del proyecto) hacia tu espacio de trabajo de Postman.

### Paso 2: Ejecución de las Carpetas
La colección está dividida secuencialmente. Postman se encarga de guardar variables de entorno (como `access_token`, `space_auto_id`, etc.) automáticamente gracias a los _Tests_ de cada petición. Ejecuta las carpetas en este orden:

1. **1. Preparación**: Contiene la lógica para Loguearse como administrador (`root`), crear al empleado, los vehículos y configurar la Zona y los Espacios.
2. **2. Validaciones Cruzadas**: Permite probar los endpoints de búsqueda por cédula y placa para confirmar la integración entre microservicios.
3. **3. Emisión de Tickets y Errores**:
   - Ejecuta `1. Emitir Ticket Valido` (Asegúrate de que devuelva `201 Created`).
   - Ejecuta `1.5. Emitir Ticket Express (Invitado)` (Para simular la llegada de un visitante no registrado).
   - A partir de este punto, puedes correr todos los escenarios que esperan un `Error 400` o `422` (Duplicados, incompatibles, sin permisos).
4. **4. Flujo Post-Pago y Seguridad**:
   - Ejecuta la prueba de pago de tickets para liberar el espacio.
   - Intenta hacer peticiones sin Token de Autorización para asegurar que el API Gateway bloquee el acceso con un `Error 401`.

> [!WARNING]
> Si reinicias los contenedores de Docker o limpias las bases de datos manualmente, deberás volver a ejecutar los endpoints de la carpeta **"1. Preparación"** en Postman para obtener los tokens y UUIDs frescos.

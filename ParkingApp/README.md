# ParkingApp - Validación de Tickets y Flujos

Esta rama (`JordanTestiong-AppParking`) contiene mejoras, endpoints de validación y un entorno exhaustivo de pruebas, construidos sobre la base de la rama original (`ParkingAppP3`).

## 🚀 Nuevas Funcionalidades Implementadas

Se añadieron capacidades de validación cruzada para cumplir con las reglas de negocio solicitadas (Buscar dueños por placa de vehículo, y buscar vehículos por cédula):

1. **Microservicio de Usuarios (`usuarios-fast`)**: 
   - Se actualizó el endpoint `GET /usuarios/buscar` para aceptar el parámetro `dni`.
   - Permite recuperar la información de un usuario sabiendo únicamente su número de cédula.

2. **Microservicio de Vehículos (`vehiculos`)**:
   - Se creó el nuevo endpoint `GET /vehiculos/buscar?placa={placa}` (implementado en NestJS mediante el método `findByPlate` utilizando consultas `ILike` para mayor robustez).
   - Permite consultar la existencia de un vehículo registrado usando su placa.

3. **API Gateway (Kong)**:
   - Se modificó la configuración de enrutamiento (`kong.yml`) para exponer públicamente la ruta `/vehiculo/buscar` que conecta con el microservicio correspondiente.

## 🧪 Pruebas y Validación (QA)

Para garantizar la integridad y seguridad del sistema, se agregó una suite completa de pruebas:

### 1. Script Automático en Python
- Archivo: `verify_validation_flow.py`
- Prueba el ciclo de vida completo: Creación de usuarios (rol Empleado), creación de zonas y vehículos, asignación, y **emisión de tickets**.
- **Casos Borde Controlados:** Valida que el sistema rechace tickets duplicados (mismo vehículo), incompatibilidad de espacio (ej. Auto en espacio de Moto), vehículos no asignados y espacios en estado de mantenimiento.

### 2. Colección de Postman
- Archivo: `Flujos_Validacion_Tickets.postman_collection.json`
- Contiene una batería con variables de entorno automáticas listas para ser consumidas.
- **Flujos incluidos:** Preparación de datos, Validaciones cruzadas de Placa/Cédula, Emisión de tickets y Flujo Post-Pago (dobles cobros y liberación de espacios), además de Pruebas de Seguridad (ataques sin token o de permisos insuficientes).

## 🛠️ Cómo Probar Localmente

1. Levanta los contenedores asegurándote de reconstruir las imágenes con los últimos endpoints:
   ```bash
   docker compose up -d --build
   ```
2. Corre el script de pruebas unitario:
   ```bash
   python verify_validation_flow.py
   ```
3. Opcionalmente, importa la colección JSON en **Postman** y ejecuta las peticiones manualmente o usando el _Collection Runner_.

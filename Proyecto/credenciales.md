# Credenciales de Acceso - UrbanFlow

A continuación se detallan las credenciales disponibles en la base de datos para iniciar sesión en la aplicación.

> [!IMPORTANT]
> Estas credenciales se inicializan y limpian de forma idempotente al ejecutar el script de sembrado de datos [seed_data.sh](file:///c:/Users/Jordan/Desktop/ESPE/Semestre-VII/Proyecto/seed_data.sh).

---

## 👥 Tabla de Usuarios y Roles

| Rol | Nombre de Usuario / Correo | Contraseña | DNI | Acceso al Sistema |
| :--- | :--- | :--- | :--- | :--- |
| **Root** | `root`<br>`root@parqueadero.com` | `rootpassword123` | `1715678460` | Acceso y privilegios totales (ineditable) |
| **Administrador** | `janarvaez`<br>`admin.jordan@parqueadero.com` | `adminpassword123` | `1723456784` | Gestión de plazas y edición de roles |
| **Cliente 1** | `jcperez`<br>`cliente.juan@parqueadero.com` | `clientepassword123` | `1718227653` | Ver mapa de plazas (sin edición) |
| **Cliente 2** | `melopez`<br>`cliente.maria@parqueadero.com` | `clientepassword123` | `1722834015` | Ver mapa de plazas (sin edición) |

---

## 🚗 Distribución de Plazas y Vehículos Sembrados

El script de sembrado inicializa las siguientes zonas y espacios:

### Zona A - Planta Baja
* **Espacio E-101** (AUTO): **DISPONIBLE**
* **Espacio E-102** (AUTO): **OCUPADO** por Vehículo Toyota Yaris (Placa: `PDF9876`, gris, de Cliente 1)
* **Espacio E-103** (AUTO): **RESERVADO**

### Zona B - Planta Alta
* **Espacio E-201** (AUTO): **DISPONIBLE**
* **Espacio E-202** (AUTO): **OCUPADO** por Vehículo Chevrolet Sail (Placa: `ABC1234`, azul, de Cliente 2)

---

## 🛠️ Ejecución de la Semilla
Si deseas volver a limpiar y sembrar la base de datos a su estado original, ejecuta el siguiente comando en Git Bash o tu consola de comandos desde la raíz del proyecto:
```bash
./seed_data.sh
```

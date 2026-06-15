# Proyecto `vehiculos` — Guía de ejecución y base de datos

## Resumen rápido
- Aplicación backend escrita con NestJS y TypeORM. La conexión a la base de datos se configura desde variables de entorno.
- Archivo principal de configuración: `src/app.module.ts` (usa `TypeOrmModule.forRootAsync`).
- TypeORM está configurado con `synchronize: true`, por lo que crea tablas automáticamente.

## Prerrequisitos
- Node.js + npm
- PostgreSQL local (no es necesario pgAdmin)
- Opcional: Docker si quieres levantar un Postgres en contenedor (no se usó)

## Variables de entorno
Crear un archivo `.env` en la raíz del proyecto con estas variables (ejemplo):

```
DB_HOST=localhost
DB_PORT=5432
DB_USUARIO=postgres
DB_CONTRASENA=password
DB_NOMBRE=gestion_vehiculos
```

El código busca estas variables exactamente (`DB_HOST`, `DB_PORT`, `DB_USUARIO`, `DB_CONTRASENA`, `DB_NOMBRE`).

## Cómo levantar la aplicación localmente
1. Instalar dependencias:

```bash
npm install
```

2. Asegurarte que Postgres está corriendo y que la base de datos `gestion_vehiculos` existe (ver sección siguiente).

3. Iniciar en modo desarrollo (hot-reload):

```bash
npm run start:dev
```

La app usará `.env` y TypeORM intentará conectarse; con `synchronize: true` creará tablas automáticamente.

## Comandos útiles de `psql` (sin pgAdmin)
Abrir `psql` como superusuario local (no pide contraseña):

```bash
sudo -u postgres psql
```

Conectarse usando usuario/host (pedirá contraseña si corresponde):

```bash
psql -U postgres -h localhost -W
```

Dentro de `psql`:

- Listar roles/usuarios:

```
\du
\du+
-- SQL:
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin FROM pg_roles;
```

- Listar bases de datos:

```
\l
\l+
-- SQL:
SELECT datname, datdba, encoding, datistemplate, datallowconn FROM pg_database;
```

- Conectarse a la base de datos de la app:

```
\c gestion_vehiculos
```

- Ver esquemas y tablas:

```
\dn
\dt
\dt public.*
```

- Salir:

```
\q
```

## Comandos comunes para preparar la DB
- Crear la base de datos (si falta):

```bash
sudo -u postgres createdb gestion_vehiculos
```

- Cambiar la contraseña del usuario `postgres` (si necesitas que coincida con `.env`):

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'password';"
```

- Crear un usuario y darle permisos sobre la BD:

```sql
-- dentro de psql
CREATE USER appuser WITH PASSWORD 'appsecret';
GRANT ALL PRIVILEGES ON DATABASE gestion_vehiculos TO appuser;
```

Si usas otro usuario, actualiza `.env` con `DB_USUARIO` y `DB_CONTRASENA` correspondientes.

## Consultas SQL de ejemplo (útiles para debug y ver datos)
- Ver todos los vehículos:

```sql
SELECT * FROM vehiculo;
```

- Contar por tipo:

```sql
SELECT tipo, COUNT(*) FROM vehiculo GROUP BY tipo;
```

- Buscar por placa:

```sql
SELECT * FROM vehiculo WHERE placa = 'ABC123';
```

- Borrar datos de prueba (cuidado):

```sql
DELETE FROM vehiculo WHERE placa LIKE 'TEST%';
```

## Seed data (inserts)

He añadido un archivo de seeds con inserts de ejemplo en `seeds/insert_vehiculos.sql`.
Para ejecutarlo desde la máquina local usa:

```bash
sudo -u postgres psql -d gestion_vehiculos -f seeds/insert_vehiculos.sql
```

O si quieres conectarte por red (te pedirá contraseña):

```bash
psql -U postgres -h localhost -d gestion_vehiculos -f seeds/insert_vehiculos.sql
```

Después puedes verificar con:

```sql
SELECT id, placa, marca, tipo, clasificacion FROM vehiculo ORDER BY placa;
```


## Flujo interno (cómo funciona la app)
- `src/app.module.ts` carga `ConfigModule` y `TypeOrmModule.forRootAsync`, toma parámetros desde `.env`.
- Las entidades están en `src/vehiculos/entities/` (Vehiculo, Auto, Motocicleta, Camioneta).
- El módulo `VehiculosModule` registra repositorios con `TypeOrmModule.forFeature(...)` y expone controladores en `src/vehiculos`.
- Las rutas principales están en `/vehiculos` (GET/POST/PATCH/DELETE según el controlador).

## Troubleshooting rápido
- Error "client password must be a string": significa que la contraseña no está establecida o es `null` en `.env`. Asegura `DB_CONTRASENA` sea una cadena.
- Error "address already in use" al levantar Docker: hay un Postgres local usando el puerto 5432. O paras el servicio local o cambias el `ports` en `docker-compose.yml` a otro puerto.
- Error "no existe la base de datos 'gestion_vehiculos'": crea la base con `createdb` o ajusta `DB_NOMBRE` en `.env`.

## Notas finales
- Actualmente `synchronize: true` crea tablas automáticamente en la BD configurada. Para producción considera usar migraciones en vez de `synchronize`.
- Archivo de configuración relacionado: `src/app.module.ts`.

## Plantillas SQL (rápidas)

- Nota: algunas columnas creadas por TypeORM usan camelCase y necesitan comillas dobles en SQL, p. ej. "numeroPuertas", "capacidadCarga".

- INSERT (ejemplo):

```sql
INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo, "numeroPuertas")
VALUES ('PLACA001', 'MarcaEj', 'ModeloX', 'Blanco', 2024, 'Gasolina', 'Auto', 4);
```

- INSERT con RETURNING:

```sql
INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo)
VALUES ('PLACA002','Marca2','Modelo2','Negro',2021,'Electrico','Auto')
RETURNING id, placa;
```

- UPDATE:

```sql
UPDATE vehiculo
SET marca = 'MarcaActualizada', modelo = 'ModeloZ', color = 'Azul', anio = 2022
WHERE placa = 'PLACA001';
```

- DELETE:

```sql
DELETE FROM vehiculo WHERE placa = 'PLACA_TEMPORAL';
```

- UPSERT (ON CONFLICT sobre `placa`):

```sql
INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo)
VALUES ('PLACA001','MarcaUp','ModeloUp','Rojo',2023,'Gasolina','Auto')
ON CONFLICT (placa) DO UPDATE
SET marca = EXCLUDED.marca,
		modelo = EXCLUDED.modelo,
		color = EXCLUDED.color,
		anio = EXCLUDED.anio;
```

- TRANSACCIÓN (ejemplo):

```sql
BEGIN;
	INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo)
		VALUES ('TX001','TxMarca','TxModelo','Gris',2020,'Gasolina','Auto');
	UPDATE vehiculo SET color = 'Verde' WHERE placa = 'TX001';
COMMIT;
```

---
Archivo creado: `RUNNING.md` en la raíz del proyecto. Si quieres lo renomino a `README-DB.md` o lo agrego al `README.md` principal.

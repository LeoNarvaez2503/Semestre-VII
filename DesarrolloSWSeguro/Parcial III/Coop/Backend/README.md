# Backend Mushuc Runa

Backend NestJS con TypeORM separado en tres microservicios HTTP:

- `clientes`: usuarios, login demo, bitacora y configuracion.
- `cuentas`: cuentas bancarias y bloqueo/desbloqueo.
- `transacciones`: depositos, retiros y transferencias.

## Instalacion

```bash
cd Backend
npm install
copy .env.example .env
```

Configura la base de datos en `.env` y levanta cada servicio en una terminal:

```bash
npm run start:dev:clientes
npm run start:dev:cuentas
npm run start:dev:transacciones
```

Por defecto escuchan en:

- Clientes: `http://localhost:4001`
- Cuentas: `http://localhost:4002`
- Transacciones: `http://localhost:4003`

El frontend puede conectarse activando `VITE_USE_BACKEND=true` en `cooperativa-mushuc-runa/.env`.

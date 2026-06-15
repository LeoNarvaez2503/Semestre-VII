# Postman tests and server commands

Prerequisitos

- Tener el virtualenv creado en `.venv` (ya lo usamos en este proyecto).
- La variable de entorno `DATABASE_URL` configurada en `.env` o exportada en la terminal.
- Servidor FastAPI en `src.app`.

Detener el servidor (si está corriendo)

 - Buscar procesos `uvicorn` y matarlos:

```bash
pkill -f "uvicorn src.app" || true
# o (más seguro) matar por PID:
ps aux | grep uvicorn | grep -v grep
kill PID
```

Iniciar el servidor (en background)

```bash
source .venv/bin/activate
export DATABASE_URL="postgresql+pg8000://appuser:AppUser3z9J@localhost:5432/usuarios"
.venv/bin/uvicorn src.app:app --host 127.0.0.1 --port 8000 --workers 1 &
# comprueba logs en la terminal o con: tail -f /path/to/uvicorn/log (si lo rediriges)
```

Iniciar el servidor (foreground, útil para ver errores)

```bash
source .venv/bin/activate
export DATABASE_URL="postgresql+pg8000://appuser:AppUser3z9J@localhost:5432/usuarios"
.venv/bin/uvicorn src.app:app --reload --host 127.0.0.1 --port 8000
```

Postman — Configuración de entorno

- Crea un environment en Postman con estas variables:
  - `base_url` = `http://127.0.0.1:8000`
  - `user_id` = (se rellenará después de crear un usuario)

Colección: Peticiones principales

1) Crear usuario

- Method: POST
- URL: `{{base_url}}/users/`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "username": "jdoe",
  "password_hash": "hash-demo",
  "person": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "jdoe@example.com",
    "dni": "12345678"
  }
}
```

Respuesta esperada: JSON con `id` (UUID) y demás campos. Copia el `id` y guárdalo en la variable de entorno `user_id`.

2) Obtener usuario

- Method: GET
- URL: `{{base_url}}/users/{{user_id}}`

Respuesta esperada: objeto usuario con `id`, `username`, `active`, `person`.

3) Desactivar usuario

- Method: POST
- URL: `{{base_url}}/users/{{user_id}}/deactivate`
- Body: none

Respuesta esperada: {"status":"deactivated","user_id":"..."}

Ejemplos curl (útiles para importar a Postman o probar en terminal)

Crear usuario:

```bash
curl -s -X POST http://127.0.0.1:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{"username":"jdoe","password_hash":"hash-demo","person":{"first_name":"John","last_name":"Doe"}}'
```

Obtener usuario:

```bash
curl http://127.0.0.1:8000/users/<ID>
```

Desactivar usuario:

```bash
curl -X POST http://127.0.0.1:8000/users/<ID>/deactivate
```

Notas útiles

- Si tu servidor corre en otra IP/puerto, actualiza `base_url` en Postman.
- Si ves errores de permisos en la creación de tablas, revisa que `DATABASE_URL` apunte al usuario con privilegios (en este repo usamos `appuser`).
- Para integrar con Postman Collections: crea una nueva colección, añade las 3 peticiones y exporta/importa el JSON desde `File > Export`.

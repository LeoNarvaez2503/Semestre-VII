# Usuarios-Roles (FastAPI) - Evidencia de principios SOLID

Este proyecto es una plantilla mínima en FastAPI que demuestra los principios SOLID, usando una base de datos relacional (SQLite para demo, puede cambiar a Postgres) y UUID para identificadores.

Resumen rápido:
- IDs: todas las entidades usan UUID (cadena de 36 caracteres) como `id`.
- Relacional: SQLAlchemy con tablas `persons`, `users`, `roles`, `user_roles`.
- Desactivación: al desactivar un usuario, se marca `users.active = false`, `persons.active = false`, y las filas de `user_roles.active = false`.

Asignación de responsabilidades (SOLID mapping):
- Single Responsibility: `routers` (HTTP), `services` (business rules), `repositories` (persistencia), `models` (esquema DB).
- Open/Closed: `IUserRepository` permite nuevas implementaciones sin cambiar el servicio.
- Liskov Substitution: repositorios concretos implementan la interfaz `IUserRepository`.
- Interface Segregation: la interfaz del repositorio contiene métodos concretos y pequeños (get/create/deactivate).
- Dependency Inversion: `services` dependen de la abstracción `IUserRepository` y no de una implementación concreta.

Esquema SQL (resumen):

CREATE TABLE persons (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  active BOOLEAN
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  person_id TEXT REFERENCES persons(id),
  active BOOLEAN
);

CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT,
  active BOOLEAN
);

CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  role_id TEXT REFERENCES roles(id),
  active BOOLEAN
);

Cómo correr (local):

1. Crear y activar un virtualenv

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configurar PostgreSQL (opcional, recomendado para entorno real)

 - Crear la base de datos y usuario en Postgres
 - Establecer `DATABASE_URL` en el entorno o copiar `.env.example` a `.env` y editar

Ejemplo `DATABASE_URL`:

```
postgresql+psycopg2://postgres:postgres@localhost:5432/usuarios
```

3. Ejecutar el servidor

```bash
uvicorn src.app:app --reload
```

4. (Opcional) Migraciones con Alembic

```bash
alembic init alembic
# editar alembic.ini y env.py para usar src.db.Base/engine
# generar migración: alembic revision --autogenerate -m "init"
# aplicar migración: alembic upgrade head
```

Endpoints importantes:
- `POST /users/` crear usuario (JSON con `username` y opcional `person`)
- `GET /users/{id}` obtener usuario
- `POST /users/{id}/deactivate` desactivar usuario y asociadas

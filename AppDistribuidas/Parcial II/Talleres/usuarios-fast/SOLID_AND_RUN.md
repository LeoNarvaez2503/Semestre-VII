# Principios SOLID aplicados en este proyecto

Este documento explica dónde y cómo se aplican los principios SOLID en el código de la API (FastAPI).

Resumen de archivos relevantes:

- `app/exceptions.py`
- `app/core/security.py`
- `app/core/hasher.py`
- `app/core/database.py`
- `app/core/deps.py`
- `app/models/user.py`
- `app/models/person.py`
- `app/models/role.py`
- `app/models/user_role.py`
- `app/repositories/user_repository.py`
- `app/services/user_service.py`
- `app/api/users.py`
- `app/main.py`

1) Single Responsibility Principle (SRP)

- `app/core/security.py`: contiene funciones enfocadas exclusivamente en truncado, hashing y verificación de contraseñas.
- `app/core/hasher.py`: adaptador que expone una interfaz (`PasswordHasher`) y una implementación concreta; separa la abstracción del detalle de passlib.
- `app/repositories/user_repository.py`: responsabilidad única: acceso a datos (consultas, flush, commit). Separar repositorio evita que la lógica de negocio realice consultas SQL directas.
- `app/services/user_service.py`: ahora concentra la lógica de negocio, pero ya no realiza operaciones de persistencia directa ni el hashing porque esas responsabilidades fueron extraídas a repositorios y al hasher.

2) Open/Closed Principle (OCP)

- `app/core/hasher.py` y `app/repositories/user_repository.py` ofrecen abstracciones (protocolos / interfaz) que permiten añadir nuevas implementaciones (otro hasher, otro repositorio) sin modificar `UserService`.
- `UserService` está abierta a extensión (puedes inyectar otro `IUserRepository` o `PasswordHasher`) pero cerrada a modificación para la lógica base.

3) Liskov Substitution Principle (LSP)

- No se añadieron jerarquías complejas que violen LSP; las abstracciones (`PasswordHasher` protocol, `IUserRepository`) pueden ser substituidas por sus implementaciones (`PasslibHasher`, `SqlAlchemyUserRepository`) sin cambiar el comportamiento esperado.

4) Interface Segregation Principle (ISP)

- `IUserRepository` define una interfaz enfocada en las operaciones que `UserService` necesita (consultas, agregar, flush, commit). Los consumidores no están obligados a depender de métodos que no usan.

5) Dependency Inversion Principle (DIP)

- `UserService` depende de abstracciones (`IUserRepository`, `PasswordHasher`) en lugar de implementaciones concretas. La inyección se realiza en `app/core/deps.py` para el entorno FastAPI.
- Las excepciones de dominio (`app/exceptions.py`) desacoplan la capa de servicio de FastAPI (`HTTPException`) — el router (`app/api/users.py`) traduce las excepciones de dominio a respuestas HTTP.

Notas prácticas y beneficios

- Testabilidad: al inyectar repositorios y hasher es sencillo mockear dependencias en pruebas unitarias para `UserService`.
- Desacoplamiento: la capa de negocio no necesita conocer detalles de la DB ni del algoritmo de hashing.
- Mantenibilidad: responsabilidades separadas facilitan cambios localizados (p. ej. cambiar passlib por otra librería solo implica reemplazar `PasslibHasher`).

Comandos para levantar el entorno (Linux)

1. Crear y activar entorno virtual

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. (Opcional) Usar PostgreSQL en lugar de SQLite

Exporta la variable de entorno `DATABASE_URL` antes de iniciar la app. Ejemplo para Postgres:

```bash
export DATABASE_URL="postgresql+pg8000://user:password@localhost:5432/dbname"
```

Si no exportas `DATABASE_URL`, la aplicación usa por defecto `sqlite:///./test.db`.

4. Levantar la aplicación con `uvicorn`

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Probar endpoints

- Documentación interactiva: http://127.0.0.1:8000/docs
- Lista de usuarios: `GET /users`
- Crear usuario: `POST /users` con el body según `app/schemas/user.py`.

Resumen final

He separado responsabilidades (SRP), introduje abstracciones para facilitar extensiones (OCP, DIP), mantuve sustitución con implementaciones intercambiables (LSP), y creé interfaces específicas para las necesidades del servicio (ISP). Para continuar, puedo añadir pruebas unitarias para `UserService` o mapear excepciones globalmente si lo deseas.

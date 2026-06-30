from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, SessionLocal
from app.routers import users, roles, auth
from app.models.person import Person
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole

# Auto-creación de tablas (opcional pero muy útil para pruebas rápidas)
Base.metadata.create_all(bind=engine)

from app.services.user_service import pwd_context

def seed_roles():
    db = SessionLocal()
    try:
        default_roles = [
            ("Cliente", "Rol asignado para los clientes del parqueadero."),
            ("Administrador", "Rol con acceso total al sistema."),
            ("Root", "Super usuario con todos los privilegios.")
        ]
        role_objs = {}
        for role_name, description in default_roles:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name, description=description, active=True)
                db.add(role)
                db.flush()
            role_objs[role_name] = role
        
        # Seed default Root user
        root_person = db.query(Person).filter(Person.email == "root@parqueadero.com").first()
        if not root_person:
            root_person = Person(
                dni="1715678460",
                email="root@parqueadero.com",
                first_name="Root",
                last_name="Super",
                middle_name="Admin",
                nationality="Ecuatoriana",
                phone="0999999999",
                address="Quito",
                active=True
            )
            db.add(root_person)
            db.flush()

            root_user = User(
                id_person=root_person.id,
                username="root",
                password_hash=pwd_context.hash("rootpassword123"),
                active=True
            )
            db.add(root_user)
            db.flush()

            user_role_obj = UserRole(
                id_user=root_user.id_person,
                id_role=role_objs["Root"].id,
                active=True
            )
            db.add(user_role_obj)

        db.commit()
    except Exception as e:
        print(f"Error seeding roles/root: {e}")
        db.rollback()
    finally:
        db.close()

seed_roles()

app = FastAPI(
    title="API de Usuarios (FastAPI)",
    description="Backend para la gestión de usuarios, personas y roles aplicando principios SOLID.",
    version="1.0.0",
    docs_url="/usuarios/docs",
    openapi_url="/usuarios/openapi.json"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir ruteadores
app.include_router(users.router)
app.include_router(roles.router)
app.include_router(auth.router)

@app.get("/", tags=["General"])
def read_root():
    return {"message": "API de Usuarios con FastAPI activa. Acceda a /docs para ver la documentación interactiva."}

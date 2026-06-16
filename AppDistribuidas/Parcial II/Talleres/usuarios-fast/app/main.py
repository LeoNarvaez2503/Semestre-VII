from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import users, roles
from app.models.person import Person
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole

# Auto-creación de tablas (opcional pero muy útil para pruebas rápidas)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Usuarios (FastAPI)",
    description="Backend para la gestión de usuarios, personas y roles aplicando principios SOLID.",
    version="1.0.0"
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

@app.get("/", tags=["General"])
def read_root():
    return {"message": "API de Usuarios con FastAPI activa. Acceda a /docs para ver la documentación interactiva."}

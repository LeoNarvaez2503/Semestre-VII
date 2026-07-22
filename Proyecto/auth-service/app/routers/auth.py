from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional, List
import urllib.request
import json
import os

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService, pwd_context
from app.utils.jwt_helper import create_access_token, decode_access_token, create_refresh_token, decode_refresh_token

router = APIRouter(prefix="/usuarios", tags=["Autenticación y Perfil"])

security = HTTPBearer()

ASIGNACIONES_API_URL = os.getenv("ASIGNACIONES_API_URL", "http://asignacion-app:3001")

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token no contiene información de usuario.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id_person == user_id, User.active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def check_roles(allowed_roles: List[str]):
    def dependency(current_user: User = Depends(get_current_user)):
        user_roles = [ur.role.name.lower() for ur in current_user.user_roles if ur.active]
        if "root" in user_roles:
            return current_user
        allowed_roles_lower = [role.lower() for role in allowed_roles]
        if not any(role in user_roles for role in allowed_roles_lower):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos suficientes para realizar esta acción."
            )
        return current_user
    return dependency

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    # Búsqueda de usuario case-insensitive por username o email
    from app.models.person import Person
    user = db.query(User).join(Person).filter(
        (func.lower(User.username) == login_data.username.strip().lower()) |
        (func.lower(Person.email) == login_data.username.strip().lower()),
        User.active == True
    ).first()

    if not user or not pwd_context.verify(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas o usuario inactivo.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generar token con id_person, username y roles
    roles = [ur.role.name for ur in user.user_roles if ur.active]
    token_data = {
        "sub": str(user.id_person),
        "username": user.username,
        "roles": roles
    }
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data={"sub": str(user.id_person)})

    try:
        from app.utils.rabbitmq_publisher import publish_audit_event
        publish_audit_event(
            servicio="ms-users",
            accion="LOGIN",
            entidad="USUARIO",
            datos={"username": user.username, "roles": roles},
            usuario=user.username,
            request_ip=request.client.host if request.client else None
        )
    except Exception:
        pass

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_refresh_token(refresh_data.refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de refresco inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token no contiene información de usuario.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = db.query(User).filter(User.id_person == user_id, User.active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    roles = [ur.role.name for ur in user.user_roles if ur.active]
    token_data = {
        "sub": str(user.id_person),
        "username": user.username,
        "roles": roles
    }
    
    access_token = create_access_token(data=token_data)
    new_refresh_token = create_refresh_token(data={"sub": str(user.id_person)})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me/actualizar", response_model=UserResponse)
def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Proteger roles: Solo administradores o root pueden cambiar roles.
    user_roles = [ur.role.name.lower() for ur in current_user.user_roles if ur.active]
    is_admin_or_root = "administrador" in user_roles or "root" in user_roles
    if not is_admin_or_root:
        user_in.roles = None

    return UserService.update_user(db, str(current_user.id_person), user_in)

@router.get("/me/vehiculos")
def read_my_vehicles(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    url = f"{ASIGNACIONES_API_URL}/asignaciones/propietario/{current_user.id_person}"
    try:
        req = urllib.request.Request(url)
        auth_header = request.headers.get("Authorization")
        if auth_header:
            req.add_header("Authorization", auth_header)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al conectar con el servicio de asignaciones: {str(e)}"
        )

from fastapi import APIRouter, Depends, status, Request, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserRolesUpdate
from app.services.user_service import UserService
from app.routers.auth import check_roles
from app.utils.jwt_helper import decode_access_token
from app.models.user import User

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/internal/validar/{id}")
def validate_user(id: UUID, db: Session = Depends(get_db)):
    """
    Contrato interno para microservicios. 
    Verifica si un usuario existe y si está activo sin retornar sus datos personales.
    """
    return UserService.validate_user_exists(db, str(id))

@router.post("/crear", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado.")
        user_id = payload.get("sub")
        current_user = db.query(User).filter(User.id_person == user_id, User.active == True).first()
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado o inactivo.")
        user_roles = [ur.role.name for ur in current_user.user_roles if ur.active]
        if "Root" not in user_roles and "Administrador" not in user_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tiene permisos para crear usuarios con roles especiales.")
        # Admin / Root can create user with any role
    else:
        # Public registration: force role to Cliente
        user_in.roles = ["Cliente"]

    created_user = UserService.create_user(db, user_in)

    try:
        from app.utils.rabbitmq_publisher import publish_audit_event
        current_username = "anonymous"
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            payload = decode_access_token(token)
            if payload:
                current_username = payload.get("username", "anonymous")
        publish_audit_event(
            servicio="ms-users",
            accion="CREATE",
            entidad="USUARIO",
            datos={"username": created_user.username, "id_person": str(created_user.id_person)},
            usuario=current_username,
            request_ip=request.client.host if request.client else None
        )
    except Exception:
        pass

    return created_user

@router.get("/listar", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(check_roles(["Administrador", "Root"]))):
    return UserService.get_users(db)

@router.get("/buscar", response_model=list[UserResponse])
def search_users(
    username: Optional[str] = None,
    apellido: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_roles(["Administrador", "Root"]))
):
    return UserService.search_users(db, username=username, apellido=apellido)

@router.get("/obtener/{id}", response_model=UserResponse)
def get_user_by_id(id: UUID, db: Session = Depends(get_db), current_user: User = Depends(check_roles(["Administrador", "Root"]))):
    return UserService.get_user_by_id(db, str(id))

@router.patch("/actualizar/{id}", response_model=UserResponse)
def update_user(id: UUID, user_in: UserUpdate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(check_roles(["Administrador", "Root"]))):
    updated_user = UserService.update_user(db, str(id), user_in)
    try:
        from app.utils.rabbitmq_publisher import publish_audit_event
        publish_audit_event(
            servicio="ms-users",
            accion="UPDATE",
            entidad="USUARIO",
            datos={"username": updated_user.username, "id_person": str(updated_user.id_person)},
            usuario=current_user.username,
            request_ip=request.client.host if request.client else None
        )
    except Exception:
        pass
    return updated_user

@router.put("/roles/{id}", response_model=UserResponse)
def update_user_roles(id: UUID, roles_in: UserRolesUpdate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(check_roles(["Administrador", "Root"]))):
    updated_user = UserService.update_user_roles(db, str(id), roles_in.roles)
    try:
        from app.utils.rabbitmq_publisher import publish_audit_event
        publish_audit_event(
            servicio="ms-users",
            accion="UPDATE",
            entidad="USUARIO",
            datos={"username": updated_user.username, "roles": roles_in.roles},
            usuario=current_user.username,
            request_ip=request.client.host if request.client else None
        )
    except Exception:
        pass
    return updated_user

@router.delete("/eliminar/{id}")
def delete_user(id: UUID, request: Request, db: Session = Depends(get_db), current_user: User = Depends(check_roles(["Administrador", "Root"]))):
    res = UserService.delete_user(db, str(id))
    try:
        from app.utils.rabbitmq_publisher import publish_audit_event
        publish_audit_event(
            servicio="ms-users",
            accion="DELETE",
            entidad="USUARIO",
            datos={"id_person": str(id)},
            usuario=current_user.username,
            request_ip=request.client.host if request.client else None
        )
    except Exception:
        pass
    return res

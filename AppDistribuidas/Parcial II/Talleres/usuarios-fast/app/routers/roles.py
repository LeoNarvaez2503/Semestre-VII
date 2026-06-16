from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.schemas.user import RoleCreate, RoleUpdate, RoleResponse
from app.services.role_service import RoleService

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
def create_role(role_in: RoleCreate, db: Session = Depends(get_db)):
    return RoleService.create_role(db, role_in)

@router.get("", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return RoleService.get_roles(db)

@router.get("/{id}", response_model=RoleResponse)
def get_role_by_id(id: UUID, db: Session = Depends(get_db)):
    return RoleService.get_role_by_id(db, str(id))

@router.patch("/{id}", response_model=RoleResponse)
def update_role(id: UUID, role_in: RoleUpdate, db: Session = Depends(get_db)):
    return RoleService.update_role(db, str(id), role_in)

@router.delete("/{id}")
def delete_role(id: UUID, db: Session = Depends(get_db)):
    return RoleService.delete_role(db, str(id))

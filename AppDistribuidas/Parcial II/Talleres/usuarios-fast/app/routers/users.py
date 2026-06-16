from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return UserService.create_user(db, user_in)

@router.get("", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return UserService.get_users(db)

@router.get("/{id}", response_model=UserResponse)
def get_user_by_id(id: UUID, db: Session = Depends(get_db)):
    return UserService.get_user_by_id(db, str(id))

@router.patch("/{id}", response_model=UserResponse)
def update_user(id: UUID, user_in: UserUpdate, db: Session = Depends(get_db)):
    return UserService.update_user(db, str(id), user_in)

@router.delete("/{id}")
def delete_user(id: UUID, db: Session = Depends(get_db)):
    return UserService.delete_user(db, str(id))

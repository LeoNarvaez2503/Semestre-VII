from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.deps import get_user_service
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.exceptions import NotFoundError, ConflictError, InternalError

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, svc: UserService = Depends(get_user_service)):
    try:
        user = svc.create_user(user_in)
        return user
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except InternalError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_model=List[UserOut])
def list_users(svc: UserService = Depends(get_user_service)):
    return svc.get_users()


@router.get("/{id_person}", response_model=UserOut)
def get_user(id_person: str, svc: UserService = Depends(get_user_service)):
    try:
        return svc.get_user_by_id(id_person)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{id_person}", response_model=UserOut)
def update_user(id_person: str, user_in: UserUpdate, svc: UserService = Depends(get_user_service)):
    try:
        return svc.update_user(id_person, user_in)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except InternalError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{id_person}")
def delete_user(id_person: str, svc: UserService = Depends(get_user_service)):
    try:
        return svc.delete_user(id_person)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InternalError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

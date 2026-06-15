from fastapi import APIRouter, Depends, HTTPException
from src.schemas import UserCreate, UserRead
from src.services.user_service import UserService

router = APIRouter()


def get_user_service():
    return UserService()


@router.post("/", response_model=UserRead)
def create_user(payload: UserCreate, svc: UserService = Depends(get_user_service)):
    user = svc.create_user(payload.dict())
    return user


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: str, svc: UserService = Depends(get_user_service)):
    user = svc.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/{user_id}/deactivate")
def deactivate_user(user_id: str, svc: UserService = Depends(get_user_service)):
    svc.deactivate_user(user_id)
    return {"status": "deactivated", "user_id": user_id}

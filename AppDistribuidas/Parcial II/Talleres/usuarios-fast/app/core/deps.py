from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.repositories.user_repository import SqlAlchemyUserRepository
from app.core.hasher import PasslibHasher
from app.services.user_service import UserService


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repo = SqlAlchemyUserRepository(db)
    hasher = PasslibHasher()
    return UserService(repo, hasher)

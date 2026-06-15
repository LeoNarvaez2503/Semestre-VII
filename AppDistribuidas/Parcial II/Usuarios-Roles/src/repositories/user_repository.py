from src.repositories.interfaces import IUserRepository
from src.db import SessionLocal
from src import models


class SqlAlchemyUserRepository(IUserRepository):
    def __init__(self):
        self._Session = SessionLocal

    def get(self, user_id: str):
        db = self._Session()
        try:
            return db.query(models.User).filter(models.User.id == user_id).first()
        finally:
            db.close()

    def create(self, payload: dict):
        db = self._Session()
        try:
            person_data = payload.pop("person", None)
            person = None
            if person_data:
                person = models.Person(**person_data)
                db.add(person)
                db.flush()

            user = models.User(**payload)
            if person:
                user.person = person
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        finally:
            db.close()

    def deactivate(self, user_id: str) -> None:
        db = self._Session()
        try:
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if not user:
                return
            # deactivate user
            user.active = False
            # deactivate related person
            if user.person:
                user.person.active = False
            # deactivate user_roles
            for ur in user.roles:
                ur.active = False
                if ur.role:
                    # NOTE: roles may be shared; we only deactivate the association.
                    pass
            db.commit()
        finally:
            db.close()

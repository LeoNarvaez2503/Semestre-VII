from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.person import Person
from app.models.role import Role
from app.models.user_role import UserRole


class IUserRepository:
    def get_user_by_id(self, id_person: str) -> Optional[User]: ...

    def get_users(self) -> List[User]: ...

    def get_by_username(self, username: str) -> Optional[User]: ...

    def get_person_by_email(self, email: str) -> Optional[Person]: ...

    def get_person_by_dni(self, dni: str) -> Optional[Person]: ...

    def get_role_by_name(self, name: str) -> Optional[Role]: ...

    def add_person(self, person: Person) -> Person: ...

    def add_user(self, user: User) -> User: ...

    def add_role(self, role: Role) -> Role: ...

    def add_user_role(self, user_role: UserRole) -> None: ...

    def delete_user_roles(self, id_user: str) -> None: ...

    def commit(self) -> None: ...

    def rollback(self) -> None: ...

    def refresh(self, obj): ...

    def flush(self) -> None: ...


class SqlAlchemyUserRepository(IUserRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_id(self, id_person: str) -> Optional[User]:
        return self.db.query(User).filter(User.id_person == id_person, User.active == True).first()

    def get_users(self) -> List[User]:
        return self.db.query(User).filter(User.active == True).all()

    def get_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()

    def get_person_by_email(self, email: str) -> Optional[Person]:
        return self.db.query(Person).filter(Person.email == email).first()

    def get_person_by_dni(self, dni: str) -> Optional[Person]:
        return self.db.query(Person).filter(Person.dni == dni).first()

    def get_role_by_name(self, name: str) -> Optional[Role]:
        return self.db.query(Role).filter(Role.name == name).first()

    def add_person(self, person: Person) -> Person:
        self.db.add(person)
        self.db.flush()
        return person

    def add_user(self, user: User) -> User:
        self.db.add(user)
        self.db.flush()
        return user

    def add_role(self, role: Role) -> Role:
        self.db.add(role)
        self.db.flush()
        return role

    def add_user_role(self, user_role: UserRole) -> None:
        self.db.add(user_role)

    def delete_user_roles(self, id_user: str) -> None:
        self.db.query(UserRole).filter(UserRole.id_user == id_user).delete()

    def commit(self) -> None:
        self.db.commit()

    def rollback(self) -> None:
        self.db.rollback()

    def refresh(self, obj):
        self.db.refresh(obj)

    def flush(self) -> None:
        self.db.flush()

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.person import Person
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.schemas.user import UserCreate, UserUpdate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
class UserService:
    @staticmethod
    def get_user_by_id(db: Session, id_person: str) -> User:
        user = db.query(User).filter(User.id_person == id_person, User.active == True).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {id_person} no encontrado o inactivo."
            )
        return user

    @staticmethod
    def get_users(db: Session) -> list[User]:
        return db.query(User).filter(User.active == True).all()

    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        # 1. Validar unicidad
        if db.query(User).filter(User.username == user_in.username).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El nombre de usuario '{user_in.username}' ya está registrado."
            )
        
        if db.query(Person).filter(Person.email == user_in.person.email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El correo electrónico '{user_in.person.email}' ya está registrado."
            )

        if db.query(Person).filter(Person.dni == user_in.person.dni).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El DNI '{user_in.person.dni}' ya está registrado."
            )

        # 2. Transacción
        try:
            # Crear Persona
            person_obj = Person(
                dni=user_in.person.dni,
                email=user_in.person.email,
                first_name=user_in.person.first_name,
                last_name=user_in.person.last_name,
                middle_name=user_in.person.middle_name,
                nationality=user_in.person.nationality,
                phone=user_in.person.phone,
                address=user_in.person.address,
                active=True
            )
            db.add(person_obj)
            db.flush() # Obtiene el ID asignado a person_obj

            def get_password_hash(password: str) -> str:
                return pwd_context.hash(password)
            hashed_password = get_password_hash(user_in.password)
            # Crear Usuario
            user_obj = User(
                id_person=person_obj.id,
                username=user_in.username,
                password_hash=pwd_context.hash(user_in.password), # En producción, hash con passlib/bcrypt
                active=True
            )
            db.add(user_obj)
            db.flush()

            # Guardar roles
            if user_in.roles:
                for role_name in user_in.roles:
                    role_obj = db.query(Role).filter(Role.name == role_name).first()
                    if not role_obj:
                        role_obj = Role(
                            name=role_name,
                            active=True,
                            description=f"Rol de {role_name}"
                        )
                        db.add(role_obj)
                        db.flush()

                    user_role_obj = UserRole(
                        id_user=user_obj.id_person,
                        id_role=role_obj.id,
                        active=True
                    )
                    db.add(user_role_obj)

            db.commit()
            db.refresh(user_obj)
            return user_obj
        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def update_user(db: Session, id_person: str, user_in: UserUpdate) -> User:
        user_obj = UserService.get_user_by_id(db, id_person)

        # Validar unicidad si cambian campos únicos
        if user_in.username and user_in.username != user_obj.username:
            if db.query(User).filter(User.username == user_in.username).first():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El nombre de usuario '{user_in.username}' ya está registrado."
                )

        if user_in.person:
            if user_in.person.email and user_in.person.email != user_obj.person.email:
                if db.query(Person).filter(Person.email == user_in.person.email).first():
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"El correo electrónico '{user_in.person.email}' ya está registrado."
                    )
            if user_in.person.dni and user_in.person.dni != user_obj.person.dni:
                if db.query(Person).filter(Person.dni == user_in.person.dni).first():
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"El DNI '{user_in.person.dni}' ya está registrado."
                    )

        try:
            # Actualizar Persona
            if user_in.person:
                person_data = user_in.person.model_dump(exclude_unset=True)
                for key, value in person_data.items():
                    setattr(user_obj.person, key, value)

            # Actualizar Usuario
            if user_in.username:
                user_obj.username = user_in.username
            if user_in.password:
                user_obj.password_hash=pwd_context.hash(user_in.password)
            # Actualizar Roles si se especifican
            if user_in.roles is not None:
                # Eliminar asociaciones previas
                db.query(UserRole).filter(UserRole.id_user == user_obj.id_person).delete()
                
                for role_name in user_in.roles:
                    role_obj = db.query(Role).filter(Role.name == role_name).first()
                    if not role_obj:
                        role_obj = Role(
                            name=role_name,
                            active=True,
                            description=f"Rol de {role_name}"
                        )
                        db.add(role_obj)
                        db.flush()

                    user_role_obj = UserRole(
                        id_user=user_obj.id_person,
                        id_role=role_obj.id,
                        active=True
                    )
                    db.add(user_role_obj)

            db.commit()
            db.refresh(user_obj)
            return user_obj
        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def delete_user(db: Session, id_person: str) -> dict:
        user_obj = UserService.get_user_by_id(db, id_person)

        try:
            # Eliminación lógica (Inactivación)
            user_obj.active = False
            user_obj.person.active = False

            # Inactivar relaciones en user_role
            for ur in user_obj.user_roles:
                ur.active = False

            db.commit()
            return {"message": f"Usuario con ID {id_person} inactivado exitosamente (eliminación lógica)."}
        except Exception as e:
            db.rollback()
            raise e

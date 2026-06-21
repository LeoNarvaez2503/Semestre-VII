from typing import Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.utils.exceptions import EntityNotFoundException, EntityAlreadyExistsException
from app.models.person import Person
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.schemas.user import UserCreate, UserUpdate
from fastapi import HTTPException
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
class UserService:
    @staticmethod
    def get_user_by_id(db: Session, id_person: str) -> User:
        user = db.query(User).filter(User.id_person == id_person, User.active == True).first()
        if not user:
            raise EntityNotFoundException(f"Usuario con ID {id_person} no encontrado o inactivo.")
        return user

    @staticmethod
    def get_users(db: Session) -> list[User]:
        return db.query(User).filter(User.active == True).all()

    @staticmethod
    def search_users(db: Session, username: Optional[str] = None, apellido: Optional[str] = None) -> list[User]:
        if not username and not apellido:
            raise HTTPException(status_code=400, detail="Debe proporcionar al menos un parámetro de búsqueda: 'username' o 'apellido'.")
        
        query = db.query(User).join(Person).filter(User.active == True)
        
        if username:
            query = query.filter(func.lower(User.username) == username.strip().lower())
        if apellido:
            query = query.filter(Person.last_name.ilike(f"%{apellido.strip()}%"))
            
        return query.all()

    @staticmethod
    def _generate_unique_username(db: Session, first_name: str, middle_name: Optional[str], last_name: str) -> str:
        # 1. Obtener inicial del primer nombre
        f_init = first_name.strip()[0].lower() if first_name else ""
        
        # 2. Obtener inicial del segundo nombre si existe
        m_init = ""
        if middle_name and middle_name.strip():
            m_init = middle_name.strip()[0].lower()
            
        # 3. Obtener apellido (en minúsculas y sin espacios)
        lname = last_name.strip().replace(" ", "").lower() if last_name else ""
        
        base_username = f"{f_init}{m_init}{lname}"
        
        # 4. Resolver colisión en la base de datos
        username = base_username
        counter = 1
        while db.query(User).filter(func.lower(User.username) == username).first() is not None:
            username = f"{base_username}{counter}"
            counter += 1
            
        return username

    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        # 1. Validar unicidad (email, dni)
        if db.query(Person).filter(Person.email == user_in.person.email).first():
            raise EntityAlreadyExistsException(f"El correo electrónico '{user_in.person.email}' ya está registrado.")

        if db.query(Person).filter(Person.dni == user_in.person.dni).first():
            raise EntityAlreadyExistsException(f"El DNI '{user_in.person.dni}' ya está registrado.")

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

            # Generar nombre de usuario único de manera automática
            generated_username = UserService._generate_unique_username(
                db,
                person_obj.first_name,
                person_obj.middle_name,
                person_obj.last_name
            )

            # Crear Usuario (guardar en minúsculas)
            user_obj = User(
                id_person=person_obj.id,
                username=generated_username,
                password_hash=pwd_context.hash(user_in.password), # En producción, hash con passlib/bcrypt
                active=True
            )
            db.add(user_obj)
            db.flush()

            # Guardar roles
            if user_in.roles:
                for role_name in user_in.roles:
                    role_obj = db.query(Role).filter(Role.name == role_name, Role.active == True).first()
                    if not role_obj:
                        raise EntityNotFoundException(f"El rol '{role_name}' no existe o está inactivo.")

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

        # Validar unicidad si cambian campos únicos (case-insensitive)
        if user_in.username:
            username_lower = user_in.username.lower()
            if username_lower != user_obj.username.lower():
                if db.query(User).filter(func.lower(User.username) == username_lower).first():
                    raise EntityAlreadyExistsException(f"El nombre de usuario '{user_in.username}' ya está registrado.")

        if user_in.person:
            if user_in.person.email and user_in.person.email != user_obj.person.email:
                if db.query(Person).filter(Person.email == user_in.person.email).first():
                    raise EntityAlreadyExistsException(f"El correo electrónico '{user_in.person.email}' ya está registrado.")
            if user_in.person.dni and user_in.person.dni != user_obj.person.dni:
                if db.query(Person).filter(Person.dni == user_in.person.dni).first():
                    raise EntityAlreadyExistsException(f"El DNI '{user_in.person.dni}' ya está registrado.")

        try:
            # Actualizar Persona
            if user_in.person:
                person_data = user_in.person.model_dump(exclude_unset=True)
                for key, value in person_data.items():
                    setattr(user_obj.person, key, value)

            # Actualizar Usuario (guardar en minúsculas)
            if user_in.username:
                user_obj.username = user_in.username.lower()
            if user_in.password:
                user_obj.password_hash=pwd_context.hash(user_in.password)
            # Actualizar Roles si se especifican
            if user_in.roles is not None:
                # Eliminar asociaciones previas
                db.query(UserRole).filter(UserRole.id_user == user_obj.id_person).delete()
                
                for role_name in user_in.roles:
                    role_obj = db.query(Role).filter(Role.name == role_name, Role.active == True).first()
                    if not role_obj:
                        raise EntityNotFoundException(f"El rol '{role_name}' no existe o está inactivo.")

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

    @staticmethod
    def update_user_roles(db: Session, id_person: str, roles: list[str]) -> User:
        user_obj = UserService.get_user_by_id(db, id_person)
        try:
            # Eliminar asociaciones previas
            db.query(UserRole).filter(UserRole.id_user == user_obj.id_person).delete()

            for role_name in roles:
                role_obj = db.query(Role).filter(Role.name == role_name, Role.active == True).first()
                if not role_obj:
                    raise EntityNotFoundException(f"El rol '{role_name}' no existe o está inactivo.")

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

from typing import List
from app.repositories.user_repository import IUserRepository
from app.core.hasher import PasswordHasher
from app.schemas.user import UserCreate, UserUpdate
from app.exceptions import NotFoundError, ConflictError, InternalError
from app.models.person import Person
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole


class UserService:
    def __init__(self, repo: IUserRepository, hasher: PasswordHasher):
        self.repo = repo
        self.hasher = hasher

    def get_user_by_id(self, id_person: str) -> User:
        user = self.repo.get_user_by_id(id_person)
        if not user:
            raise NotFoundError(f"Usuario con ID {id_person} no encontrado o inactivo.")
        return user

    def get_users(self) -> List[User]:
        return self.repo.get_users()

    def create_user(self, user_in: UserCreate) -> User:
        # Validaciones de unicidad
        if self.repo.get_by_username(user_in.username):
            raise ConflictError(f"El nombre de usuario '{user_in.username}' ya está registrado.")

        if self.repo.get_person_by_email(user_in.person.email):
            raise ConflictError(f"El correo electrónico '{user_in.person.email}' ya está registrado.")

        if self.repo.get_person_by_dni(user_in.person.dni):
            raise ConflictError(f"El DNI '{user_in.person.dni}' ya está registrado.")

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
                active=True,
            )
            self.repo.add_person(person_obj)

            # Hashear contraseña
            try:
                hashed_pw = self.hasher.hash(user_in.password)
            except Exception as e:
                self.repo.rollback()
                raise InternalError(str(e))

            # Crear Usuario
            user_obj = User(
                id_person=person_obj.id,
                username=user_in.username,
                password_hash=hashed_pw,
                active=True,
            )
            self.repo.add_user(user_obj)

            # Guardar roles
            if user_in.roles:
                for role_name in user_in.roles:
                    role_obj = self.repo.get_role_by_name(role_name)
                    if not role_obj:
                        role_obj = Role(name=role_name, active=True, description=f"Rol de {role_name}")
                        self.repo.add_role(role_obj)

                    user_role_obj = UserRole(id_user=user_obj.id_person, id_role=role_obj.id, active=True)
                    self.repo.add_user_role(user_role_obj)

            self.repo.commit()
            self.repo.refresh(user_obj)
            return user_obj
        except Exception as e:
            self.repo.rollback()
            raise InternalError(str(e))

    def update_user(self, id_person: str, user_in: UserUpdate) -> User:
        user_obj = self.get_user_by_id(id_person)

        # Validar unicidad si cambian campos únicos
        if user_in.username and user_in.username != user_obj.username:
            if self.repo.get_by_username(user_in.username):
                raise ConflictError(f"El nombre de usuario '{user_in.username}' ya está registrado.")

        if user_in.person:
            if user_in.person.email and user_in.person.email != user_obj.person.email:
                if self.repo.get_person_by_email(user_in.person.email):
                    raise ConflictError(f"El correo electrónico '{user_in.person.email}' ya está registrado.")
            if user_in.person.dni and user_in.person.dni != user_obj.person.dni:
                if self.repo.get_person_by_dni(user_in.person.dni):
                    raise ConflictError(f"El DNI '{user_in.person.dni}' ya está registrado.")

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
                try:
                    user_obj.password_hash = self.hasher.hash(user_in.password)
                except Exception as e:
                    self.repo.rollback()
                    raise InternalError(str(e))

            # Actualizar Roles si se especifican
            if user_in.roles is not None:
                # Eliminar asociaciones previas
                self.repo.delete_user_roles(user_obj.id_person)

                for role_name in user_in.roles:
                    role_obj = self.repo.get_role_by_name(role_name)
                    if not role_obj:
                        role_obj = Role(name=role_name, active=True, description=f"Rol de {role_name}")
                        self.repo.add_role(role_obj)

                    user_role_obj = UserRole(id_user=user_obj.id_person, id_role=role_obj.id, active=True)
                    self.repo.add_user_role(user_role_obj)

            self.repo.commit()
            self.repo.refresh(user_obj)
            return user_obj
        except Exception as e:
            self.repo.rollback()
            raise InternalError(str(e))

    def delete_user(self, id_person: str) -> dict:
        user_obj = self.get_user_by_id(id_person)

        try:
            # Eliminación lógica (Inactivación)
            user_obj.active = False
            user_obj.person.active = False

            # Inactivar relaciones en user_role
            for ur in user_obj.user_roles:
                ur.active = False

            self.repo.commit()
            return {"message": f"Usuario con ID {id_person} inactivado exitosamente (eliminación lógica)."}
        except Exception as e:
            self.repo.rollback()
            raise InternalError(str(e))

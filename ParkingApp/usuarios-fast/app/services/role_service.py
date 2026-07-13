from sqlalchemy.orm import Session
from app.utils.exceptions import EntityNotFoundException, EntityAlreadyExistsException
from app.models.role import Role
from app.models.user_role import UserRole
from app.schemas.user import RoleCreate, RoleUpdate

class RoleService:
    @staticmethod
    def get_role_by_id(db: Session, role_id: str) -> Role:
        role = db.query(Role).filter(Role.id == role_id, Role.active == True).first()
        if not role:
            raise EntityNotFoundException(f"Rol con ID {role_id} no encontrado o inactivo.")
        return role

    @staticmethod
    def get_roles(db: Session) -> list[Role]:
        return db.query(Role).filter(Role.active == True).all()

    @staticmethod
    def create_role(db: Session, role_in: RoleCreate) -> Role:
        # Validar si el rol con ese nombre ya existe
        existing_role = db.query(Role).filter(Role.name == role_in.name).first()
        if existing_role:
            if existing_role.active:
                raise EntityAlreadyExistsException(f"El rol con nombre '{role_in.name}' ya está registrado.")
            else:
                # Si existía inactivo, lo reactivamos y actualizamos la descripción
                existing_role.active = True
                existing_role.description = role_in.description
                db.commit()
                db.refresh(existing_role)
                return existing_role

        role_obj = Role(
            name=role_in.name,
            description=role_in.description,
            active=True
        )
        db.add(role_obj)
        db.commit()
        db.refresh(role_obj)
        return role_obj

    @staticmethod
    def update_role(db: Session, role_id: str, role_in: RoleUpdate) -> Role:
        role_obj = RoleService.get_role_by_id(db, role_id)

        if role_in.name and role_in.name != role_obj.name:
            existing_role = db.query(Role).filter(Role.name == role_in.name).first()
            if existing_role:
                raise EntityAlreadyExistsException(f"El rol con nombre '{role_in.name}' ya está registrado.")
            role_obj.name = role_in.name

        if role_in.description is not None:
            role_obj.description = role_in.description

        db.commit()
        db.refresh(role_obj)
        return role_obj

    @staticmethod
    def delete_role(db: Session, role_id: str) -> dict:
        role_obj = RoleService.get_role_by_id(db, role_id)

        try:
            # Eliminación lógica (Inactivar rol)
            role_obj.active = False
            
            # Inactivar relaciones asociadas en user_role
            db.query(UserRole).filter(UserRole.id_role == role_obj.id).update({"active": False})

            db.commit()
            return {"message": f"Rol con ID {role_id} inactivado exitosamente (eliminación lógica)."}
        except Exception as e:
            db.rollback()
            raise e

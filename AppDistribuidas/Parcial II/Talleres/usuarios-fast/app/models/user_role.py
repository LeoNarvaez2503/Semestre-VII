from sqlalchemy import Column, Boolean
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy import ForeignKey
from app.core.database import Base
from sqlalchemy.orm import relationship




class UserRole(Base):
    __tablename__ = "user_roles"

    id_user = Column(PGUUID(as_uuid=True), ForeignKey("users.id_person", ondelete="CASCADE"), primary_key=True)
    id_role = Column(PGUUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
    active = Column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")

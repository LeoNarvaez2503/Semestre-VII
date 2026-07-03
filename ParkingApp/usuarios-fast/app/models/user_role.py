from sqlalchemy import Column, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(Base):
    __tablename__ = "user_role"

    id_user = Column(UUID(as_uuid=True), ForeignKey("users.id_person", ondelete="CASCADE"), primary_key=True)
    id_role = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
    active = Column(Boolean, default=True, nullable=False)
    assigned_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")

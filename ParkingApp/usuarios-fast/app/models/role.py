import uuid
from sqlalchemy import Column, String, Boolean, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    description = Column(Text, nullable=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user_roles = relationship("UserRole", back_populates="role")

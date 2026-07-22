

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id_person = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"), primary_key=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    last_login = Column(DateTime(timezone=False), nullable=True)
    password_hash = Column(String(255), nullable=False)
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)
    username = Column(String(15), unique=True, nullable=False, index=True)

    # Relationships
    person = relationship("Person", back_populates="user")
    user_roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")

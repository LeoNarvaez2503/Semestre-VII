import uuid
from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from app.core.database import Base
from sqlalchemy.orm import relationship


class Person(Base):
    __tablename__ = "persons"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dni = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    nationality = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="person", uselist=False)

    # relationship backref defined in User model

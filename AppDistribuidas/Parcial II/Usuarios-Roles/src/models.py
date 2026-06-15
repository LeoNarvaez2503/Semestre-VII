import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, Text
from sqlalchemy.orm import relationship
from src.db import Base


def gen_uuid():
    return str(uuid.uuid4())


class Person(Base):
    __tablename__ = "persons"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    active = Column(Boolean, default=True, nullable=False)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    dni = Column(String(30), nullable=True)
    email = Column(String(50), nullable=True)
    first_name = Column(String(30), nullable=True)
    last_name = Column(String(30), nullable=True)
    middle_name = Column(String(30), nullable=True)
    nationality = Column(String(30), nullable=True)
    phone = Column(String(15), nullable=True)

    user = relationship("User", back_populates="person", uselist=False)


class Role(Base):
    __tablename__ = "roles"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    description = Column(Text, nullable=True)
    name = Column(String(50), nullable=False)

    user_roles = relationship("UserRole", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    password_hash = Column(String(255), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    username = Column(String(50), unique=True, nullable=False)

    person_id = Column(String(36), ForeignKey("persons.id"), nullable=True)
    person = relationship("Person", back_populates="user")

    roles = relationship("UserRole", back_populates="user")


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    active = Column(Boolean, default=True, nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role_id = Column(String(36), ForeignKey("roles.id"), nullable=False)

    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="user_roles")

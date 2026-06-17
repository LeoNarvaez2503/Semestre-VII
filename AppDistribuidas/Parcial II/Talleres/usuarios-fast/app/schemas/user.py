from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# --- PERSON SCHEMAS ---
class PersonBase(BaseModel):
    dni: str = Field(..., max_length=30)
    email: EmailStr = Field(..., max_length=50)
    first_name: str = Field(..., max_length=30)
    last_name: str = Field(..., max_length=30)
    middle_name: Optional[str] = Field(None, max_length=30)
    nationality: Optional[str] = Field(None, max_length=30)
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = None

class PersonCreate(PersonBase):
    pass

class PersonUpdate(BaseModel):
    dni: Optional[str] = Field(None, max_length=30)
    email: Optional[EmailStr] = Field(None, max_length=50)
    first_name: Optional[str] = Field(None, max_length=30)
    last_name: Optional[str] = Field(None, max_length=30)
    middle_name: Optional[str] = Field(None, max_length=30)
    nationality: Optional[str] = Field(None, max_length=30)
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = None

class PersonResponse(PersonBase):
    id: UUID
    active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- ROLE SCHEMAS ---
class RoleCreate(BaseModel):
    name: str = Field(..., max_length=50)
    description: Optional[str] = None

class RoleUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None

class RoleResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    active: bool

    class Config:
        from_attributes = True


class UserRoleResponse(BaseModel):
    active: bool
    assigned_at: datetime
    role: RoleResponse

    class Config:
        from_attributes = True


# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=15)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)
    person: PersonCreate
    roles: Optional[List[str]] = []

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=15)
    password: Optional[str] = Field(None, min_length=8, max_length=72)
    person: Optional[PersonUpdate] = None
    roles: Optional[List[str]] = None

class UserResponse(UserBase):
    id_person: UUID
    active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    updated_at: datetime
    person: PersonResponse
    user_roles: List[UserRoleResponse] = []

    class Config:
        from_attributes = True

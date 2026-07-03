from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from app.utils.validators import validate_no_spaces, validate_real_name, validate_username_format, validate_safe_text
from datetime import datetime
from uuid import UUID
from stdnum.ec import ci

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

    @field_validator('dni')
    @classmethod
    def validate_dni(cls, v: str) -> str:
        if not ci.is_valid(v):
            raise ValueError('DNI inválido')
        return validate_no_spaces('DNI', v)

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        return validate_no_spaces('email', v)

    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v: str) -> str:
        return validate_real_name('primer nombre', v)

    @field_validator('middle_name')
    @classmethod
    def validate_middle_name(cls, v: Optional[str]) -> Optional[str]:
        return validate_real_name('segundo nombre', v)

    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v: str) -> str:
        return validate_real_name('apellido', v)

    @field_validator('nationality')
    @classmethod
    def validate_nationality(cls, v: str) -> str:
        return validate_real_name('nacionalidad', v)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        return validate_no_spaces('telefono', v)

    @field_validator('address')
    @classmethod
    def validate_address(cls, v: str) -> str:
        return validate_safe_text('direccion', v)

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

    @field_validator('dni')
    @classmethod
    def validate_dni(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not ci.is_valid(v):
                raise ValueError('DNI inválido')
            return validate_no_spaces('DNI', v)
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: Optional[EmailStr]) -> Optional[EmailStr]:
        return validate_no_spaces('email', v)

    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v: Optional[str]) -> Optional[str]:
        return validate_real_name('primer nombre', v)

    @field_validator('middle_name')
    @classmethod
    def validate_middle_name(cls, v: Optional[str]) -> Optional[str]:
        return validate_real_name('segundo nombre', v)

    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v: Optional[str]) -> Optional[str]:
        return validate_real_name('apellido', v)

    @field_validator('nationality')
    @classmethod
    def validate_nationality(cls, v: Optional[str]) -> Optional[str]:
        return validate_real_name('nacionalidad', v)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        return validate_no_spaces('telefono', v)

    @field_validator('address')
    @classmethod
    def validate_address(cls, v: Optional[str]) -> Optional[str]:
        return validate_safe_text('direccion', v)

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

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        return validate_username_format(v)

class UserCreate(BaseModel):
    password: str = Field(..., min_length=8, max_length=72)
    person: PersonCreate
    roles: Optional[List[str]] = []

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=15)
    password: Optional[str] = Field(None, min_length=8, max_length=72)
    person: Optional[PersonUpdate] = None
    roles: Optional[List[str]] = None

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        return validate_username_format(v)

class UserRolesUpdate(BaseModel):
    roles: List[str]

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

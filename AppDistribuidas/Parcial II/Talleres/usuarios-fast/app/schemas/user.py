from typing import Optional, List
from pydantic import BaseModel, EmailStr


class PersonBase(BaseModel):
    dni: str
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    nationality: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class PersonCreate(PersonBase):
    pass


class PersonUpdate(BaseModel):
    dni: Optional[str]
    email: Optional[EmailStr]
    first_name: Optional[str]
    last_name: Optional[str]
    middle_name: Optional[str]
    nationality: Optional[str]
    phone: Optional[str]
    address: Optional[str]


class UserCreate(BaseModel):
    username: str
    password: str
    roles: Optional[List[str]] = None
    person: PersonCreate


class UserUpdate(BaseModel):
    username: Optional[str]
    password: Optional[str]
    roles: Optional[List[str]]
    person: Optional[PersonUpdate]


class UserOut(BaseModel):
    id_person: str
    username: str
    active: bool

    class Config:
        orm_mode = True

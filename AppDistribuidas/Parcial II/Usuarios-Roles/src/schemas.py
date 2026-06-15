from pydantic import BaseModel
from typing import Optional, List


class PersonCreate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    middle_name: Optional[str]
    nationality: Optional[str]
    phone: Optional[str]
    dni: Optional[str]
    email: Optional[str]
    address: Optional[str]


class RoleRead(BaseModel):
    id: str
    name: str
    description: Optional[str]
    active: bool

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    username: str
    password_hash: Optional[str]
    person: Optional[PersonCreate]


class UserRead(BaseModel):
    id: str
    username: str
    active: bool
    person: Optional[PersonCreate]
    roles: Optional[List[RoleRead]]

    class Config:
        orm_mode = True

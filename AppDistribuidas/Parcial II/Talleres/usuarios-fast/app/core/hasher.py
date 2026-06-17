from typing import Protocol
from app.exceptions import HashingError
from app.core import security


class PasswordHasher(Protocol):
    def hash(self, password: str) -> str: ...

    def verify(self, plain: str, hashed: str) -> bool: ...


class PasslibHasher:
    """Implementación concreta de `PasswordHasher` usando `app.core.security`."""

    def hash(self, password: str) -> str:
        try:
            return security.get_password_hash(password)
        except ValueError as e:
            raise HashingError(str(e))
        except Exception as e:
            raise HashingError("Error al hashear la contraseña")

    def verify(self, plain: str, hashed: str) -> bool:
        try:
            return security.verify_password(plain, hashed)
        except Exception:
            raise HashingError("Error al verificar la contraseña")

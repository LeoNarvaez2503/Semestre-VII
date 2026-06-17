from passlib.context import CryptContext
from typing import Union

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _truncate_password(password: Union[str, bytes], limit: int = 72) -> Union[str, bytes]:
    if isinstance(password, str):
        pw_bytes = password.encode("utf-8")
        if len(pw_bytes) > limit:
            pw_bytes = pw_bytes[:limit]
            return pw_bytes.decode("utf-8", errors="ignore")
        return password
    else:
        return password[:limit]


def get_password_hash(password: str) -> str:
    pw = _truncate_password(password)
    return pwd_context.hash(pw)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pw = _truncate_password(plain_password)
    return pwd_context.verify(pw, hashed_password)

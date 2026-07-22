import re
import unicodedata
from typing import Optional

# Palabras clave SQL prohibidas comunes para mitigar cualquier intento de inyección
BANNED_SQL_KEYWORDS = {
    "select", "insert", "update", "delete", "drop", "alter", "create",
    "table", "database", "where", "order", "by", "group", "having",
    "union", "join", "exec", "execute", "truncate", "like", "into"
}

def validate_no_spaces(field_name: str, value: Optional[str]) -> Optional[str]:
    """
    Valida que una cadena no contenga espacios intermedios y recorta los extremos.
    """
    if value is not None:
        trimmed = value.strip()
        if not trimmed:
            return None
        if ' ' in trimmed:
            raise ValueError(f"El {field_name} no puede contener espacios")
        return trimmed
    return value

def validate_real_name(field_name: str, value: Optional[str]) -> Optional[str]:
    """
    Valida que un campo represente un nombre real (solo letras y acentos, sin espacios ni palabras SQL).
    """
    if value is not None:
        trimmed = value.strip()
        if not trimmed:
            return None
        if ' ' in trimmed:
            raise ValueError(f"El {field_name} no puede contener espacios")
        if not re.match(r"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$", trimmed):
            raise ValueError(f"El {field_name} solo debe contener letras")
        if trimmed.lower() in BANNED_SQL_KEYWORDS:
            raise ValueError(f"El {field_name} contiene términos reservados no permitidos")
        return trimmed
    return value

def validate_username_format(value: Optional[str]) -> Optional[str]:
    """
    Valida que el nombre de usuario sea seguro y contenga solo caracteres alfanuméricos/guiones.
    """
    if value is not None:
        trimmed = value.strip()
        if not trimmed:
            return None
        if ' ' in trimmed:
            raise ValueError("El nombre de usuario no puede contener espacios")
        if not re.match(r"^[a-zA-Z0-9_\-]+$", trimmed):
            raise ValueError("El nombre de usuario solo puede contener letras, números, guiones y guiones bajos")
        if trimmed.lower() in BANNED_SQL_KEYWORDS:
            raise ValueError("El nombre de usuario contiene términos reservados no permitidos")
        return trimmed
    return value

def validate_safe_text(field_name: str, value: Optional[str]) -> Optional[str]:
    """
    Valida texto descriptivo que sí puede tener espacios (ej. dirección) pero sanitiza contra inyección SQL.
    """
    if value is not None:
        trimmed = value.strip()
        if not trimmed:
            return None
        # Verificar caracteres de comentarios y terminadores SQL peligrosos
        if any(seq in trimmed for seq in (";", "--", "/*", "*/")):
            raise ValueError(f"La {field_name} contiene caracteres no permitidos")
        # Verificar si hay palabras clave SQL aisladas
        words = re.findall(r'\b\w+\b', trimmed.lower())
        for word in words:
            if word in BANNED_SQL_KEYWORDS:
                raise ValueError(f"La {field_name} contiene palabras reservadas no permitidas")
        return trimmed
    return value

def validate_role_name_format(value: Optional[str]) -> Optional[str]:
    """
    Valida alfabético, remueve acentos y retorna en formato Title Case (ej. 'técnico' -> 'Tecnico').
    """
    if value is not None:
        trimmed = value.strip()
        if ' ' in trimmed:
            raise ValueError("El nombre del rol no puede contener espacios")
        # Validar alfabético
        if not re.match(r"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$", trimmed):
            raise ValueError("El nombre del rol solo puede contener letras (sin números ni caracteres especiales)")
        
        # Remover acentos y diacríticos
        nfkd_form = unicodedata.normalize('NFKD', trimmed)
        only_ascii = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
        
        return only_ascii.capitalize()
    return value

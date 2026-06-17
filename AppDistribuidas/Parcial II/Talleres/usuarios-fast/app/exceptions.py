class NotFoundError(Exception):
    """Entidad no encontrada en la capa de dominio."""
    pass


class ConflictError(Exception):
    """Conflicto de negocio (por ejemplo, unicidad)."""
    pass


class HashingError(Exception):
    """Error al procesar/hasear la contraseña."""
    pass


class InternalError(Exception):
    """Error interno de la aplicación."""
    pass

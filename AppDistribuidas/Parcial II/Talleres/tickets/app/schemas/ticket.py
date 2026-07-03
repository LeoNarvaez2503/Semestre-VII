from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class TicketCreate(BaseModel):
    id_espacio: UUID
    id_vehiculo: UUID
    id_usuario: UUID

class TicketResponse(BaseModel):
    id_ticket: UUID
    id_espacio: UUID
    id_vehiculo: UUID
    id_usuario: UUID
    codigo_ticket: str
    fecha_hora_ingreso: datetime
    fecha_hora_salida: Optional[datetime] = None
    estado_ticket: str
    valor_recaudado: float

    model_config = ConfigDict(from_attributes=True)

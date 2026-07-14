import uuid
from sqlalchemy import Column, String, DateTime, Float, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id_ticket = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_espacio = Column(UUID(as_uuid=True), nullable=False)
    id_vehiculo = Column(UUID(as_uuid=True), nullable=False)
    id_usuario = Column(UUID(as_uuid=True), nullable=False)
    codigo_ticket = Column(String(100), unique=True, nullable=False, index=True)
    fecha_hora_ingreso = Column(DateTime, server_default=func.now(), nullable=False)
    fecha_hora_salida = Column(DateTime, nullable=True)
    estado_ticket = Column(String(20), default="activo", nullable=False)  # "activo" / "pagado"
    valor_recaudado = Column(Float, default=0.0, nullable=False)

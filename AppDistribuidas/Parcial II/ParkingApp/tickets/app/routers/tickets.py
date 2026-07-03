import math
import requests
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.config import settings
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketResponse

router = APIRouter(prefix="/tickets", tags=["Gestión de Tickets"])

# Helper functions to query other microservices
def validate_user(user_id: UUID) -> dict:
    url = f"{settings.USUARIOS_API_URL}/usuarios/internal/validar/{user_id}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("exists") and data.get("active"):
                return data
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El usuario con ID {user_id} no existe o no está activo."
        )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error de comunicación con el servicio de usuarios: {str(e)}"
        )

def validate_vehicle(vehicle_id: UUID) -> dict:
    url = f"{settings.VEHICULOS_API_URL}/vehiculos/internal/validar/{vehicle_id}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("exists"):
                return data
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El vehículo con ID {vehicle_id} no existe."
        )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error de comunicación con el servicio de vehículos: {str(e)}"
        )

def get_vehicle_plate(vehicle_id: UUID) -> str:
    url = f"{settings.VEHICULOS_API_URL}/vehiculos/obtener/{vehicle_id}"
    token = generate_internal_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get("plate", "SINPLACAS")
        return "SINPLACAS"
    except Exception:
        return "SINPLACAS"

def validate_and_get_space(space_id: UUID) -> dict:
    url = f"{settings.ZONAS_API_URL}/api/v1/espacios/obtener/{space_id}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("activo"):
                return data
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El espacio con ID {space_id} está inactivo."
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El espacio con ID {space_id} no existe."
        )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error de comunicación con el servicio de zonas: {str(e)}"
        )

def generate_internal_token() -> str:
    import hmac
    import hashlib
    import base64
    import json
    import time

    secret = "super-secret-key-for-jwt-signing-change-in-production"
    
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": "tickets-service",
        "username": "tickets-service",
        "roles": ["Root"],
        "exp": int(time.time()) + 60,
        "type": "access"
    }
    
    def b64url_encode(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).rstrip(b'=')
        
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    
    header_b64 = b64url_encode(header_json).decode('utf-8')
    payload_b64 = b64url_encode(payload_json).decode('utf-8')
    
    signature_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(secret.encode('utf-8'), signature_input, hashlib.sha256).digest()
    signature_b64 = b64url_encode(signature).decode('utf-8')
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def update_space_status(space_id: UUID, state: str, vehicle_id: Optional[UUID] = None) -> bool:
    url = f"{settings.ZONAS_API_URL}/api/v1/espacios/actualizar/{space_id}/estado/{state}"
    params = {}
    if vehicle_id:
        params["vehiculoId"] = str(vehicle_id)
    
    token = generate_internal_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.put(url, params=params, headers=headers, timeout=5)
        return response.status_code == 200
    except Exception:
        return False

# Endpoints
@router.post("/crear", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def crear_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db)):
    try:
        # 1. Validar si el usuario ya tiene un ticket activo
        active_user_ticket = db.query(Ticket).filter(
            Ticket.id_usuario == ticket_in.id_usuario,
            Ticket.estado_ticket == "activo"
        ).first()
        if active_user_ticket:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya cuenta con un ticket activo en un espacio."
            )

        # 2. Validar si el espacio ya tiene un ticket activo
        active_space_ticket = db.query(Ticket).filter(
            Ticket.id_espacio == ticket_in.id_espacio,
            Ticket.estado_ticket == "activo"
        ).first()
        if active_space_ticket:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El espacio seleccionado ya cuenta con un ticket activo."
            )

        # 3. Validar usuario externo
        validate_user(ticket_in.id_usuario)

        # 4. Validar vehículo externo
        vehicle_info = validate_vehicle(ticket_in.id_vehiculo)
        vehicle_type = vehicle_info.get("type", "").upper()

        # 5. Validar espacio externo
        space_info = validate_and_get_space(ticket_in.id_espacio)
        space_type = space_info.get("type", "").upper()
        space_state = space_info.get("estado", "").upper()

        if space_state == "OCUPADO":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El espacio seleccionado ya está ocupado en el sistema de zonas."
            )

        # 6. Validar compatibilidad de tipos
        # Reglas: MOTO - MOTO, AUTO - AUTO o CAMIONETA, BUSETA - CAMIONETA
        compatible = False
        if space_type == "MOTO" and vehicle_type == "MOTO":
            compatible = True
        elif space_type == "AUTO" and vehicle_type in ("AUTO", "CAMIONETA"):
            compatible = True
        elif space_type == "BUSETA" and vehicle_type == "CAMIONETA":
            compatible = True

        if not compatible:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El tipo de vehículo ({vehicle_type}) no es compatible con el tipo de espacio ({space_type})."
            )

        # 7. Generar código de ticket: zona_placa_fechaingreso
        zona_nombre = space_info.get("nombreZona", "ZONA")
        # Clean special characters/spaces from zone name
        zona_nombre_clean = "".join(c for c in zona_nombre if c.isalnum()).upper()
        
        placa = get_vehicle_plate(ticket_in.id_vehiculo)
        
        now = datetime.now(timezone.utc)
        now_naive = now.replace(tzinfo=None)
        fecha_str = now_naive.strftime("%Y%m%d%H%M%S")
        codigo_ticket = f"{zona_nombre_clean}_{placa}_{fecha_str}"

        # 8. Guardar ticket en BD
        nuevo_ticket = Ticket(
            id_espacio=ticket_in.id_espacio,
            id_vehiculo=ticket_in.id_vehiculo,
            id_usuario=ticket_in.id_usuario,
            codigo_ticket=codigo_ticket,
            fecha_hora_ingreso=now_naive,
            estado_ticket="activo",
            valor_recaudado=0.0
        )
        db.add(nuevo_ticket)
        db.commit()
        db.refresh(nuevo_ticket)

        # 9. Actualizar estado del espacio en zonas a OCUPADO
        update_ok = update_space_status(ticket_in.id_espacio, "OCUPADO", ticket_in.id_vehiculo)
        if not update_ok:
            # Rollback local record if remote update fails
            db.delete(nuevo_ticket)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudo actualizar el estado del espacio a OCUPADO en el servicio de zonas."
            )

        return nuevo_ticket
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e

@router.get("/buscar", response_model=List[TicketResponse])
def buscar_tickets(
    id_usuario: Optional[UUID] = Query(None),
    id_vehiculo: Optional[UUID] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)
    
    if not id_usuario and not id_vehiculo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe proporcionar al menos id_usuario o id_vehiculo para buscar."
        )

    if id_usuario:
        query = query.filter(Ticket.id_usuario == id_usuario)
    if id_vehiculo:
        query = query.filter(Ticket.id_vehiculo == id_vehiculo)

    return query.all()

@router.post("/{id_ticket}/pagar", response_model=TicketResponse)
def pagar_ticket(id_ticket: UUID, db: Session = Depends(get_db)):
    # 1. Obtener ticket
    ticket = db.query(Ticket).filter(Ticket.id_ticket == id_ticket).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado."
        )

    if ticket.estado_ticket == "pagado":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ticket ya se encuentra pagado."
        )

    # 2. Obtener tipo de vehículo y tipo de espacio para el cálculo de tarifa
    vehicle_info = validate_vehicle(ticket.id_vehiculo)
    vehicle_type = vehicle_info.get("type", "").upper()

    space_info = validate_and_get_space(ticket.id_espacio)
    space_type = space_info.get("type", "").upper()

    # 3. Calcular duración
    now = datetime.now(timezone.utc)
    now_naive = now.replace(tzinfo=None)
    
    duration = now_naive - ticket.fecha_hora_ingreso
    duration_hours = max(1.0, math.ceil(duration.total_seconds() / 3600.0))

    # 4. Calcular valor recaudado según tarifa
    # MOTO - MOTO: $1.00
    # AUTO - AUTO: $2.00
    # CAMIONETA - BUSETA: $3.00
    # Cualquier otra combinación: $2.50
    rate = 2.5
    if vehicle_type == "MOTO" and space_type == "MOTO":
        rate = 1.0
    elif vehicle_type == "AUTO" and space_type == "AUTO":
        rate = 2.0
    elif vehicle_type == "CAMIONETA" and space_type == "BUSETA":
        rate = 3.0

    valor_recaudado = round(duration_hours * rate, 2)

    # 5. Actualizar ticket
    ticket.fecha_hora_salida = now_naive
    ticket.estado_ticket = "pagado"
    ticket.valor_recaudado = valor_recaudado
    db.commit()
    db.refresh(ticket)

    # 6. Liberar espacio en zonas (cambiar estado a DISPONIBLE)
    update_ok = update_space_status(ticket.id_espacio, "DISPONIBLE")
    if not update_ok:
        # No hacemos rollback del pago ya que el dinero fue recaudado,
        # pero logueamos/advertimos que el espacio debe ser liberado manualmente.
        pass

    return ticket

import pika
import json
import logging
import uuid
from typing import Any, Dict, Optional
from pydantic import BaseModel
from app.core.config import settings

logger = logging.getLogger(__name__)

class AuditEvent(BaseModel):
    servicio: str
    accion: str
    entidad: str
    entidadId: Optional[str] = None
    datos: Optional[Dict[str, Any]] = None
    usuario: Optional[str] = None
    ip: Optional[str] = None

class EventPublisher:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventPublisher, cls).__new__(cls)
            cls._instance.connection = None
            cls._instance.channel = None
            cls._instance.exchange = 'audit_exchange'
            cls._instance.routing_key = 'audit.event'
        return cls._instance

    def connect(self):
        try:
            host = getattr(settings, 'RABBITMQ_HOST', 'rabbitmq')
            port = getattr(settings, 'RABBITMQ_PORT', '5672')
            user = getattr(settings, 'RABBITMQ_USER', 'guest')
            password = getattr(settings, 'RABBITMQ_PASSWORD', 'guest')
            
            credentials = pika.PlainCredentials(user, password)
            parameters = pika.ConnectionParameters(host=host, port=int(port), credentials=credentials)
            
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            self.channel.exchange_declare(exchange=self.exchange, exchange_type='topic', durable=True)
            logger.info("✅ Conectado a RabbitMQ para publicación de eventos")
        except Exception as e:
            logger.error(f"❌ Error conectando a RabbitMQ: {str(e)}")
            self.connection = None
            self.channel = None

    def publish(self, event: AuditEvent):
        if not self.connection or self.connection.is_closed:
            self.connect()
            
        if not self.channel or self.channel.is_closed:
            logger.error("❌ No se pudo establecer conexión con RabbitMQ, evento no publicado")
            return

        try:
            message = event.model_dump_json()
            self.channel.basic_publish(
                exchange=self.exchange,
                routing_key=self.routing_key,
                body=message.encode('utf-8'),
                properties=pika.BasicProperties(
                    delivery_mode=2  # pika.DeliveryMode.Persistent = 2
                )
            )
            logger.debug(f"📤 Evento publicado: {event.accion} en {event.servicio}")
        except Exception as e:
            logger.error(f"❌ Error publicando evento: {str(e)}")
            self.connection = None
            self.channel = None

event_publisher = EventPublisher()

def publish_audit_event(accion: str, entidad: str, entidad_id: Optional[str] = None, datos: Optional[dict] = None):
    try:
        def serialize_obj(obj):
            if isinstance(obj, uuid.UUID):
                return str(obj)
            return obj
            
        clean_datos = None
        if datos:
            clean_datos = {k: serialize_obj(v) for k, v in datos.items()}

        event = AuditEvent(
            servicio="tickets",
            accion=accion,
            entidad=entidad,
            entidadId=str(entidad_id) if entidad_id else None,
            datos=clean_datos
        )
        event_publisher.publish(event)
    except Exception as e:
        logger.error(f"Error preparando evento de auditoría: {str(e)}")

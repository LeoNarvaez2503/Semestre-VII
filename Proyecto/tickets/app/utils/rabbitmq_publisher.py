import pika
import json
import socket
import logging
import uuid
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger("rabbitmq_publisher")

def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
        s.close()
        return IP
    except Exception:
        return "127.0.0.1"

def get_mac_address() -> str:
    try:
        node = uuid.getnode()
        mac = ':'.join(('%012X' % node)[i:i+2] for i in range(0, 12, 2))
        if len(mac) == 17:
            return mac
    except Exception:
        pass
    return "02:42:ac:11:00:02"

def publish_audit_event(
    servicio: str,
    accion: str,
    entidad: str,
    datos: Optional[dict] = None,
    usuario: Optional[str] = None,
    request_ip: Optional[str] = None
) -> None:
    try:
        credentials = pika.PlainCredentials(settings.RABBITMQ_USER, settings.RABBITMQ_PASSWORD)
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=settings.RABBITMQ_HOST,
                port=settings.RABBITMQ_PORT,
                credentials=credentials,
                connection_attempts=3,
                retry_delay=5
            )
        )
        channel = connection.channel()
        channel.exchange_declare(exchange=settings.RABBITMQ_EXCHANGE, exchange_type='topic', durable=True)
        
        # Construir el evento de auditoria segun CreateAuditDto
        event = {
            "servicio": servicio,
            "accion": accion,
            "entidad": entidad,
            "datos": datos or {},
            "usuario": usuario,
            "ip": request_ip or get_local_ip(),
            "mac": get_mac_address()
        }
        
        routing_key = f"audit.{servicio.replace('ms-', '')}"
        
        channel.basic_publish(
            exchange=settings.RABBITMQ_EXCHANGE,
            routing_key=routing_key,
            body=json.dumps(event),
            properties=pika.BasicProperties(
                delivery_mode=2,
                content_type='application/json'
            )
        )
        connection.close()
        logger.info(f"Published audit event to RabbitMQ on key {routing_key}")
    except Exception as e:
        logger.error(f"Failed to publish audit event to RabbitMQ: {str(e)}")

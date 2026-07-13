package ec.edu.espe.zonas.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(EventPublisher.class);

    @Autowired
    private AmqpTemplate amqpTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange:audit_exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key:audit.event}")
    private String routingKey;

    public void publishEvent(String accion, String entidad, String entidadId, Object datos) {
        try {
            AuditEvent event = AuditEvent.builder()
                .servicio("zonas")
                .accion(accion)
                .entidad(entidad)
                .entidadId(entidadId)
                .datos(datos)
                .build();
                
            String message = objectMapper.writeValueAsString(event);
            amqpTemplate.convertAndSend(exchange, routingKey, message);
            logger.debug("📤 Evento publicado: {} en zonas", accion);
        } catch (Exception e) {
            logger.error("❌ Error publicando evento: {}", e.getMessage());
        }
    }

    @Data
    @Builder
    public static class AuditEvent {
        private String servicio;
        private String accion;
        private String entidad;
        private String entidadId;
        private Object datos;
        private String usuario;
        private String ip;
    }
}

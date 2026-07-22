package ec.edu.espe.zonas.utils;

import ec.edu.espe.zonas.dtos.AuditDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitMQAuditPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    public void publishEvent(String accion, String entidad, Map<String, Object> datos) {
        try {
            String ip = getClientIp();
            String mac = getMacAddress();
            String usuario = getUsernameFromToken();

            AuditDto auditDto = AuditDto.builder()
                    .servicio("ms-zones")
                    .accion(accion)
                    .entidad(entidad)
                    .datos(datos)
                    .usuario(usuario)
                    .ip(ip)
                    .mac(mac)
                    .build();

            String routingKey = "audit.zones";
            rabbitTemplate.convertAndSend(exchange, routingKey, auditDto);
            log.info("Published audit event to RabbitMQ on exchange {} and key {}", exchange, routingKey);
        } catch (Exception e) {
            log.error("Failed to publish audit event to RabbitMQ", e);
        }
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xfHeader = request.getHeader("X-Forwarded-For");
                if (xfHeader != null && !xfHeader.isEmpty()) {
                    return xfHeader.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            // ignore
        }
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (Exception e) {
            return "127.0.0.1";
        }
    }

    private String getMacAddress() {
        try {
            InetAddress localHost = InetAddress.getLocalHost();
            NetworkInterface ni = NetworkInterface.getByInetAddress(localHost);
            if (ni != null) {
                byte[] mac = ni.getHardwareAddress();
                if (mac != null) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < mac.length; i++) {
                        sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? ":" : ""));
                    }
                    return sb.toString();
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return "02:42:ac:11:00:02";
    }

    private String getUsernameFromToken() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    String[] parts = token.split("\\.");
                    if (parts.length == 3) {
                        String payloadB64 = parts[1];
                        byte[] decodedBytes = Base64.getUrlDecoder().decode(payloadB64);
                        String payloadJson = new String(decodedBytes, StandardCharsets.UTF_8);
                        
                        // Simple JSON extraction to avoid heavy libraries
                        int usernameIndex = payloadJson.indexOf("\"username\":\"");
                        if (usernameIndex != -1) {
                            int start = usernameIndex + 12;
                            int end = payloadJson.indexOf("\"", start);
                            return payloadJson.substring(start, end);
                        }
                    }
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return "anonymous";
    }
}

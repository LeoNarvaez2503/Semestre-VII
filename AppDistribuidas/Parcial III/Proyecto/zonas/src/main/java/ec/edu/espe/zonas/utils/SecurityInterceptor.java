package ec.edu.espe.zonas.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.List;
import java.util.Map;

@Component
public class SecurityInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // 1. Permitir solicitudes de lectura públicas (GET) a zonas y espacios
        // GET /api/v1/zonas/listar
        // GET /api/v1/espacios/listar
        // GET /api/v1/espacios/obtener/{id}
        // GET /api/v1/espacios/estado/{estado}
        // GET /api/v1/espacios/zona/{idZona}/estado/{estado}
        // GET /zonas/docs, /zonas/swagger-ui/*, /zonas/openapi.json (documentación)
        if (method.equalsIgnoreCase("GET")) {
            if (path.startsWith("/api/v1/zonas/listar") ||
                path.startsWith("/api/v1/espacios/listar") ||
                path.startsWith("/api/v1/espacios/obtener/") ||
                path.startsWith("/api/v1/espacios/estado/") ||
                path.startsWith("/api/v1/espacios/zona/") ||
                path.contains("/docs") ||
                path.contains("/swagger") ||
                path.contains("/openapi.json")) {
                return true;
            }
        }

        // 2. Comprobar cabecera de autenticación
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token no proporcionado\"}");
            return false;
        }

        String token = authHeader.substring(7);
        Map<String, Object> payload = JwtDecoder.verifyAndDecode(token);
        if (payload == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token invalido o expirado\"}");
            return false;
        }

        // 3. Validar roles
        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) payload.get("roles");
        if (roles == null) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Acceso denegado: token sin roles\"}");
            return false;
        }

        // Root y Administrador tienen acceso para crear, actualizar, eliminar, cambiar estado
        if (roles.contains("Root") || roles.contains("Administrador")) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Acceso denegado: permisos insuficientes\"}");
        return false;
    }
}

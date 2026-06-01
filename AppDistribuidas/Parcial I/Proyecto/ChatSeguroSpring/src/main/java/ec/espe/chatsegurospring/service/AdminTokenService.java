package ec.espe.chatsegurospring.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminTokenService {

    private static final Logger log = LoggerFactory.getLogger(AdminTokenService.class);

    private final Map<String, Long> tokens = new ConcurrentHashMap<>();

    @Value("${chat.admin.username}")
    private String adminUsername;

    @Value("${chat.admin.password}")
    private String adminPassword;

    /**
     * Procesa la autenticación del administrador de forma asíncrona
     * usando el ThreadPoolTaskExecutor (hilo dedicado del pool).
     * Cumple requisito: "Procesamiento de autenticaciones concurrentes".
     */
    @Async("taskExecutor")
    public CompletableFuture<Optional<String>> authenticateAsync(String username, String password) {
        log.info("[HILO AUTH] Procesando autenticación en hilo: {}", Thread.currentThread().getName());

        if (!adminUsername.equals(username) || !adminPassword.equals(password)) {
            log.warn("[HILO AUTH] Credenciales inválidas en hilo: {}", Thread.currentThread().getName());
            return CompletableFuture.completedFuture(Optional.empty());
        }

        String token = createToken();
        log.info("[HILO AUTH] Token generado en hilo: {}", Thread.currentThread().getName());
        return CompletableFuture.completedFuture(Optional.of(token));
    }

    public String createToken() {
        String token = UUID.randomUUID().toString();
        tokens.put(token, System.currentTimeMillis());
        return token;
    }

    public boolean validToken(String token) {
        return token != null && tokens.containsKey(token);
    }

    public void revokeToken(String token) {
        if (token != null) {
            tokens.remove(token);
        }
    }
}

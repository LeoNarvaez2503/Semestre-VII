package ec.espe.chatsegurospring.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminTokenService {

    private final Map<String, Long> tokens = new ConcurrentHashMap<>();

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

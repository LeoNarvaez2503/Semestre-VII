package ec.edu.espe.zonas.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JwtDecoder {
    private static final String SECRET = "super-secret-key-for-jwt-signing-change-in-production";

    public static Map<String, Object> verifyAndDecode(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;

            String headerB64 = parts[0];
            String payloadB64 = parts[1];
            String signatureB64 = parts[2];

            // Verify signature
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256HMAC.init(secretKey);

            byte[] hash = sha256HMAC.doFinal((headerB64 + "." + payloadB64).getBytes(StandardCharsets.UTF_8));
            String expectedSignature = Base64.getUrlEncoder().withoutPadding().encodeToString(hash);

            if (!expectedSignature.equals(signatureB64)) {
                return null;
            }

            // Decode payload
            byte[] payloadBytes = Base64.getUrlDecoder().decode(payloadB64);
            String payloadJson = new String(payloadBytes, StandardCharsets.UTF_8);

            ObjectMapper mapper = new ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = mapper.readValue(payloadJson, Map.class);

            // Check expiration
            if (payload.containsKey("exp")) {
                long exp = ((Number) payload.get("exp")).longValue();
                if (exp < System.currentTimeMillis() / 1000) {
                    return null;
                }
            }

            return payload;
        } catch (Exception e) {
            return null;
        }
    }
}

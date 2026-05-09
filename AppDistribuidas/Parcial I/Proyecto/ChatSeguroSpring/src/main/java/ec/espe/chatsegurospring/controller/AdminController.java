package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.dto.AdminLoginRequestDTO;
import ec.espe.chatsegurospring.service.AdminTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

    @Value("${chat.admin.username}")
    private String adminUsername;

    @Value("${chat.admin.password}")
    private String adminPassword;

    private final AdminTokenService tokenService;

    public AdminController(AdminTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequestDTO payload) {
        if (!adminUsername.equals(payload.getUsername()) || !adminPassword.equals(payload.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        String token = tokenService.createToken();
        ResponseCookie cookie = ResponseCookie.from("admin-token", token)
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("ok", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(value = "admin-token", required = false) String token) {
        tokenService.revokeToken(token);

        // Clear the cookie by setting maxAge to 0
        ResponseCookie cookie = ResponseCookie.from("admin-token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("ok", true, "message", "Sesión cerrada"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(@CookieValue(value = "admin-token", required = false) String token) {
        return ResponseEntity.ok(Map.of("logged", token != null && tokenService.validToken(token)));
    }
}

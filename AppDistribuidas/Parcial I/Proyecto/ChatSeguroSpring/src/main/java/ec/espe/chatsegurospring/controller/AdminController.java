package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.dto.AdminLoginRequestDTO;
import ec.espe.chatsegurospring.repository.RoomRepository;
import ec.espe.chatsegurospring.service.AdminTokenService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

    private final AdminTokenService tokenService;
    private final RoomRepository roomRepository;

    public AdminController(AdminTokenService tokenService, RoomRepository roomRepository) {
        this.tokenService = tokenService;
        this.roomRepository = roomRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequestDTO payload) {
        // Autenticación delegada al pool de hilos (taskExecutor) vía @Async
        Optional<String> tokenOpt = tokenService
                .authenticateAsync(payload.getUsername(), payload.getPassword())
                .join();

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        ResponseCookie cookie = ResponseCookie.from("admin-token", tokenOpt.get())
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

    @GetMapping("/rooms")
    public ResponseEntity<?> getAllRooms(@CookieValue(value = "admin-token", required = false) String token) {
        if (token == null || !tokenService.validToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "No autorizado"));
        }

        java.util.List<Map<String, Object>> rooms = roomRepository.findAll().stream()
                .map(room -> Map.<String, Object>of(
                        "id", room.getId(),
                        "type", room.getType(),
                        "createdAt", room.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(rooms);
    }
}

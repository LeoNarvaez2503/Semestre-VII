package ec.espe.chatsegurospring.controller;

import ec.espe.chatsegurospring.BaseTest;
import ec.espe.chatsegurospring.dto.AdminLoginRequestDTO;
import ec.espe.chatsegurospring.service.AdminTokenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("AdminController - Pruebas Unitarias")
class AdminControllerTest extends BaseTest {

    @Mock
    private AdminTokenService tokenService;

    @InjectMocks
    private AdminController adminController;

    // ─────────────────────────────────────────────────────────────
    // TESTS: POST /api/admin/login
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Login: credenciales válidas retornan 200 + token en cookie")
    void testLogin_ValidCredentials() {
    AdminLoginRequestDTO payload = new AdminLoginRequestDTO();
    payload.setUsername("admin");
    payload.setPassword("admin123");

    String testToken = "test-token-uuid-1234";
    when(tokenService.authenticateAsync("admin", "admin123"))
        .thenReturn(CompletableFuture.completedFuture(Optional.of(testToken)));

    ResponseEntity<?> response = adminController.login(payload);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody())
        .isInstanceOf(Map.class)
        .extracting("ok")
        .isEqualTo(true);
    assertThat(response.getHeaders().getFirst("Set-Cookie"))
        .isNotNull()
        .contains("admin-token=" + testToken)
        .contains("HttpOnly")
        .contains("SameSite=Strict");

    verify(tokenService, times(1)).authenticateAsync("admin", "admin123");
    }

    @Test
    @DisplayName("Login: credenciales inválidas retornan 401")
    void testLogin_InvalidCredentials() {
    AdminLoginRequestDTO payload = new AdminLoginRequestDTO();
    payload.setUsername("invalid");
    payload.setPassword("wrongpass");

    when(tokenService.authenticateAsync("invalid", "wrongpass"))
        .thenReturn(CompletableFuture.completedFuture(Optional.empty()));

    ResponseEntity<?> response = adminController.login(payload);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(response.getBody())
        .isInstanceOf(Map.class)
        .extracting("error")
        .isEqualTo("Credenciales inválidas");

    verify(tokenService, times(1)).authenticateAsync("invalid", "wrongpass");
    }

    @Test
    @DisplayName("Login: token generado es único e incluido en cookie")
    void testLogin_TokenInCookie() {
    AdminLoginRequestDTO payload = new AdminLoginRequestDTO();
    payload.setUsername("admin");
    payload.setPassword("admin123");

    String token1 = "token-1";
    when(tokenService.authenticateAsync("admin", "admin123"))
        .thenReturn(CompletableFuture.completedFuture(Optional.of(token1)));

    ResponseEntity<?> response = adminController.login(payload);

    String setCookieHeader = response.getHeaders().getFirst("Set-Cookie");
    assertThat(setCookieHeader)
        .contains("admin-token=" + token1)
        .contains("Path=/");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: POST /api/admin/logout
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Logout: token revocado y cookie limpiada")
    void testLogout_TokenRevokedAndCookieCleared() {
    String token = "test-token-to-revoke";

    ResponseEntity<?> response = adminController.logout(token);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody())
        .isInstanceOf(Map.class)
        .hasFieldOrPropertyWithValue("ok", true);
    assertThat(response.getHeaders().getFirst("Set-Cookie"))
        .isNotNull()
        .contains("admin-token=")
        .contains("Max-Age=0")  // Max-Age, not MaxAge
        .contains("Path=/");

    verify(tokenService, times(1)).revokeToken(token);
    }

    @Test
    @DisplayName("Logout: sin token no lanza excepción")
    void testLogout_NoTokenProvidedDoesNotThrow() {
    ResponseEntity<?> response = adminController.logout(null);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    verify(tokenService, times(1)).revokeToken(null);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: GET /api/admin/status
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Status: con token válido retorna logged=true")
    void testStatus_ValidToken() {
    String token = "valid-token";
    when(tokenService.validToken(token)).thenReturn(true);

    ResponseEntity<?> response = adminController.status(token);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody())
        .isInstanceOf(Map.class)
        .extracting("logged")
        .isEqualTo(true);
    }

    @Test
    @DisplayName("Status: con token inválido retorna logged=false")
    void testStatus_InvalidToken() {
        String token = "invalid-token";
        when(tokenService.validToken(token)).thenReturn(false);

        ResponseEntity<?> response = adminController.status(token);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isInstanceOf(Map.class)
                .extracting("logged")
                .isEqualTo(false);
    }

    @Test
    @DisplayName("Status: sin token retorna logged=false")
    void testStatus_NoToken() {
        ResponseEntity<?> response = adminController.status(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isInstanceOf(Map.class)
                .extracting("logged")
                .isEqualTo(false);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: GET /api/admin/rooms
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GetAllRooms: sin token retorna 401")
    void testGetAllRooms_NoToken_Returns401() {
        ResponseEntity<?> response = adminController.getAllRooms(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody())
                .isInstanceOf(Map.class)
                .extracting("error")
                .isEqualTo("No autorizado");
    }

    @Test
    @DisplayName("GetAllRooms: token inválido retorna 401")
    void testGetAllRooms_InvalidToken_Returns401() {
        String invalidToken = "invalid-token";
        when(tokenService.validToken(invalidToken)).thenReturn(false);

        ResponseEntity<?> response = adminController.getAllRooms(invalidToken);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody())
                .isInstanceOf(Map.class)
                .extracting("error")
                .isEqualTo("No autorizado");
    }
}

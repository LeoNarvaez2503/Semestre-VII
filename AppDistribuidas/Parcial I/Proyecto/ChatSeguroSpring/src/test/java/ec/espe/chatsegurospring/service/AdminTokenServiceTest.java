package ec.espe.chatsegurospring.service;

import ec.espe.chatsegurospring.BaseTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.*;

@DisplayName("AdminTokenService - Pruebas Unitarias")
class AdminTokenServiceTest extends BaseTest {

    private AdminTokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new AdminTokenService();
        ReflectionTestUtils.setField(tokenService, "adminUsername", "admin");
        ReflectionTestUtils.setField(tokenService, "adminPassword", "admin123");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: authenticateAsync()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Autenticación: credenciales válidas retornan token")
    void testAuthenticateAsync_ValidCredentials() {
        CompletableFuture<Optional<String>> future = tokenService
                .authenticateAsync("admin", "admin123");

        Optional<String> result = future.join();

        assertThat(result)
                .isPresent()
                .hasValueSatisfying(token -> {
                    assertThat(token).isNotEmpty().isNotBlank();
                });
    }

    @Test
    @DisplayName("Autenticación: username incorrecto")
    void testAuthenticateAsync_InvalidUsername() {
        CompletableFuture<Optional<String>> future = tokenService
                .authenticateAsync("invalid", "admin123");

        Optional<String> result = future.join();

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Autenticación: password incorrecto")
    void testAuthenticateAsync_InvalidPassword() {
        CompletableFuture<Optional<String>> future = tokenService
                .authenticateAsync("admin", "wrongpassword");

        Optional<String> result = future.join();

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Autenticación: username y password incorrectos")
    void testAuthenticateAsync_BothInvalid() {
        CompletableFuture<Optional<String>> future = tokenService
                .authenticateAsync("invalid", "wrongpass");

        Optional<String> result = future.join();

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Autenticación: token es único por cada llamada")
    void testAuthenticateAsync_UniqueTokens() {
        Optional<String> token1 = tokenService
                .authenticateAsync("admin", "admin123")
                .join();

        Optional<String> token2 = tokenService
                .authenticateAsync("admin", "admin123")
                .join();

        assertThat(token1)
                .isPresent()
                .isNotEqualTo(token2);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: createToken()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Crear token: genera UUID válido")
    void testCreateToken_GeneratesValidUUID() {
        String token = tokenService.createToken();

        assertThat(token)
                .isNotNull()
                .isNotEmpty()
                .hasSize(36); // UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    }

    @Test
    @DisplayName("Crear token: cada token es único")
    void testCreateToken_UniquenessPerCall() {
        String token1 = tokenService.createToken();
        String token2 = tokenService.createToken();

        assertThat(token1).isNotEqualTo(token2);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: validToken()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Validar token: token válido retorna true")
    void testValidToken_ValidToken() {
        String token = tokenService.createToken();

        boolean result = tokenService.validToken(token);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Validar token: token inválido retorna false")
    void testValidToken_InvalidToken() {
        boolean result = tokenService.validToken("invalid-token-xyz");

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Validar token: token nulo retorna false")
    void testValidToken_NullToken() {
        boolean result = tokenService.validToken(null);

        assertThat(result).isFalse();
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: revokeToken()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Revocar token: token se invalida después de revocación")
    void testRevokeToken_TokenInvalidatedAfterRevoke() {
        String token = tokenService.createToken();

        // Verificar que el token es válido
        assertThat(tokenService.validToken(token)).isTrue();

        // Revocar el token
        tokenService.revokeToken(token);

        // Verificar que el token ya no es válido
        assertThat(tokenService.validToken(token)).isFalse();
    }

    @Test
    @DisplayName("Revocar token: revocar token nulo no lanza excepción")
    void testRevokeToken_NullTokenDoesNotThrow() {
        assertThatCode(() -> tokenService.revokeToken(null))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Revocar token: revocar token inexistente no lanza excepción")
    void testRevokeToken_NonexistentToken() {
        assertThatCode(() -> tokenService.revokeToken("nonexistent-token"))
                .doesNotThrowAnyException();
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: Concurrencia
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Concurrencia: múltiples autenticaciones simultáneas")
    void testConcurrency_MultipleAuthenticationsSimultaneous() {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        AtomicInteger successCount = new AtomicInteger(0);

        try {
            for (int i = 0; i < 20; i++) {
                executor.submit(() -> {
                    Optional<String> token = tokenService
                            .authenticateAsync("admin", "admin123")
                            .join();

                    if (token.isPresent()) {
                        successCount.incrementAndGet();
                        assertThat(tokenService.validToken(token.get())).isTrue();
                    }
                });
            }

            executor.shutdown();
            executor.awaitTermination(5, java.util.concurrent.TimeUnit.SECONDS);

            assertThat(successCount.get()).isEqualTo(20);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            fail("Concurrent test interrupted");
        }
    }

    @Test
    @DisplayName("Concurrencia: crear y validar tokens simultáneamente")
    void testConcurrency_CreateAndValidateTokensConcurrently() {
        ExecutorService executor = Executors.newFixedThreadPool(5);
        java.util.concurrent.CopyOnWriteArrayList<String> tokens = new java.util.concurrent.CopyOnWriteArrayList<>();
        AtomicInteger validCount = new AtomicInteger(0);

        try {
            // Crear tokens
            for (int i = 0; i < 10; i++) {
                executor.submit(() -> tokens.add(tokenService.createToken()));
            }

            executor.shutdown();
            executor.awaitTermination(2, java.util.concurrent.TimeUnit.SECONDS);

            // Validar tokens
            executor = Executors.newFixedThreadPool(5);
            for (String token : tokens) {
                executor.submit(() -> {
                    if (tokenService.validToken(token)) {
                        validCount.incrementAndGet();
                    }
                });
            }

            executor.shutdown();
            executor.awaitTermination(2, java.util.concurrent.TimeUnit.SECONDS);

            assertThat(validCount.get()).isEqualTo(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            fail("Concurrent test interrupted");
        }
    }

    @Test
    @DisplayName("Concurrencia: thread-safety de ConcurrentHashMap (tokens)")
    void testConcurrency_ConcurrentHashMapThreadSafety() {
        ExecutorService executor = Executors.newFixedThreadPool(8);
        AtomicInteger totalTokens = new AtomicInteger(0);

        try {
            for (int i = 0; i < 50; i++) {
                executor.submit(() -> {
                    String token = tokenService.createToken();
                    tokenService.validToken(token);
                    totalTokens.incrementAndGet();
                });
            }

            executor.shutdown();
            executor.awaitTermination(5, java.util.concurrent.TimeUnit.SECONDS);

            assertThat(totalTokens.get()).isEqualTo(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            fail("Concurrent test interrupted");
        }
    }
}

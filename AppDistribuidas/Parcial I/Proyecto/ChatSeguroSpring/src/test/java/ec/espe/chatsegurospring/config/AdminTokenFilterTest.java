package ec.espe.chatsegurospring.config;

import ec.espe.chatsegurospring.BaseTest;
import ec.espe.chatsegurospring.service.AdminTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("AdminTokenFilter - Pruebas Unitarias")
class AdminTokenFilterTest extends BaseTest {

    @Mock
    private AdminTokenService tokenService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private AdminTokenFilter adminTokenFilter;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        adminTokenFilter = new AdminTokenFilter(tokenService);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: shouldNotFilter()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("shouldNotFilter: ruta /api/admin/login está excluida")
    void testShouldNotFilter_AdminLoginExcluded() {
        when(request.getRequestURI()).thenReturn("/api/admin/login");

        boolean result = adminTokenFilter.shouldNotFilter(request);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("shouldNotFilter: ruta /api/admin/logout está excluida")
    void testShouldNotFilter_AdminLogoutExcluded() {
        when(request.getRequestURI()).thenReturn("/api/admin/logout");

        boolean result = adminTokenFilter.shouldNotFilter(request);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("shouldNotFilter: ruta /api/rooms/join está excluida")
    void testShouldNotFilter_RoomsJoinExcluded() {
        when(request.getRequestURI()).thenReturn("/api/rooms/join");

        boolean result = adminTokenFilter.shouldNotFilter(request);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("shouldNotFilter: ruta /ws/chat está excluida")
    void testShouldNotFilter_WebSocketExcluded() {
        when(request.getRequestURI()).thenReturn("/ws/chat");

        boolean result = adminTokenFilter.shouldNotFilter(request);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("shouldNotFilter: ruta /uploads/ está excluida")
    void testShouldNotFilter_UploadsExcluded() {
        when(request.getRequestURI()).thenReturn("/uploads/room-1/file.png");

        boolean result = adminTokenFilter.shouldNotFilter(request);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("shouldNotFilter: ruta protegida /api/rooms/create NO está excluida")
    void testShouldNotFilter_ProtectedRouteNotExcluded() {
        when(request.getRequestURI()).thenReturn("/api/rooms/create");

        boolean result = adminTokenFilter.shouldNotFilter(request);

        assertThat(result).isFalse();
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: doFilterInternal()
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("doFilterInternal: token válido autentica al usuario")
    void testDoFilterInternal_ValidTokenAuthenticates() throws ServletException, IOException {
        String validToken = "valid-token-uuid";
        Cookie[] cookies = {new Cookie("admin-token", validToken)};

        when(request.getCookies()).thenReturn(cookies);
        when(tokenService.validToken(validToken)).thenReturn(true);

        SecurityContextHolder.clearContext();
        adminTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNotNull()
                .hasFieldOrPropertyWithValue("principal", "admin")
                .hasFieldOrPropertyWithValue("authenticated", true);

        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    @DisplayName("doFilterInternal: token inválido no autentica")
    void testDoFilterInternal_InvalidTokenDoesNotAuthenticate() throws ServletException, IOException {
        String invalidToken = "invalid-token";
        Cookie[] cookies = {new Cookie("admin-token", invalidToken)};

        when(request.getCookies()).thenReturn(cookies);
        when(tokenService.validToken(invalidToken)).thenReturn(false);

        SecurityContextHolder.clearContext();
        adminTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNull();

        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    @DisplayName("doFilterInternal: sin cookies no autentica")
    void testDoFilterInternal_NoCookiesDoesNotAuthenticate() throws ServletException, IOException {
        when(request.getCookies()).thenReturn(null);

        SecurityContextHolder.clearContext();
        adminTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNull();

        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    @DisplayName("doFilterInternal: cookies sin admin-token no autentica")
    void testDoFilterInternal_CookiesWithoutAdminTokenDoesNotAuthenticate() throws ServletException, IOException {
        Cookie[] cookies = {
                new Cookie("other-cookie", "value"),
                new Cookie("sessionId", "xyz")
        };

        when(request.getCookies()).thenReturn(cookies);

        SecurityContextHolder.clearContext();
        adminTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNull();

        verify(filterChain, times(1)).doFilter(request, response);
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: getTokenFromCookie() (método privado, probado indirectamente)
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getTokenFromCookie: extrae admin-token correctamente")
    void testGetTokenFromCookie_ExtractsAdminToken() throws ServletException, IOException {
        String expectedToken = "extracted-token";
        Cookie[] cookies = {
                new Cookie("admin-token", expectedToken),
                new Cookie("other", "value")
        };

        when(request.getCookies()).thenReturn(cookies);
        when(tokenService.validToken(expectedToken)).thenReturn(true);

        SecurityContextHolder.clearContext();
        adminTokenFilter.doFilterInternal(request, response, filterChain);

        // Si el token se extrajo correctamente, el usuario debe estar autenticado
        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNotNull();
    }

    @Test
    @DisplayName("getTokenFromCookie: ignora otros cookies")
    void testGetTokenFromCookie_IgnoresOtherCookies() throws ServletException, IOException {
        Cookie[] cookies = {
                new Cookie("sessionId", "xyz"),
                new Cookie("theme", "dark")
        };

        when(request.getCookies()).thenReturn(cookies);

        SecurityContextHolder.clearContext();
        adminTokenFilter.doFilterInternal(request, response, filterChain);

        // Sin admin-token, no debe haber autenticación
        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isNull();

        verify(tokenService, never()).validToken(anyString());
    }
}

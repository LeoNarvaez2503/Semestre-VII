package ec.espe.chatsegurospring.config;

import ec.espe.chatsegurospring.service.AdminTokenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@DisplayName("SecurityConfig - Configuración de seguridad")
class SecurityConfigTest {

    @Autowired
    private SecurityConfig securityConfig;

    @MockBean
    private AdminTokenService adminTokenService;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Test
    @DisplayName("SecurityConfig debe estar disponible")
    void testSecurityConfigBeanExists() {
        assertThat(securityConfig).isNotNull();
    }

    @Test
    @DisplayName("SecurityConfig debe aceptar AdminTokenService en constructor")
    void testSecurityConfigConstructor() {
        SecurityConfig config = new SecurityConfig(adminTokenService);
        assertThat(config).isNotNull();
    }

    @Test
    @DisplayName("SecurityFilterChain bean debe estar disponible")
    void testSecurityFilterChainBeanExists() {
        assertThat(securityFilterChain).isNotNull();
    }

    @Test
    @DisplayName("CorsConfigurationSource bean debe estar disponible")
    void testCorsConfigurationSourceBeanExists() {
        assertThat(corsConfigurationSource).isNotNull();
    }

    @Test
    @DisplayName("SecurityConfig debe tener anotación @Configuration")
    void testConfigurationAnnotationPresent() {
        assertThat(SecurityConfig.class.isAnnotationPresent(org.springframework.context.annotation.Configuration.class))
                .isTrue();
    }

    @Test
    @DisplayName("Método filterChain debe tener anotación @Bean")
    void testFilterChainBeanAnnotation() throws Exception {
        var method = SecurityConfig.class.getDeclaredMethod("filterChain",
                org.springframework.security.config.annotation.web.builders.HttpSecurity.class);
        assertThat(method.isAnnotationPresent(org.springframework.context.annotation.Bean.class))
                .isTrue();
    }

    @Test
    @DisplayName("Método corsConfigurationSource debe tener anotación @Bean")
    void testCorsConfigurationSourceBeanAnnotation() throws Exception {
        var method = SecurityConfig.class.getDeclaredMethod("corsConfigurationSource");
        assertThat(method.isAnnotationPresent(org.springframework.context.annotation.Bean.class))
                .isTrue();
    }
}

package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@DisplayName("WebMvcConfig - Configuración de recursos estáticos")
class WebMvcConfigTest {

    @Autowired
    private WebMvcConfig webMvcConfig;

    @Test
    @DisplayName("Bean de WebMvcConfig debe estar disponible")
    void testWebMvcConfigBeanExists() {
        assertThat(webMvcConfig).isNotNull();
    }

    @Test
    @DisplayName("WebMvcConfig debe implementar WebMvcConfigurer")
    void testWebMvcConfigImplementsConfigurer() {
        assertThat(webMvcConfig)
                .isInstanceOf(WebMvcConfigurer.class);
    }

    @Test
    @DisplayName("Clase debe tener anotación @Configuration")
    void testConfigurationAnnotationPresent() {
        assertThat(WebMvcConfig.class.isAnnotationPresent(org.springframework.context.annotation.Configuration.class))
                .isTrue();
    }

    @Test
    @DisplayName("Clase debe tener método addResourceHandlers")
    void testAddResourceHandlersMethodExists() {
        var methods = WebMvcConfig.class.getDeclaredMethods();
        var hasMethod = java.util.Arrays.stream(methods)
                .anyMatch(m -> m.getName().equals("addResourceHandlers"));
        assertThat(hasMethod).isTrue();
    }
}

package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@DisplayName("WebSocketConfig - Configuración de WebSocket")
class WebSocketConfigTest {

    @Autowired
    private WebSocketConfig webSocketConfig;

    @Test
    @DisplayName("Bean de WebSocketConfig debe estar disponible")
    void testWebSocketConfigBeanExists() {
        assertThat(webSocketConfig).isNotNull();
    }

    @Test
    @DisplayName("WebSocketConfig implementa WebSocketMessageBrokerConfigurer")
    void testWebSocketConfigImplementsConfigurer() {
        assertThat(webSocketConfig)
                .isInstanceOf(org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer.class);
    }

    @Test
    @DisplayName("Clase debe tener anotación @Configuration")
    void testConfigurationAnnotationPresent() {
        assertThat(WebSocketConfig.class.isAnnotationPresent(org.springframework.context.annotation.Configuration.class))
                .isTrue();
    }

    @Test
    @DisplayName("Clase debe tener anotación @EnableWebSocketMessageBroker")
    void testEnableWebSocketMessageBrokerAnnotationPresent() {
        assertThat(WebSocketConfig.class.isAnnotationPresent(
                org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker.class))
                .isTrue();
    }
}

package ec.espe.chatsegurospring;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@DisplayName("ChatSeguroSpringApplication - Aplicación principal")
class ChatSeguroSpringApplicationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("Contexto de Spring debe cargarse correctamente")
    void testApplicationContextLoads() {
        assertThat(applicationContext).isNotNull();
    }

    @Test
    @DisplayName("Aplicación debe ser instancia de SpringBootTest")
    void testApplicationStartsSuccessfully() {
        assertThat(applicationContext.getId()).isNotNull();
    }

    @Test
    @DisplayName("Aplicación debe tener beans cargados")
    void testApplicationHasLoadedBeans() {
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        assertThat(beanNames).isNotEmpty();
    }

    @Test
    @DisplayName("Aplicación debe contener ServiceBeans")
    void testApplicationContainsServiceBeans() {
        assertThat(applicationContext.containsBean("adminTokenService")).isTrue();
        assertThat(applicationContext.containsBean("roomService")).isTrue();
    }

    @Test
    @DisplayName("Aplicación debe contener ControllerBeans")
    void testApplicationContainsControllerBeans() {
        assertThat(applicationContext.containsBean("adminController")).isTrue();
        assertThat(applicationContext.containsBean("roomController")).isTrue();
        assertThat(applicationContext.containsBean("chatWebSocketController")).isTrue();
    }

    @Test
    @DisplayName("Aplicación debe contener ConfigurationBeans")
    void testApplicationContainsConfigurationBeans() {
        assertThat(applicationContext.containsBean("webSocketConfig")).isTrue();
        assertThat(applicationContext.containsBean("securityConfig")).isTrue();
        assertThat(applicationContext.containsBean("asyncConfig")).isTrue();
    }

    @Test
    @DisplayName("main method debe ser invocable")
    void testMainMethodExists() throws Exception {
        var method = ChatSeguroSpringApplication.class.getDeclaredMethod("main", String[].class);
        assertThat(method).isNotNull();
    }
}

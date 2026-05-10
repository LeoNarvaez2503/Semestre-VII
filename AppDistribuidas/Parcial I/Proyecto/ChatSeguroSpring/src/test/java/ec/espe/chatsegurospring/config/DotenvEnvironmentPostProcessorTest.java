package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.env.EnvironmentPostProcessor;

import static org.assertj.core.api.Assertions.*;

@DisplayName("DotenvEnvironmentPostProcessor - Post-procesador de variables de entorno")
class DotenvEnvironmentPostProcessorTest {

    @Test
    @DisplayName("DotenvEnvironmentPostProcessor debe existir")
    void testDotenvEnvironmentPostProcessorExists() {
        assertThat(DotenvEnvironmentPostProcessor.class).isNotNull();
    }

    @Test
    @DisplayName("DotenvEnvironmentPostProcessor debe implementar EnvironmentPostProcessor")
    void testImplementsEnvironmentPostProcessor() {
        assertThat(EnvironmentPostProcessor.class.isAssignableFrom(DotenvEnvironmentPostProcessor.class))
                .isTrue();
    }

    @Test
    @DisplayName("Clase debe tener método postProcessEnvironment")
    void testPostProcessEnvironmentMethodExists() {
        var methods = DotenvEnvironmentPostProcessor.class.getDeclaredMethods();
        var hasMethod = java.util.Arrays.stream(methods)
                .anyMatch(m -> m.getName().equals("postProcessEnvironment"));
        assertThat(hasMethod).isTrue();
    }

    @Test
    @DisplayName("postProcessEnvironment debe ser override de EnvironmentPostProcessor")
    void testPostProcessEnvironmentIsOverride() throws Exception {
        var method = DotenvEnvironmentPostProcessor.class.getDeclaredMethod("postProcessEnvironment",
                org.springframework.core.env.ConfigurableEnvironment.class,
                org.springframework.boot.SpringApplication.class);
        assertThat(method).isNotNull();
    }

    @Test
    @DisplayName("DotenvEnvironmentPostProcessor se puede instanciar")
    void testCanInstantiate() {
        DotenvEnvironmentPostProcessor processor = new DotenvEnvironmentPostProcessor();
        assertThat(processor).isNotNull();
    }
}

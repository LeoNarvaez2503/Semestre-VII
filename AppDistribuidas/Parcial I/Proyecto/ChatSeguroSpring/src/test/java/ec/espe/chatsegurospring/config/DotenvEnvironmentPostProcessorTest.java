package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.assertj.core.api.Assertions.*;

@DisplayName("DotenvEnvironmentPostProcessor - Post-procesador de variables de entorno")
class DotenvEnvironmentPostProcessorTest {

    @TempDir
    Path tempDir;

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

    @Test
    @DisplayName("postProcessEnvironment: archivo .env no existe, retorna temprano")
    void testPostProcessEnvironment_FileNotFound_ReturnsEarly() throws Exception {
        DotenvEnvironmentPostProcessor processor = new DotenvEnvironmentPostProcessor();
        processor.setEnvDirectory(tempDir.toString());

        ConfigurableEnvironment mockEnv = org.mockito.Mockito.mock(ConfigurableEnvironment.class);
        SpringApplication mockApp = org.mockito.Mockito.mock(SpringApplication.class);

        java.util.concurrent.atomic.AtomicBoolean called = new java.util.concurrent.atomic.AtomicBoolean(false);
        org.mockito.Mockito.when(mockEnv.getPropertySources())
                .thenReturn(new org.springframework.core.env.MutablePropertySources() {
                    @Override
                    public void addLast(org.springframework.core.env.PropertySource<?> propertySource) {
                        called.set(true);
                    }
                });

        processor.postProcessEnvironment(mockEnv, mockApp);

        assertThat(called.get()).isFalse();
    }

    @Test
    @DisplayName("postProcessEnvironment: archivo .env existe, agrega propiedades")
    void testPostProcessEnvironment_FileExists_LoadsProperties() throws Exception {
        Path envFile = tempDir.resolve(".env");
        Files.writeString(envFile, "DB_HOST=localhost\nDB_PORT=3306");

        DotenvEnvironmentPostProcessor processor = new DotenvEnvironmentPostProcessor();
        processor.setEnvDirectory(tempDir.toString());

        ConfigurableEnvironment mockEnv = org.mockito.Mockito.mock(ConfigurableEnvironment.class);
        SpringApplication mockApp = org.mockito.Mockito.mock(SpringApplication.class);

        org.springframework.core.env.MutablePropertySources sources = new org.springframework.core.env.MutablePropertySources();
        org.mockito.Mockito.when(mockEnv.getPropertySources()).thenReturn(sources);

        processor.postProcessEnvironment(mockEnv, mockApp);

        assertThat(sources.size()).isGreaterThan(0);
    }
}

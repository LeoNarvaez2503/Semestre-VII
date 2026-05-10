package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@DisplayName("AsyncConfig - Configuración de tareas asincrónicas")
class AsyncConfigTest {

    @Autowired
    private AsyncConfig asyncConfig;

    @Autowired
    @Qualifier("taskExecutor")
    private Executor taskExecutor;

    @Test
    @DisplayName("Bean de AsyncConfig debe estar disponible")
    void testAsyncConfigBeanExists() {
        assertThat(asyncConfig).isNotNull();
    }

    @Test
    @DisplayName("Bean taskExecutor debe ser ThreadPoolTaskExecutor")
    void testTaskExecutorBeanExists() {
        assertThat(taskExecutor)
                .isNotNull()
                .isInstanceOf(ThreadPoolTaskExecutor.class);
    }

    @Test
    @DisplayName("ThreadPoolTaskExecutor debe tener corePoolSize = 5")
    void testTaskExecutorCorePoolSize() {
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) taskExecutor;
        assertThat(executor.getCorePoolSize()).isEqualTo(5);
    }

    @Test
    @DisplayName("ThreadPoolTaskExecutor debe tener maxPoolSize = 20")
    void testTaskExecutorMaxPoolSize() {
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) taskExecutor;
        assertThat(executor.getMaxPoolSize()).isEqualTo(20);
    }

    @Test
    @DisplayName("ThreadPoolTaskExecutor debe tener queueCapacity = 100")
    void testTaskExecutorQueueCapacity() {
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) taskExecutor;
        assertThat(executor.getQueueCapacity()).isEqualTo(100);
    }

    @Test
    @DisplayName("ThreadPoolTaskExecutor debe tener threadNamePrefix = 'chat-async-'")
    void testTaskExecutorThreadNamePrefix() {
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) taskExecutor;
        assertThat(executor.getThreadNamePrefix()).isEqualTo("chat-async-");
    }

    @Test
    @DisplayName("AsyncConfig debe tener anotación @Configuration")
    void testConfigurationAnnotationPresent() {
        assertThat(AsyncConfig.class.isAnnotationPresent(org.springframework.context.annotation.Configuration.class))
                .isTrue();
    }

    @Test
    @DisplayName("Método taskExecutor debe tener anotación @Bean")
    void testTaskExecutorBeanAnnotation() throws Exception {
        var method = AsyncConfig.class.getDeclaredMethod("taskExecutor");
        assertThat(method.isAnnotationPresent(org.springframework.context.annotation.Bean.class))
                .isTrue();
    }
}

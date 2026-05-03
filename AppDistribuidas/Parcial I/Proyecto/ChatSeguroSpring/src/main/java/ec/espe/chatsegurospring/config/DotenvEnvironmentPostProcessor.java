package ec.espe.chatsegurospring.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "dotenvProperties";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Path dotenvPath = Path.of(".env");
        if (!Files.exists(dotenvPath)) {
            return;
        }

        Dotenv dotenv = Dotenv.configure()
                .filename(dotenvPath.getFileName().toString())
                .directory(dotenvPath.getParent() != null ? dotenvPath.getParent().toString() : ".")
                .ignoreIfMissing()
                .load();

        Map<String, Object> propertyMap = new HashMap<>();
        dotenv.entries().forEach(entry -> propertyMap.put(entry.getKey(), entry.getValue()));
        environment.getPropertySources().addLast(new MapPropertySource(PROPERTY_SOURCE_NAME, propertyMap));
    }
}

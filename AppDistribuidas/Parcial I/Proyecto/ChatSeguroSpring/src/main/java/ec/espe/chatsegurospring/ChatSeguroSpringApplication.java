package ec.espe.chatsegurospring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ChatSeguroSpringApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChatSeguroSpringApplication.class, args);
    }
}

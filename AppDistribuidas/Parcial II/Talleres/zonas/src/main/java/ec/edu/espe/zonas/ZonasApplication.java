package ec.edu.espe.zonas;

import ec.edu.espe.zonas.entidades.TipoZona;
import ec.edu.espe.zonas.entidades.Zona;
import ec.edu.espe.zonas.repositories.ZonaRepository;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ZonasApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZonasApplication.class, args);
    }

    @Bean
    CommandLineRunner crearZonaInicial(
        ZonaRepository zonaRepository,
        @Value("${ZONA_NAME:Zona Principal}") String zonaName,
        @Value("${ZONA_CODE:Z001}") String zonaCode,
        @Value(
            "${ZONA_DESCRIPTION:Zona creada desde Main al iniciar la aplicación}"
        ) String zonaDescription,
        @Value("${ZONA_TYPE:REGULAR}") String zonaType
    ) {
        return args -> {
            if (zonaRepository.count() == 0) {
                String codeNormalizado = zonaCode
                    .trim()
                    .toUpperCase(Locale.ROOT);
                if (codeNormalizado.length() > 4) {
                    throw new IllegalArgumentException(
                        "ZONA_CODE no puede tener más de 4 caracteres"
                    );
                }

                TipoZona tipo = TipoZona.valueOf(
                    zonaType.trim().toUpperCase(Locale.ROOT)
                );

                Zona zona = Zona.builder()
                    .name(zonaName.trim())
                    .code(codeNormalizado)
                    .description(zonaDescription)
                    .status(1)
                    .type(tipo)
                    .dateCreated(LocalDateTime.now())
                    .dateModified(LocalDateTime.now())
                    .build();

                zonaRepository.save(zona);
                System.out.println("Zona inicial creada correctamente.");
            } else {
                System.out.println(
                    "Ya existen zonas registradas. No se creó zona inicial."
                );
            }
        };
    }
}

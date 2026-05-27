package ec.edu.espe.zonas.dtos;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ec.edu.espe.zonas.entidades.TipoZona;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ZonaRequestDto {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 1, max = 32, message = "El nombre no puede tener más de 32 caracteres")
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private TipoZona type;
}

package ec.edu.espe.zonas.dtos;

import ec.edu.espe.zonas.entidades.TipoZona;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZonaRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(
        min = 1,
        max = 32,
        message = "El nombre no puede tener más de 32 caracteres"
    )
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de zona es obligatorio")
    private TipoZona type;
    private int capacidad;
}

package ec.edu.espe.zonas.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

import ec.edu.espe.zonas.entidades.TipoEspacio;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class EspacioRequestDTO {
    
    @NotNull(message = "El ID de la zona es obligatorio")
    @NotBlank(message = "El ID de la zona no puede estar vacío")
    private UUID zoneId;  // claves primarias se manejaran con UUID

    private String description;

    @Enumerated(EnumType.STRING)
    @NotBlank(message = "El tipo de espacio es obligatorio")
    private TipoEspacio type;
}

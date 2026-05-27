package ec.edu.espe.zonas.dtos;

import ec.edu.espe.zonas.entidades.TipoZona;
import ec.edu.espe.zonas.entidades.Espacio;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ZonaResponseDTO {
    private UUID zoneId;
    private String name;
    private String code;
    private String description;
    private int status;
    private TipoZona type;
    private List<Espacio> spaces;
    private LocalDateTime dateCreated;
    private LocalDateTime dateModified;
    
}

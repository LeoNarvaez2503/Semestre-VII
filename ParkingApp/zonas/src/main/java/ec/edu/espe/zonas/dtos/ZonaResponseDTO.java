package ec.edu.espe.zonas.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.TipoZona;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private int capacidad;
    private TipoZona type;
    private List<Espacio> spaces;
    private LocalDateTime dateCreated;
    private LocalDateTime dateModified;
    
}

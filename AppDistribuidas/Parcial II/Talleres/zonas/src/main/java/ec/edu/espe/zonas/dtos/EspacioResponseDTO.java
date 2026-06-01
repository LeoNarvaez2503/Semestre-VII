package ec.edu.espe.zonas.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import ec.edu.espe.zonas.entidades.TipoZona;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.TipoEspacio;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioResponseDTO {
    private UUID id;
    private String name;
    private String code; 
    private String description;
    private TipoEspacio type;
    private int status;
    private List<Espacio> spaces;
    private LocalDateTime dateCreated;
    private LocalDateTime dateModified;
}

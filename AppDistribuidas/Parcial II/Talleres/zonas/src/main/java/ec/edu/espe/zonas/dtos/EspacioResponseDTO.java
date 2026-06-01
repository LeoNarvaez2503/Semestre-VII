package ec.edu.espe.zonas.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.entidades.TipoEspacio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioResponseDTO {

  private String name;
    private String code; 
    private String description;
    private TipoEspacio type;
    private EstadoEspacio estado;
    private boolean activo;
    private UUID idZona;
    private String nombreZona;
    private List<Espacio> spaces;
    private LocalDateTime dateCreated;
    private LocalDateTime dateModified;
}

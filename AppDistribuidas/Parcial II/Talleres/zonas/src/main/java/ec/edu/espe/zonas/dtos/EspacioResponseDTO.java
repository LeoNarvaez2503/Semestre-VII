package ec.edu.espe.zonas.dtos;

import ec.edu.espe.zonas.entidades.TipoEspacio;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioResponseDTO {

    private UUID id;
    private UUID zoneId;
    private String code;
    private String description;
    private TipoEspacio type;
    private boolean status;
    private LocalDateTime dateCreated;
    private LocalDateTime dateModified;
}

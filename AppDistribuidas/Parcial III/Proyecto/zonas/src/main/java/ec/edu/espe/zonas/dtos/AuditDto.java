package ec.edu.espe.zonas.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditDto {
    private String servicio;
    private String accion;
    private String entidad;
    private Map<String, Object> datos;
    private String usuario;
    private String ip;
    private String mac;
}

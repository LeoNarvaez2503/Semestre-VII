package ec.edu.espe.zonas.utils;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.Espacio;
import org.springframework.stereotype.Component;

@Component
public class UtilsMappers {

    public EspacioResponseDTO toResponseDTO(Espacio objEspacio) {
        return EspacioResponseDTO.builder()
            .id(objEspacio.getId())
            .code(objEspacio.getCode())
            .description(objEspacio.getDescription())
            .type(objEspacio.getType())
            .estado(objEspacio.getEstado())
            .activo(objEspacio.isStatus())
            .idZona(
                objEspacio.getZone() != null
                    ? objEspacio.getZone().getId()
                    : null
            )
            .nombreZona(
                objEspacio.getZone() != null
                    ? objEspacio.getZone().getName()
                    : null
            )
            .dateCreated(objEspacio.getDateCreated())
            .dateModified(objEspacio.getDateModified())
            .build();
    }

    public Espacio toEntityEspacio(EspacioRequestDTO requestDto) {
        if (requestDto == null) return null;
        return Espacio.builder()
            .description(requestDto.getDescription())
            .type(requestDto.getType())
            .estado(requestDto.getEstado())
            .build();
    }
}

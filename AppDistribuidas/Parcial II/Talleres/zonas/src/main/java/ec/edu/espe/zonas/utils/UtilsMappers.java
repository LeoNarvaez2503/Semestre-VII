package ec.edu.espe.zonas.utils;

import org.springframework.stereotype.Component;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.Espacio;

@Component
public class UtilsMappers {
    public EspacioResponseDTO toResponseDTO(Espacio objEspacio){
        return  EspacioResponseDTO.builder()
        .code(objEspacio.getCode())
        .description(objEspacio.getDescription())
        .type(objEspacio.getType())
        .estado(objEspacio.getEstado())
        .activo(objEspacio.isStatus())
        .idZona(objEspacio.getZone() != null ? objEspacio.getZone().getId() : null)
        .dateCreated(objEspacio.getDateCreated())
        .dateModified(objEspacio.getDateModified())
        .build();
    }
    public Espacio toEntityEspacio(EspacioRequestDTO requestDto){
        if (requestDto == null) return null;
        return Espacio.builder()
                .id(requestDto.getZoneId())
                .type(requestDto.getType())
                .estado(requestDto.getEstado())
                .build();
    }
}

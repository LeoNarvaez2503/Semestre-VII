package ec.edu.espe.zonas.services.impl;

 
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import ec.edu.espe.zonas.dtos.ZonaRequestDto;
import ec.edu.espe.zonas.dtos.ZonaResponseDTO;
import ec.edu.espe.zonas.entidades.Zona;
import ec.edu.espe.zonas.repositories.ZonaRepository;
import ec.edu.espe.zonas.services.ZonaServicio;

public class ZoneServicioImpl implements ZonaServicio {
    @Autowired
    private ZonaRepository zonaRepository;

    @Override
    public List<ZonaResponseDTO> listarZonas(){
        return zonaRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ZonaResponseDTO crearZona(ZonaRequestDto request){
        if (zonaRepository.existByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe la zona");
        }
        Zona objZona = new Zona();
        objZona.setName(request.getName());
        objZona.setCode("Zona-"+UUID.randomUUID().toString().substring(0,4).toLowerCase());
        objZona.setDescription(request.getDescription());
        objZona.setType(request.getType());
        
        zonaRepository.save(objZona);
        return toResponse(objZona);
    }

    @Override
    public ZonaResponseDTO actualizarZona(UUID idZone, ZonaRequestDto request){
        return null;
    }

    @Override
    public void activarDesactivar(UUID idZone){

    }
    public ZonaResponseDTO toResponse(Zona objZona) {
        return ZonaResponseDTO.builder()
        .zoneId(objZona.getId())
        .name(objZona.getName())
        .code(objZona.getCode())
        .description(objZona.getDescription())
        .space(objZona.getSpaces())
        .status(objZona.getStatus())
        .dateCreated(objZona.getDateCreated())
        .dateModified(objZona.getDateModified())
        .build();
    }
}

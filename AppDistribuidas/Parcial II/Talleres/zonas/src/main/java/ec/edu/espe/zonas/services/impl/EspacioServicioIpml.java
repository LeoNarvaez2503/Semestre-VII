package ec.edu.espe.zonas.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.entidades.Zona;
import ec.edu.espe.zonas.repositories.EspacioRepository;
import ec.edu.espe.zonas.repositories.ZonaRepository;
import ec.edu.espe.zonas.services.EspacioServicio;
import ec.edu.espe.zonas.utils.UtilsMappers;

@Service
public class EspacioServicioIpml implements EspacioServicio{

    private final EspacioRepository repositorioEspacio;
    private final ZonaRepository zonaRepository;
    private final UtilsMappers mapper;

    public EspacioServicioIpml(EspacioRepository repositorioEspacio, ZonaRepository zonaRepository, UtilsMappers mapper) {
        this.repositorioEspacio = repositorioEspacio;
        this.zonaRepository = zonaRepository;
        this.mapper = mapper;
    }

    @Override
    public List<EspacioResponseDTO> obtenerEspacios() {
        return repositorioEspacio.findAll().stream()
            .map(mapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public EspacioResponseDTO crearEspacio(EspacioRequestDTO dto) {
        Zona objZona = zonaRepository.findById(dto.getZoneId())
            .orElseThrow(()-> new RuntimeException("Zona no encontrada con id: "+dto.getZoneId()));
        Espacio newSpace = mapper.toEntityEspacio(dto);
        newSpace.setZone(objZona);
        newSpace.setStatus(true);
        Espacio spaceSaved = repositorioEspacio.save(newSpace);
        return mapper.toResponseDTO(spaceSaved);
    }

    @Override
    public EspacioRequestDTO actualizaEspacio(EspacioRequestDTO dto) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void eliminarEspacio(UUID idEspacio) {
        Espacio espacio = repositorioEspacio.findById(idEspacio)
            .orElseThrow(() -> new RuntimeException("Espacio no encontrado con id: " + idEspacio));
        repositorioEspacio.delete(espacio);
    }

    @Override
    public EspacioResponseDTO cambiarEstado(UUID idEspacio, EstadoEspacio estado) {
        Espacio espacio = repositorioEspacio.findById(idEspacio)
            .orElseThrow(() -> new RuntimeException("Espacio no encontrado con id: " + idEspacio));
        espacio.setEstado(estado);
        Espacio espacioActualizado = repositorioEspacio.save(espacio);
        return mapper.toResponseDTO(espacioActualizado);
    }

    @Override
    public List<EspacioResponseDTO> obtenerEspacioPorEstado(EstadoEspacio estado) {
        return repositorioEspacio.findAll().stream()
            .filter(espacio -> espacio.getEstado().equals(estado))
            .map(mapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<EspacioResponseDTO> obtenerEspaciosPorZonaEstado(UUID idZona, EstadoEspacio estado) {
        return repositorioEspacio.findByZoneId(idZona).stream()
            .filter(espacio -> espacio.getEstado().equals(estado))
            .map(mapper::toResponseDTO)
            .collect(Collectors.toList());
    }

}

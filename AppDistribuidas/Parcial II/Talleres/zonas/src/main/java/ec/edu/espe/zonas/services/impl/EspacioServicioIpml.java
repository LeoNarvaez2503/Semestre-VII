package ec.edu.espe.zonas.services.impl;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.entidades.Zona;
import ec.edu.espe.zonas.repositories.EspacioRepository;
import ec.edu.espe.zonas.repositories.ZonaRepository;
import ec.edu.espe.zonas.services.EspacioServicio;
import ec.edu.espe.zonas.utils.UtilsMappers;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EspacioServicioIpml implements EspacioServicio {

    private final EspacioRepository repositorioEspacio;
    private final ZonaRepository zonaRepository;
    private final UtilsMappers mapper;

    @Override
    public List<EspacioResponseDTO> obtenerEspacios() {
        return repositorioEspacio
            .findAll()
            .stream()
            .map(mapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public EspacioResponseDTO obtenerEspacioPorId(UUID idEspacio) {
        Espacio espacio = repositorioEspacio
            .findById(idEspacio)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Espacio no encontrado con id: " + idEspacio
                )
            );
        return mapper.toResponseDTO(espacio);
    }

    @Override
    public EspacioResponseDTO crearEspacio(EspacioRequestDTO dto) {
        Zona objZona = zonaRepository
            .findById(dto.getZoneId())
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Zona no encontrada con id: " + dto.getZoneId()
                )
            );
        if (objZona.getStatus() == 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La zona está inactiva"
            );
        }
        if (objZona.getCapacidad() <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La zona no tiene capacidad disponible"
            );
        }
        int espaciosActivos = repositorioEspacio
            .findByZoneIdAndStatus(objZona.getId(), true)
            .size();
        if (espaciosActivos >= objZona.getCapacidad()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "La zona ya alcanzó su capacidad máxima"
            );
        }

        Espacio newSpace = mapper.toEntityEspacio(dto);
        newSpace.setZone(objZona);
        newSpace.setStatus(true);
        newSpace.setCode(generarCodigoUnico());
        if (newSpace.getEstado() == null) {
            newSpace.setEstado(EstadoEspacio.DISPONIBLE);
        }
        newSpace.setDateCreated(java.time.LocalDateTime.now());
        newSpace.setDateModified(java.time.LocalDateTime.now());
        return mapper.toResponseDTO(repositorioEspacio.save(newSpace));
    }

    @Override
    public EspacioRequestDTO actualizaEspacio(EspacioRequestDTO dto) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void eliminarEspacio(UUID idEspacio) {
        Espacio espacio = repositorioEspacio
            .findById(idEspacio)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Espacio no encontrado con id: " + idEspacio
                )
            );
        repositorioEspacio.delete(espacio);
    }

    @Override
    public EspacioResponseDTO cambiarEstado(
        UUID idEspacio,
        EstadoEspacio estado
    ) {
        Espacio espacio = repositorioEspacio
            .findById(idEspacio)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Espacio no encontrado con id: " + idEspacio
                )
            );
        Zona zona = espacio.getZone();
        if (zona != null && zona.getStatus() == 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "No se puede ocupar un espacio en una zona inactiva"
            );
        }
        espacio.setEstado(estado);
        espacio.setDateModified(java.time.LocalDateTime.now());
        return mapper.toResponseDTO(repositorioEspacio.save(espacio));
    }

    @Override
    public List<EspacioResponseDTO> obtenerEspacioPorEstado(
        EstadoEspacio estado
    ) {
        return repositorioEspacio
            .findAll()
            .stream()
            .filter(espacio -> espacio.getEstado().equals(estado))
            .map(mapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<EspacioResponseDTO> obtenerEspaciosPorZonaEstado(
        UUID idZona,
        EstadoEspacio estado
    ) {
        if (!zonaRepository.existsById(idZona)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Zona no encontrada con id: " + idZona
            );
        }
        return repositorioEspacio
            .findByZoneId(idZona)
            .stream()
            .filter(espacio -> espacio.getEstado().equals(estado))
            .map(mapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public void desactivarEspaciosPorZona(UUID idZona) {
        List<Espacio> espacios = repositorioEspacio.findByZoneId(idZona);
        espacios.forEach(espacio -> {
            espacio.setStatus(false);
            espacio.setDateModified(java.time.LocalDateTime.now());
        });
        repositorioEspacio.saveAll(espacios);
    }

    private String generarCodigoUnico() {
        String code;
        do {
            code = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();
        } while (repositorioEspacio.existsByCode(code));
        return code;
    }
}

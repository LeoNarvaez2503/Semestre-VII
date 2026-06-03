package ec.edu.espe.zonas.services.impl;

import ec.edu.espe.zonas.dtos.ZonaRequestDto;
import ec.edu.espe.zonas.dtos.ZonaResponseDTO;
import ec.edu.espe.zonas.entidades.Zona;
import ec.edu.espe.zonas.repositories.ZonaRepository;
import ec.edu.espe.zonas.services.EspacioServicio;
import ec.edu.espe.zonas.services.ZonaServicio;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ZoneServicioImpl implements ZonaServicio {

    private final ZonaRepository zonaRepository;
    private final EspacioServicio espacioServicio;

    @Override
    public List<ZonaResponseDTO> obtenerZonas() {
        return zonaRepository
            .findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public ZonaResponseDTO crearZona(ZonaRequestDto request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre de la zona es obligatorio"
            );
        }
        if (request.getType() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El tipo de zona es obligatorio"
            );
        }
        if (zonaRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Ya existe una zona con ese nombre"
            );
        }

        Zona objZona = new Zona();
        objZona.setName(request.getName().trim());
        objZona.setCode(generarCodigoUnico());
        objZona.setDescription(request.getDescription());
        objZona.setCapacidad(request.getCapacidad());
        objZona.setType(request.getType());
        objZona.setStatus(1);
        objZona.setDateCreated(LocalDateTime.now());
        objZona.setDateModified(LocalDateTime.now());

        return toResponse(zonaRepository.save(objZona));
    }

    @Override
    public ZonaResponseDTO actualizarZona(UUID idZone, ZonaRequestDto request) {
        Zona zona = zonaRepository
            .findById(idZone)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Zona no encontrada"
                )
            );

        if (request.getName() != null && !request.getName().isBlank()) {
            String nuevoNombre = request.getName().trim();
            boolean cambioNombre = !nuevoNombre.equalsIgnoreCase(
                zona.getName()
            );
            if (cambioNombre && zonaRepository.existsByName(nuevoNombre)) {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una zona con ese nombre"
                );
            }
            zona.setName(nuevoNombre);
        }

        zona.setDescription(request.getDescription());

        if (request.getType() != null) {
            zona.setType(request.getType());
        }

        zona.setDateModified(LocalDateTime.now());

        return toResponse(zonaRepository.save(zona));
    }

    @Override
    public void desactivarZona(UUID idZone) {
        Zona zona = zonaRepository
            .findById(idZone)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Zona no encontrada"
                )
            );

        zona.setStatus(0);
        zona.setDateModified(LocalDateTime.now());
        zonaRepository.save(zona);
        espacioServicio.desactivarEspaciosPorZona(idZone);
    }

    private String generarCodigoUnico() {
        String code;
        do {
            code = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 4)
                .toUpperCase(Locale.ROOT);
        } while (zonaRepository.existsByCode(code));
        return code;
    }

    private ZonaResponseDTO toResponse(Zona objZona) {
        return ZonaResponseDTO.builder()
            .zoneId(objZona.getId())
            .name(objZona.getName())
            .code(objZona.getCode())
            .description(objZona.getDescription())
            .status(objZona.getStatus())
            .type(objZona.getType())
            .capacidad(objZona.getCapacidad())
            .spaces(objZona.getSpaces())
            .dateCreated(objZona.getDateCreated())
            .dateModified(objZona.getDateModified())
            .build();
    }
}

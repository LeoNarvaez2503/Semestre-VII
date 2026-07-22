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
import ec.edu.espe.zonas.utils.RabbitMQAuditPublisher;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EspacioServicioImpl implements EspacioServicio {

    private final EspacioRepository repositorioEspacio;
    private final ZonaRepository zonaRepository;
    private final UtilsMappers mapper;
    private final RabbitMQAuditPublisher rabbitMQAuditPublisher;

    @Override
    public List<EspacioResponseDTO> obtenerEspacios() {
        return repositorioEspacio
            .findAll()
            .stream()
            .filter(e -> e.isStatus() && e.getZone() != null && e.getZone().getStatus() == 1)
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
        if (dto.getDescription() == null || dto.getDescription().trim().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre o número del espacio es obligatorio (ej. E-101)"
            );
        }
        String descClean = dto.getDescription().trim();
        boolean existsDesc = repositorioEspacio.findByZoneId(objZona.getId()).stream()
            .anyMatch(e -> e.getDescription() != null && e.getDescription().trim().equalsIgnoreCase(descClean));
        if (existsDesc) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Ya existe un espacio con el nombre \"" + descClean + "\" en esta zona"
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
        Espacio saved = repositorioEspacio.save(newSpace);
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("id", saved.getId().toString());
            data.put("code", saved.getCode());
            data.put("type", saved.getType().name());
            data.put("estado", saved.getEstado().name());
            data.put("zoneId", saved.getZone().getId().toString());
            rabbitMQAuditPublisher.publishEvent("CREATE", "ESPACIO", data);
        } catch (Exception e) {
            // ignore
        }
        return mapper.toResponseDTO(saved);
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
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("id", espacio.getId().toString());
            data.put("code", espacio.getCode());
            rabbitMQAuditPublisher.publishEvent("DELETE", "ESPACIO", data);
        } catch (Exception e) {
            // ignore
        }
    }

    @Override
    public EspacioResponseDTO cambiarEstado(
        UUID idEspacio,
        EstadoEspacio estado,
        UUID vehiculoId
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

        // Reglas de negocio para vehículos
        if (estado == EstadoEspacio.OCUPADO) {
            if (vehiculoId == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe proporcionar el ID del vehículo para ocupar el espacio"
                );
            }
            
            // Validar vehículo con contrato interno
            try {
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                String vehiculosHost = System.getenv("VEHICULOS_API_URL");
                if (vehiculosHost == null || vehiculosHost.trim().isEmpty()) {
                    vehiculosHost = "http://vehiculos-service:3000";
                }
                String url = vehiculosHost + "/vehiculos/internal/validar/" + vehiculoId;
                java.util.Map<String, Object> response = restTemplate.getForObject(url, java.util.Map.class);
                
                if (response == null || !Boolean.TRUE.equals(response.get("exists"))) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El vehículo no existe");
                }
                
                String tipoVehiculo = (String) response.get("type");
                if (!tipoVehiculo.equalsIgnoreCase(espacio.getType().name())) {
                    throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, 
                        "El tipo de vehículo (" + tipoVehiculo + ") no coincide con el tipo de espacio (" + espacio.getType() + ")"
                    );
                }
                
                espacio.setVehiculoId(vehiculoId);
            } catch (ResponseStatusException e) {
                throw e;
            } catch (org.springframework.web.client.HttpClientErrorException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al validar el vehículo", e);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Servicio de vehículos no disponible", e);
            }
        } else if (estado == EstadoEspacio.DISPONIBLE) {
            espacio.setVehiculoId(null);
        }

        espacio.setEstado(estado);
        espacio.setDateModified(java.time.LocalDateTime.now());
        Espacio saved = repositorioEspacio.save(espacio);
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("id", saved.getId().toString());
            data.put("code", saved.getCode());
            data.put("estado", saved.getEstado().name());
            if (saved.getVehiculoId() != null) {
                data.put("vehiculoId", saved.getVehiculoId().toString());
            }
            rabbitMQAuditPublisher.publishEvent("UPDATE", "ESPACIO", data);
        } catch (Exception e) {
            // ignore
        }
        return mapper.toResponseDTO(saved);
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
        repositorioEspacio.deleteAll(espacios);
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

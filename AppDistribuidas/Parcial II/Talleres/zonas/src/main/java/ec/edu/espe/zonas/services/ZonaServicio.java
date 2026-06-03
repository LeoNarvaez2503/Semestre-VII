package ec.edu.espe.zonas.services;

import java.util.List;
import java.util.UUID;

import ec.edu.espe.zonas.dtos.ZonaRequestDto;
import ec.edu.espe.zonas.dtos.ZonaResponseDTO;

public interface ZonaServicio {
    List<ZonaResponseDTO> obtenerZonas();
    ZonaResponseDTO crearZona(ZonaRequestDto zonaRequest);
    ZonaResponseDTO actualizarZona(UUID idZone, ZonaRequestDto zonaRequest);
    void desactivarZona(UUID idZone);
}

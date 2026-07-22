package ec.edu.espe.zonas.services;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import java.util.List;
import java.util.UUID;

public interface EspacioServicio {
    List<EspacioResponseDTO> obtenerEspacios();
    EspacioResponseDTO obtenerEspacioPorId(UUID idEspacio);
    EspacioResponseDTO crearEspacio(EspacioRequestDTO dto);
    EspacioRequestDTO actualizaEspacio(EspacioRequestDTO dto);
    void eliminarEspacio(UUID idEspacio);
    EspacioResponseDTO cambiarEstado(UUID idEspacio, EstadoEspacio estado, UUID vehiculoId);
    List<EspacioResponseDTO> obtenerEspacioPorEstado(EstadoEspacio estado);
    List<EspacioResponseDTO> obtenerEspaciosPorZonaEstado(
        UUID idZona,
        EstadoEspacio estado
    );
    void desactivarEspaciosPorZona(UUID idZona);
}

package ec.edu.espe.zonas.services;

import java.util.List;
import java.util.UUID;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.EstadoEspacio;

public interface EspacioServicio {
    List<EspacioResponseDTO> obtenerEspacios();
    EspacioResponseDTO crearEspacio(EspacioRequestDTO dto);
    EspacioRequestDTO actualizaEspacio(EspacioRequestDTO dto);
    void eliminarEspacio(UUID idEspacio);
    EspacioResponseDTO cambiarEstado(UUID idEspacio, EstadoEspacio estado);
    List<EspacioResponseDTO> obtenerEspacioPorEstado(EstadoEspacio estado);
    List<EspacioResponseDTO> obtenerEspaciosPorZonaEstado(UUID idZona, EstadoEspacio estado);
    
}

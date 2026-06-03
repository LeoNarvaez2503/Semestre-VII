package ec.edu.espe.zonas.controllers;

import ec.edu.espe.zonas.dtos.EspacioRequestDTO;
import ec.edu.espe.zonas.dtos.EspacioResponseDTO;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.services.EspacioServicio;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/espacios")
@RequiredArgsConstructor
public class EspacioControlador {

    private final EspacioServicio espacioServicio;

    @GetMapping("/")
    public ResponseEntity<List<EspacioResponseDTO>> listarEspacios() {
        return ResponseEntity.ok(espacioServicio.obtenerEspacios());
    }

    @GetMapping("/{idEspacio}")
    public ResponseEntity<EspacioResponseDTO> obtenerEspacio(@PathVariable UUID idEspacio) {
        return ResponseEntity.ok(espacioServicio.obtenerEspacioPorId(idEspacio));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EspacioResponseDTO>> listarPorEstado(@PathVariable EstadoEspacio estado) {
        return ResponseEntity.ok(espacioServicio.obtenerEspacioPorEstado(estado));
    }

    @GetMapping("/zona/{idZona}/estado/{estado}")
    public ResponseEntity<List<EspacioResponseDTO>> listarPorZonaYEstado(
            @PathVariable UUID idZona,
            @PathVariable EstadoEspacio estado) {
        return ResponseEntity.ok(espacioServicio.obtenerEspaciosPorZonaEstado(idZona, estado));
    }

    @PostMapping("/")
    public ResponseEntity<EspacioResponseDTO> crearEspacio(@Valid @RequestBody EspacioRequestDTO request) {
        return new ResponseEntity<>(espacioServicio.crearEspacio(request), HttpStatus.CREATED);
    }

    @PutMapping("/{idEspacio}/estado/{estado}")
    public ResponseEntity<EspacioResponseDTO> cambiarEstado(
            @PathVariable UUID idEspacio,
            @PathVariable EstadoEspacio estado) {
        return ResponseEntity.ok(espacioServicio.cambiarEstado(idEspacio, estado));
    }

    @DeleteMapping("/{idEspacio}")
    public ResponseEntity<Void> eliminarEspacio(@PathVariable UUID idEspacio) {
        espacioServicio.eliminarEspacio(idEspacio);
        return ResponseEntity.noContent().build();
    }
}

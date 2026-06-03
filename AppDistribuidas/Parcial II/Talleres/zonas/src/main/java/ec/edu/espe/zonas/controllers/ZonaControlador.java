package ec.edu.espe.zonas.controllers;

import ec.edu.espe.zonas.dtos.ZonaRequestDto;
import ec.edu.espe.zonas.dtos.ZonaResponseDTO;
import ec.edu.espe.zonas.services.ZonaServicio;
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
@RequestMapping("/api/v1/zonas")
@RequiredArgsConstructor
public class ZonaControlador {

    private final ZonaServicio zonaServicio;

    @GetMapping("/")
    public ResponseEntity<List<ZonaResponseDTO>> listarZonas() {
        return ResponseEntity.ok(zonaServicio.obtenerZonas());
    }

    @PostMapping("/")
    public ResponseEntity<ZonaResponseDTO> crearZona(
        @Valid @RequestBody ZonaRequestDto request
    ) {
        return new ResponseEntity<>(
            zonaServicio.crearZona(request),
            HttpStatus.CREATED
        );
    }

    @PutMapping("/{idZona}")
    public ResponseEntity<ZonaResponseDTO> actualizarZona(
        @PathVariable UUID idZona,
        @Valid @RequestBody ZonaRequestDto request
    ) {
        return ResponseEntity.ok(zonaServicio.actualizarZona(idZona, request));
    }

    @DeleteMapping("/{idZona}")
    public ResponseEntity<Void> desactivarZona(@PathVariable UUID idZona) {
        zonaServicio.desactivarZona(idZona);
        return ResponseEntity.noContent().build();
    }
}

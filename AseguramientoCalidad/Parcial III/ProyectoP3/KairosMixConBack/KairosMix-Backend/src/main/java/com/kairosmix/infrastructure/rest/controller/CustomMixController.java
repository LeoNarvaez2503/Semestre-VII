package com.kairosmix.infrastructure.rest.controller;

import com.kairosmix.application.usecases.CreateCustomMixUseCase;
import com.kairosmix.domain.entities.CustomMix;
import com.kairosmix.domain.ports.output.CustomMixRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.CustomMixDTO;
import com.kairosmix.infrastructure.mapper.CustomMixMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/custom-mixes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CustomMixController {
    private final CreateCustomMixUseCase createCustomMixUseCase;
    private final CustomMixRepositoryPort customMixRepository;
    private final CustomMixMapper customMixMapper;

    @PostMapping
    public ResponseEntity<CustomMixDTO> createCustomMix(@Valid @RequestBody CustomMixDTO customMixDTO) {
        CustomMix customMix = customMixMapper.dtoToEntity(customMixDTO);
        CustomMix created = createCustomMixUseCase.execute(customMix);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(customMixMapper.entityToDto(created));
    }

    @GetMapping
    public ResponseEntity<List<CustomMixDTO>> listCustomMixes() {
        List<CustomMix> mixes = customMixRepository.findAll();
        return ResponseEntity.ok(mixes.stream()
            .map(customMixMapper::entityToDto)
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomMixDTO> getCustomMix(@PathVariable Long id) {
        CustomMix customMix = customMixRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Mezcla no encontrada: " + id));
        return ResponseEntity.ok(customMixMapper.entityToDto(customMix));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CustomMixDTO>> getCustomMixesByClient(@PathVariable Long clientId) {
        List<CustomMix> mixes = customMixRepository.findByClientId(clientId);
        return ResponseEntity.ok(mixes.stream()
            .map(customMixMapper::entityToDto)
            .toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomMix(@PathVariable Long id) {
        CustomMix customMix = customMixRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Mezcla no encontrada: " + id));
        customMixRepository.delete(customMix);
        return ResponseEntity.noContent().build();
    }
}

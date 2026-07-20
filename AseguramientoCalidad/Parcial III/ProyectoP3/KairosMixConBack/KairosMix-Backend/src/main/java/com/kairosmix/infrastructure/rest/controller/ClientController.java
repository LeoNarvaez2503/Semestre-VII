package com.kairosmix.infrastructure.rest.controller;

import com.kairosmix.application.usecases.CreateClientUseCase;
import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.ClientDTO;
import com.kairosmix.infrastructure.mapper.ClientMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientController {
    private final CreateClientUseCase createClientUseCase;
    private final ClientRepositoryPort clientRepository;
    private final ClientMapper clientMapper;

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@Valid @RequestBody ClientDTO clientDTO) {
        Client client = clientMapper.dtoToEntity(clientDTO);
        Client created = createClientUseCase.execute(client);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(clientMapper.entityToDto(created));
    }

    @GetMapping
    public ResponseEntity<List<ClientDTO>> listClients() {
        List<Client> clients = clientRepository.findAll();
        return ResponseEntity.ok(clients.stream()
            .map(clientMapper::entityToDto)
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClient(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + id));
        return ResponseEntity.ok(clientMapper.entityToDto(client));
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<ClientDTO> getClientByDocument(@PathVariable String documentId) {
        Client client = clientRepository.findByDocumentId(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + documentId));
        return ResponseEntity.ok(clientMapper.entityToDto(client));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + id));
        clientRepository.delete(client);
        return ResponseEntity.noContent().build();
    }
}

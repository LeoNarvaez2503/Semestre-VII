package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateClientUseCase {
    private final ClientRepositoryPort clientRepository;

    public Client execute(Client client) {
        if (client == null) {
            throw new IllegalArgumentException("El cliente no puede ser nulo");
        }

        // Validar que el documento sea único
        clientRepository.findByDocumentId(client.getDocumentId()).ifPresent(c -> {
            throw new IllegalArgumentException("El documento ya está registrado: " + client.getDocumentId());
        });

        // Validar integridad del cliente
        client.validateClientData();

        return clientRepository.save(client);
    }
}

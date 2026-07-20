package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.ports.output.ClientRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ClientRepositoryAdapter implements ClientRepositoryPort {
    private final JpaClientRepository jpaClientRepository;

    @Override
    public Client save(Client client) {
        return jpaClientRepository.save(client);
    }

    @Override
    public Optional<Client> findById(Long id) {
        return jpaClientRepository.findById(id);
    }

    @Override
    public Optional<Client> findByDocumentId(String documentId) {
        return jpaClientRepository.findByDocumentId(documentId);
    }

    @Override
    public List<Client> findAll() {
        return jpaClientRepository.findAll();
    }

    @Override
    public void delete(Client client) {
        jpaClientRepository.delete(client);
    }
}

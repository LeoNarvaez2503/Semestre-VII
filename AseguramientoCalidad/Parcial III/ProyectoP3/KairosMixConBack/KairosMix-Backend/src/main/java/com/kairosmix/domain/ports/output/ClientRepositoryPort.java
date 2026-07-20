package com.kairosmix.domain.ports.output;

import com.kairosmix.domain.entities.Client;
import java.util.List;
import java.util.Optional;

public interface ClientRepositoryPort {
    Client save(Client client);
    Optional<Client> findById(Long id);
    Optional<Client> findByDocumentId(String documentId);
    List<Client> findAll();
    void delete(Client client);
}

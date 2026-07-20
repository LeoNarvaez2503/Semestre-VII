package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByDocumentId(String documentId);
}

package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.CustomMix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaCustomMixRepository extends JpaRepository<CustomMix, Long> {
    Optional<CustomMix> findByName(String name);
    List<CustomMix> findByClientId(Long clientId);
}

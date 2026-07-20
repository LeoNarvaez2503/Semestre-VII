package com.kairosmix.domain.ports.output;

import com.kairosmix.domain.entities.CustomMix;
import java.util.List;
import java.util.Optional;

public interface CustomMixRepositoryPort {
    CustomMix save(CustomMix customMix);
    Optional<CustomMix> findById(Long id);
    Optional<CustomMix> findByName(String name);
    List<CustomMix> findAll();
    List<CustomMix> findByClientId(Long clientId);
    void delete(CustomMix customMix);
}

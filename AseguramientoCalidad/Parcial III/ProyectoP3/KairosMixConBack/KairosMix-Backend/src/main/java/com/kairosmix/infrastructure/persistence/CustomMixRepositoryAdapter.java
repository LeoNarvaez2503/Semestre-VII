package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.CustomMix;
import com.kairosmix.domain.ports.output.CustomMixRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomMixRepositoryAdapter implements CustomMixRepositoryPort {
    private final JpaCustomMixRepository jpaCustomMixRepository;

    @Override
    public CustomMix save(CustomMix customMix) {
        return jpaCustomMixRepository.save(customMix);
    }

    @Override
    public Optional<CustomMix> findById(Long id) {
        return jpaCustomMixRepository.findById(id);
    }

    @Override
    public Optional<CustomMix> findByName(String name) {
        return jpaCustomMixRepository.findByName(name);
    }

    @Override
    public List<CustomMix> findAll() {
        return jpaCustomMixRepository.findAll();
    }

    @Override
    public List<CustomMix> findByClientId(Long clientId) {
        return jpaCustomMixRepository.findByClientId(clientId);
    }

    @Override
    public void delete(CustomMix customMix) {
        jpaCustomMixRepository.delete(customMix);
    }
}

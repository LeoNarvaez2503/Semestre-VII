package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepositoryPort {
    private final JpaProductRepository jpaProductRepository;

    @Override
    public Product save(Product product) {
        return jpaProductRepository.save(product);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaProductRepository.findById(id);
    }

    @Override
    public Optional<Product> findByCode(String code) {
        return jpaProductRepository.findByCode(code);
    }

    @Override
    public List<Product> findAll() {
        return jpaProductRepository.findAll();
    }

    @Override
    public void delete(Product product) {
        jpaProductRepository.delete(product);
    }
}

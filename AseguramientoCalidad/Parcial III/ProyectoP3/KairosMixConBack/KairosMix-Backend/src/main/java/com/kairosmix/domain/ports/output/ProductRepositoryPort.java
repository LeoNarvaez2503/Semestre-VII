package com.kairosmix.domain.ports.output;

import com.kairosmix.domain.entities.Product;
import java.util.List;
import java.util.Optional;

public interface ProductRepositoryPort {
    Product save(Product product);
    Optional<Product> findById(Long id);
    Optional<Product> findByCode(String code);
    List<Product> findAll();
    void delete(Product product);
}

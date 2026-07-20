package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCode(String code);
}

package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateProductUseCase {
    private final ProductRepositoryPort productRepository;

    public Product execute(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("El producto no puede ser nulo");
        }

        // Validar que el código sea único
        productRepository.findByCode(product.getCode()).ifPresent(p -> {
            throw new IllegalArgumentException("El código del producto ya existe: " + product.getCode());
        });

        // Inicializar stock actual
        if (product.getInitialStock() != null) {
            product.setCurrentStock(product.getInitialStock());
        }

        return productRepository.save(product);
    }
}

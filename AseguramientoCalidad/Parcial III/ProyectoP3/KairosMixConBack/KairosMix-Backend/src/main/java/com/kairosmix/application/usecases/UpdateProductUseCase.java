package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateProductUseCase {
    private final ProductRepositoryPort productRepository;

    public Product execute(Long productId, Product productData) {
        if (productId == null) {
            throw new IllegalArgumentException("El ID del producto es requerido");
        }

        Product existingProduct = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + productId));

        // Validar que el código no exista en otro producto
        if (productData.getCode() != null && !productData.getCode().equals(existingProduct.getCode())) {
            productRepository.findByCode(productData.getCode()).ifPresent(p -> {
                throw new IllegalArgumentException("El código ya está registrado: " + productData.getCode());
            });
        }

        // Actualizar campos
        if (productData.getName() != null) {
            existingProduct.setName(productData.getName());
        }
        if (productData.getCode() != null) {
            existingProduct.setCode(productData.getCode());
        }
        if (productData.getCountryOfOrigin() != null) {
            existingProduct.setCountryOfOrigin(productData.getCountryOfOrigin());
        }
        if (productData.getPricePerPound() != null) {
            existingProduct.setPricePerPound(productData.getPricePerPound());
        }
        if (productData.getWholesalePrice() != null) {
            existingProduct.setWholesalePrice(productData.getWholesalePrice());
        }
        if (productData.getRetailPrice() != null) {
            existingProduct.setRetailPrice(productData.getRetailPrice());
        }

        return productRepository.save(existingProduct);
    }
}

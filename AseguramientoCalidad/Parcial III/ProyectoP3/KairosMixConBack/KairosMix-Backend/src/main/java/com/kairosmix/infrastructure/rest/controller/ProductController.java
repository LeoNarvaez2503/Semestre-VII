package com.kairosmix.infrastructure.rest.controller;

import com.kairosmix.application.usecases.CreateProductUseCase;
import com.kairosmix.application.usecases.UpdateProductUseCase;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import com.kairosmix.infrastructure.rest.dto.ProductDTO;
import com.kairosmix.infrastructure.mapper.ProductMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {
    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final ProductRepositoryPort productRepository;
    private final ProductMapper productMapper;

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Product product = productMapper.dtoToEntity(productDTO);
        Product created = createProductUseCase.execute(product);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(productMapper.entityToDto(created));
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> listProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products.stream()
            .map(productMapper::entityToDto)
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + id));
        return ResponseEntity.ok(productMapper.entityToDto(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductDTO productDTO) {
        Product productData = productMapper.dtoToEntity(productDTO);
        Product updated = updateProductUseCase.execute(id, productData);
        return ResponseEntity.ok(productMapper.entityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + id));
        productRepository.delete(product);
        return ResponseEntity.noContent().build();
    }
}

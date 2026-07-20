package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("Create Product Use Case Tests")
class CreateProductUseCaseTest {

    @Mock
    private ProductRepositoryPort productRepository;

    private CreateProductUseCase createProductUseCase;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        createProductUseCase = new CreateProductUseCase(productRepository);
    }

    @Test
    @DisplayName("Should create product successfully")
    void testCreateProductSuccess() {
        Product product = Product.builder()
            .code("PROD001")
            .name("Test Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(BigDecimal.valueOf(10.0))
            .wholesalePrice(BigDecimal.valueOf(8.0))
            .retailPrice(BigDecimal.valueOf(12.0))
            .initialStock(100)
            .build();

        when(productRepository.findByCode("PROD001")).thenReturn(Optional.empty());
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = createProductUseCase.execute(product);

        assertNotNull(result);
        assertEquals("PROD001", result.getCode());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    @DisplayName("Should throw exception when product code already exists")
    void testCreateProductDuplicateCode() {
        Product existingProduct = Product.builder()
            .id(1L)
            .code("PROD001")
            .build();

        Product newProduct = Product.builder()
            .code("PROD001")
            .name("Test Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(BigDecimal.valueOf(10.0))
            .wholesalePrice(BigDecimal.valueOf(8.0))
            .retailPrice(BigDecimal.valueOf(12.0))
            .initialStock(100)
            .build();

        when(productRepository.findByCode("PROD001")).thenReturn(Optional.of(existingProduct));

        assertThrows(IllegalArgumentException.class, () -> {
            createProductUseCase.execute(newProduct);
        });

        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when product is null")
    void testCreateProductNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            createProductUseCase.execute(null);
        });
    }

    @Test
    @DisplayName("Should initialize stock when creating product")
    void testInitializeStock() {
        Product product = Product.builder()
            .code("PROD002")
            .name("Test Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(BigDecimal.valueOf(10.0))
            .wholesalePrice(BigDecimal.valueOf(8.0))
            .retailPrice(BigDecimal.valueOf(12.0))
            .initialStock(50)
            .build();

        when(productRepository.findByCode("PROD002")).thenReturn(Optional.empty());
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product result = createProductUseCase.execute(product);

        assertEquals(50, result.getCurrentStock());
    }
}

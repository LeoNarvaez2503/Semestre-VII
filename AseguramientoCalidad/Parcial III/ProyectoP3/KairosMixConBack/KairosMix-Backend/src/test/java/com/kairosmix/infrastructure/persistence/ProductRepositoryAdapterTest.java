package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProductRepositoryAdapterTest {

    @Autowired
    private ProductRepositoryAdapter productRepositoryAdapter;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
            .code("TEST-001")
            .name("Test Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(java.math.BigDecimal.valueOf(10.0))
            .wholesalePrice(java.math.BigDecimal.valueOf(8.0))
            .retailPrice(java.math.BigDecimal.valueOf(12.0))
            .initialStock(100)
            .currentStock(100)
            .build();
    }

    @Test
    void testSaveProduct() {
        Product saved = productRepositoryAdapter.save(testProduct);
        
        assertNotNull(saved.getId());
        assertEquals(testProduct.getCode(), saved.getCode());
        assertEquals(testProduct.getName(), saved.getName());
    }

    @Test
    void testFindProductById() {
        Product saved = productRepositoryAdapter.save(testProduct);
        Optional<Product> found = productRepositoryAdapter.findById(saved.getId());
        
        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
    }

    @Test
    void testFindProductByCode() {
        productRepositoryAdapter.save(testProduct);
        Optional<Product> found = productRepositoryAdapter.findByCode("TEST-001");
        
        assertTrue(found.isPresent());
        assertEquals("TEST-001", found.get().getCode());
    }

    @Test
    void testFindAllProducts() {
        productRepositoryAdapter.save(testProduct);
        List<Product> all = productRepositoryAdapter.findAll();
        
        assertFalse(all.isEmpty());
        assertTrue(all.stream().anyMatch(p -> p.getCode().equals("TEST-001")));
    }

    @Test
    void testDeleteProduct() {
        Product saved = productRepositoryAdapter.save(testProduct);
        productRepositoryAdapter.delete(saved);
        Optional<Product> found = productRepositoryAdapter.findById(saved.getId());
        
        assertTrue(found.isEmpty());
    }
}

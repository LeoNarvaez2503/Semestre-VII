package com.kairosmix.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setInitialStock(10);
        product.setCurrentStock(10);
    }

    @Test
    void testValidateStock_Valid() {
        assertDoesNotThrow(() -> product.validateStock());
    }

    @Test
    void testValidateStock_Invalid() {
        product.setCurrentStock(-1);
        assertThrows(IllegalArgumentException.class, () -> product.validateStock());
    }

    @Test
    void testReduceStock_Valid() {
        product.reduceStock(5);
        assertEquals(5, product.getCurrentStock());
    }

    @Test
    void testReduceStock_InvalidQuantity() {
        assertThrows(IllegalArgumentException.class, () -> product.reduceStock(-1));
        assertThrows(IllegalArgumentException.class, () -> product.reduceStock(null));
    }

    @Test
    void testReduceStock_Insufficient() {
        assertThrows(IllegalArgumentException.class, () -> product.reduceStock(15));
    }

    @Test
    void testReduceStock_CurrentStockNull() {
        product.setCurrentStock(null);
        product.reduceStock(5);
        assertEquals(5, product.getCurrentStock());
    }

    @Test
    void testIncreaseStock_Valid() {
        product.increaseStock(5);
        assertEquals(15, product.getCurrentStock());
    }

    @Test
    void testIncreaseStock_InvalidQuantity() {
        assertThrows(IllegalArgumentException.class, () -> product.increaseStock(-1));
        assertThrows(IllegalArgumentException.class, () -> product.increaseStock(null));
    }

    @Test
    void testIncreaseStock_CurrentStockNull() {
        product.setCurrentStock(null);
        product.increaseStock(5);
        assertEquals(15, product.getCurrentStock());
    }
}

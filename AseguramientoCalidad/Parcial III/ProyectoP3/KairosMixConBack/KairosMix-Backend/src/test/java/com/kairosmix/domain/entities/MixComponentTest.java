package com.kairosmix.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("MixComponent Entity Tests")
class MixComponentTest {

    private MixComponent mixComponent;
    private CustomMix customMix;
    private Product product;

    @BeforeEach
    void setUp() {
        customMix = CustomMix.builder()
            .id(1L)
            .name("Test Mix")
            .description("Test")
            .totalPrice(BigDecimal.ZERO)
            .components(new ArrayList<>())
            .build();

        product = Product.builder()
            .id(1L)
            .code("TEST01")
            .name("Test Product")
            .countryOfOrigin("Test Country")
            .pricePerPound(BigDecimal.valueOf(10.0))
            .wholesalePrice(BigDecimal.valueOf(8.0))
            .retailPrice(BigDecimal.valueOf(12.0))
            .initialStock(100)
            .currentStock(100)
            .build();

        mixComponent = MixComponent.builder()
            .id(1L)
            .customMix(customMix)
            .product(product)
            .quantity(5.0)
            .unitPrice(BigDecimal.valueOf(10.0))
            .build();
    }

    @Test
    @DisplayName("Should create mix component successfully")
    void testCreateComponent() {
        assertNotNull(mixComponent);
        assertEquals(5.0, mixComponent.getQuantity());
        assertEquals(BigDecimal.valueOf(10.0), mixComponent.getUnitPrice());
    }

    @Test
    @DisplayName("Should calculate subtotal correctly")
    void testGetSubtotal() {
        BigDecimal subtotal = mixComponent.getSubtotal();
        assertEquals(0, subtotal.compareTo(BigDecimal.valueOf(50.0)));
    }

    @Test
    @DisplayName("Should return zero when unitPrice is null")
    void testGetSubtotalNullPrice() {
        mixComponent.setUnitPrice(null);
        assertEquals(BigDecimal.ZERO, mixComponent.getSubtotal());
    }

    @Test
    @DisplayName("Should return zero when quantity is null")
    void testGetSubtotalNullQuantity() {
        mixComponent.setQuantity(null);
        assertEquals(BigDecimal.ZERO, mixComponent.getSubtotal());
    }

    @Test
    @DisplayName("Should validate component successfully")
    void testValidateComponent() {
        assertDoesNotThrow(mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when quantity is null")
    void testValidateComponentNullQuantity() {
        mixComponent.setQuantity(null);
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when quantity is zero")
    void testValidateComponentZeroQuantity() {
        mixComponent.setQuantity(0.0);
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when quantity is negative")
    void testValidateComponentNegativeQuantity() {
        mixComponent.setQuantity(-5.0);
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when unitPrice is null")
    void testValidateComponentNullPrice() {
        mixComponent.setUnitPrice(null);
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when unitPrice is zero")
    void testValidateComponentZeroPrice() {
        mixComponent.setUnitPrice(BigDecimal.ZERO);
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when unitPrice is negative")
    void testValidateComponentNegativePrice() {
        mixComponent.setUnitPrice(BigDecimal.valueOf(-10.0));
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }

    @Test
    @DisplayName("Should throw exception when product is null")
    void testValidateComponentNullProduct() {
        mixComponent.setProduct(null);
        assertThrows(IllegalArgumentException.class, mixComponent::validateComponent);
    }
}

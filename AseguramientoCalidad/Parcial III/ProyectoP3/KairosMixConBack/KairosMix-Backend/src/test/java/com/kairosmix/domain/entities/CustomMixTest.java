package com.kairosmix.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CustomMix Entity Tests")
class CustomMixTest {

    private CustomMix customMix;
    private Client client;
    private Product product;

    @BeforeEach
    void setUp() {
        client = Client.builder()
            .id(1L)
            .documentId("1234567890")
            .documentType(Client.DocumentType.CEDULA)
            .name("Juan Pérez")
            .email("juan@email.com")
            .phone("0998765432")
            .address("Av. Test 123")
            .city("Quito")
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

        customMix = CustomMix.builder()
            .id(1L)
            .name("Custom Mix Test")
            .description("Test Mix Description")
            .client(client)
            .totalPrice(BigDecimal.ZERO)
            .components(new ArrayList<>())
            .build();
    }

    @Test
    @DisplayName("Should create custom mix successfully")
    void testCreateCustomMix() {
        assertNotNull(customMix);
        assertEquals("Custom Mix Test", customMix.getName());
        assertEquals(client, customMix.getClient());
    }

    @Test
    @DisplayName("Should add component to mix")
    void testAddComponent() {
        MixComponent component = MixComponent.builder()
            .product(product)
            .quantity(5.0)
            .unitPrice(BigDecimal.valueOf(10.0))
            .customMix(customMix)
            .build();

        customMix.addComponent(component);
        assertEquals(1, customMix.getComponents().size());
        assertEquals(component, customMix.getComponents().get(0));
    }

    @Test
    @DisplayName("Should throw exception when adding null component")
    void testAddNullComponent() {
        assertThrows(IllegalArgumentException.class, () -> {
            customMix.addComponent(null);
        });
    }

    @Test
    @DisplayName("Should calculate total price correctly")
    void testCalculateTotal() {
        MixComponent component1 = MixComponent.builder()
            .product(product)
            .quantity(5.0)
            .unitPrice(BigDecimal.valueOf(10.0))
            .customMix(customMix)
            .build();

        MixComponent component2 = MixComponent.builder()
            .product(product)
            .quantity(3.0)
            .unitPrice(BigDecimal.valueOf(15.0))
            .customMix(customMix)
            .build();

        customMix.addComponent(component1);
        customMix.addComponent(component2);
        customMix.calculateTotal();

        BigDecimal expected = BigDecimal.valueOf(50.0).add(BigDecimal.valueOf(45.0));
        assertEquals(0, customMix.getTotalPrice().compareTo(expected));
    }

    @Test
    @DisplayName("Should throw exception on empty components validation")
    void testValidateMixEmpty() {
        assertThrows(IllegalArgumentException.class, customMix::validateMix);
    }

    @Test
    @DisplayName("Should validate mix with components successfully")
    void testValidateMixWithComponents() {
        MixComponent component = MixComponent.builder()
            .product(product)
            .quantity(5.0)
            .unitPrice(BigDecimal.valueOf(10.0))
            .customMix(customMix)
            .build();

        customMix.addComponent(component);
        assertDoesNotThrow(customMix::validateMix);
    }

    @Test
    @DisplayName("Should calculate nutritional info")
    void testCalculateNutritionalInfo() {
        MixComponent component = MixComponent.builder()
            .product(product)
            .quantity(5.0)
            .unitPrice(BigDecimal.valueOf(10.0))
            .customMix(customMix)
            .build();

        customMix.addComponent(component);
        MixNutritionalInfo info = customMix.calculateNutritionalInfo();
        assertNotNull(info);
    }

    @Test
    @DisplayName("Should handle empty components for nutritional info")
    void testCalculateNutritionalInfoEmpty() {
        MixNutritionalInfo info = customMix.calculateNutritionalInfo();
        assertNotNull(info);
    }
}

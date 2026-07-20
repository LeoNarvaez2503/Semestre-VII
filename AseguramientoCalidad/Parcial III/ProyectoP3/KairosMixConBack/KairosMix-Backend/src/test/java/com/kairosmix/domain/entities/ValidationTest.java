package com.kairosmix.domain.entities;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ValidationTest {

    @Test
    void testClientValidation() {
        Client client = new Client();
        assertThrows(IllegalArgumentException.class, () -> client.validateClientData());
        
        client.setDocumentId("12345");
        assertThrows(IllegalArgumentException.class, () -> client.validateClientData());
        
        client.setName("John");
        assertThrows(IllegalArgumentException.class, () -> client.validateClientData());
        
        client.setEmail("test@test.com");
        assertDoesNotThrow(() -> client.validateClientData());
    }

    @Test
    void testMixComponentValidation() {
        MixComponent component = new MixComponent();
        assertThrows(IllegalArgumentException.class, () -> component.validateComponent());
        
        component.setQuantity(1.0);
        assertThrows(IllegalArgumentException.class, () -> component.validateComponent());
        
        component.setUnitPrice(BigDecimal.ONE);
        assertThrows(IllegalArgumentException.class, () -> component.validateComponent());
        
        component.setProduct(new Product());
        assertDoesNotThrow(() -> component.validateComponent());
        
        assertEquals(BigDecimal.valueOf(1.0), component.getSubtotal());
        
        component.setUnitPrice(null);
        assertEquals(BigDecimal.ZERO, component.getSubtotal());
    }

    @Test
    void testCustomMixValidation() {
        CustomMix mix = new CustomMix();
        assertThrows(IllegalArgumentException.class, () -> mix.validateMix());
        
        mix.setTotalPrice(BigDecimal.ONE);
        assertThrows(IllegalArgumentException.class, () -> mix.validateMix());
        
        // Create a valid mix component
        MixComponent mc = new MixComponent();
        mc.setQuantity(1.0);
        mc.setUnitPrice(BigDecimal.TEN);
        Product product = new Product();
        product.setId(1L);
        product.setCode("TEST");
        mc.setProduct(product);
        mix.getComponents().add(mc);
        assertDoesNotThrow(() -> mix.validateMix());
    }
}

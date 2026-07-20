package com.kairosmix.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("OrderItem Entity Tests")
class OrderItemTest {

    private OrderItem orderItem;
    private Order order;
    private Product product;

    @BeforeEach
    void setUp() {
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

        order = Order.builder()
            .id(1L)
            .status(Order.OrderStatus.PENDING)
            .build();

        orderItem = OrderItem.builder()
            .id(1L)
            .order(order)
            .product(product)
            .quantity(5)
            .unitPrice(BigDecimal.valueOf(10.0))
            .priceType("RETAIL")
            .build();
    }

    @Test
    @DisplayName("Should create order item successfully")
    void testCreateOrderItem() {
        assertNotNull(orderItem);
        assertEquals(5, orderItem.getQuantity());
        assertEquals(BigDecimal.valueOf(10.0), orderItem.getUnitPrice());
        assertEquals("RETAIL", orderItem.getPriceType());
    }

    @Test
    @DisplayName("Should calculate subtotal correctly")
    void testGetSubtotal() {
        BigDecimal subtotal = orderItem.getSubtotal();
        assertEquals(0, subtotal.compareTo(BigDecimal.valueOf(50.0)));
    }

    @Test
    @DisplayName("Should return zero when unitPrice is null")
    void testGetSubtotalNullPrice() {
        orderItem.setUnitPrice(null);
        assertEquals(BigDecimal.ZERO, orderItem.getSubtotal());
    }

    @Test
    @DisplayName("Should return zero when quantity is null")
    void testGetSubtotalNullQuantity() {
        orderItem.setQuantity(null);
        assertEquals(BigDecimal.ZERO, orderItem.getSubtotal());
    }

    @Test
    @DisplayName("Should validate item successfully")
    void testValidateItem() {
        assertDoesNotThrow(orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when quantity is null")
    void testValidateItemNullQuantity() {
        orderItem.setQuantity(null);
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when quantity is zero")
    void testValidateItemZeroQuantity() {
        orderItem.setQuantity(0);
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when quantity is negative")
    void testValidateItemNegativeQuantity() {
        orderItem.setQuantity(-5);
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when unitPrice is null")
    void testValidateItemNullPrice() {
        orderItem.setUnitPrice(null);
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when unitPrice is zero")
    void testValidateItemZeroPrice() {
        orderItem.setUnitPrice(BigDecimal.ZERO);
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when unitPrice is negative")
    void testValidateItemNegativePrice() {
        orderItem.setUnitPrice(BigDecimal.valueOf(-10.0));
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should throw exception when product is null")
    void testValidateItemNullProduct() {
        orderItem.setProduct(null);
        assertThrows(IllegalArgumentException.class, orderItem::validateItem);
    }

    @Test
    @DisplayName("Should use WHOLESALE price type")
    void testOrderItemWholesalePrice() {
        orderItem.setPriceType("WHOLESALE");
        assertEquals("WHOLESALE", orderItem.getPriceType());
    }
}

package com.kairosmix.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Order Entity Tests")
class OrderTest {

    private Order order;
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

        order = Order.builder()
            .id(1L)
            .client(client)
            .status(Order.OrderStatus.PENDING)
            .totalPrice(BigDecimal.valueOf(0))
            .build();

        OrderItem item = OrderItem.builder()
            .product(product)
            .quantity(5)
            .unitPrice(BigDecimal.valueOf(10.0))
            .build();
        order.addItem(item);
    }

    @Test
    @DisplayName("Should create order successfully")
    void testCreateOrder() {
        assertNotNull(order);
        assertEquals(Order.OrderStatus.PENDING, order.getStatus());
        assertEquals(1, order.getItems().size());
    }

    @Test
    @DisplayName("Should transition from PENDING to PROCESSING")
    void testTransitionFromPendingToProcessing() {
        order.transitionTo(Order.OrderStatus.PROCESSING);
        assertEquals(Order.OrderStatus.PROCESSING, order.getStatus());
    }

    @Test
    @DisplayName("Should throw exception on invalid state transition")
    void testInvalidStateTransition() {
        order.setStatus(Order.OrderStatus.COMPLETED);
        assertThrows(IllegalStateException.class, () -> {
            order.transitionTo(Order.OrderStatus.PROCESSING);
        });
    }

    @Test
    @DisplayName("Should calculate total correctly")
    void testCalculateTotal() {
        order.calculateTotal();
        assertEquals(BigDecimal.valueOf(50.0), order.getTotalPrice());
    }

    @Test
    @DisplayName("Should add item to order")
    void testAddItem() {
        OrderItem newItem = OrderItem.builder()
            .product(product)
            .quantity(3)
            .unitPrice(BigDecimal.valueOf(15.0))
            .build();
        order.addItem(newItem);
        assertEquals(2, order.getItems().size());
    }

    @Test
    @DisplayName("Should throw exception when adding null item")
    void testAddNullItem() {
        assertThrows(IllegalArgumentException.class, () -> {
            order.addItem(null);
        });
    }

    @Test
    @DisplayName("Should set completedAt when transitioning to COMPLETED")
    void testCompletedAtTimestamp() {
        order.setStatus(Order.OrderStatus.PROCESSING);
        order.transitionTo(Order.OrderStatus.COMPLETED);
        assertNotNull(order.getCompletedAt());
    }

    @Test
    @DisplayName("Should cover multiple valid transitions across statuses")
    void testValidTransitionsAcrossStatuses() {
        // PENDING -> CANCELLED (exercise second operand of OR)
        order.setStatus(Order.OrderStatus.PENDING);
        order.transitionTo(Order.OrderStatus.CANCELLED);
        assertEquals(Order.OrderStatus.CANCELLED, order.getStatus());

        // PROCESSING -> WAITING
        order.setStatus(Order.OrderStatus.PROCESSING);
        order.transitionTo(Order.OrderStatus.WAITING);
        assertEquals(Order.OrderStatus.WAITING, order.getStatus());

        // WAITING -> PROCESSING
        order.transitionTo(Order.OrderStatus.PROCESSING);
        assertEquals(Order.OrderStatus.PROCESSING, order.getStatus());

        // CLIENT_PENDING -> PENDING
        order.setStatus(Order.OrderStatus.CLIENT_PENDING);
        order.transitionTo(Order.OrderStatus.PENDING);
        assertEquals(Order.OrderStatus.PENDING, order.getStatus());
    }

    @Test
    @DisplayName("Should throw on invalid transitions to cover negative branches")
    void testMoreInvalidTransitions() {
        order.setStatus(Order.OrderStatus.PENDING);
        assertThrows(IllegalStateException.class, () -> order.transitionTo(Order.OrderStatus.WAITING));

        order.setStatus(Order.OrderStatus.PROCESSING);
        assertThrows(IllegalStateException.class, () -> order.transitionTo(Order.OrderStatus.PENDING));

        order.setStatus(Order.OrderStatus.WAITING);
        assertThrows(IllegalStateException.class, () -> order.transitionTo(Order.OrderStatus.COMPLETED));

        order.setStatus(Order.OrderStatus.CLIENT_PENDING);
        assertThrows(IllegalStateException.class, () -> order.transitionTo(Order.OrderStatus.COMPLETED));

        order.setStatus(Order.OrderStatus.CANCELLED);
        assertThrows(IllegalStateException.class, () -> order.transitionTo(Order.OrderStatus.PENDING));
    }

    @Test
    @DisplayName("Should validate order branches for empty items and negative total")
    void testValidateOrderBranches() {
        Order o = Order.builder()
            .client(client)
            .status(Order.OrderStatus.PENDING)
            .items(new ArrayList<>())
            .totalPrice(BigDecimal.ZERO)
            .build();

        assertThrows(IllegalArgumentException.class, o::validateOrder);

        o.addItem(OrderItem.builder().product(product).quantity(1).unitPrice(BigDecimal.ONE).build());
        o.setTotalPrice(BigDecimal.valueOf(-1));
        assertThrows(IllegalArgumentException.class, o::validateOrder);

        o.setTotalPrice(BigDecimal.ONE);
        assertDoesNotThrow(o::validateOrder);
    }

    @Test
    @DisplayName("OrderStatus should expose description")
    void testOrderStatusDescription() {
        assertNotNull(Order.OrderStatus.PENDING.getDescription());
    }
}
